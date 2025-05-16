import { createPaymentIntent } from '../services/ziinaService.js';
import Course from '../models/course.js';
import User from '../models/userModel.js';
import Enrollment from '../models/paymentModel.js'; // Your enrollment/payment schema
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;

export const handleCoursePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const customer_email = req.user?.email;

    if (!courseId) return res.status(400).json({ error: 'Missing courseId' });
    if (!customer_email) return res.status(400).json({ error: 'Missing customer email' });

    console.log('Initiating payment for email:', customer_email);

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const amountInFils = Math.round(course.price * 100);

    const paymentData = await createPaymentIntent({
      amount: amountInFils,
      currency: 'AED',
      email: customer_email,
      metadata: {
        userEmail: customer_email,
        courseId: courseId,
      },
    });

    console.log("Ziina payment response:", paymentData);

    await Enrollment.create({
      user: req.user._id,
      course: course._id,
      paymentIntentId: paymentData.id,
      status: 'pending',
    });

    const redirectUrl = paymentData.redirect_url || paymentData.confirmation_url;

    if (!redirectUrl) {
      console.error('Redirect URL missing in Ziina response:', paymentData);
      return res.status(500).json({ error: 'Ziina did not return a redirect URL.' });
    }

    res.json({
      paymentUrl: redirectUrl,
      payment_intent_id: paymentData.id,
    });

  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({
      error: 'Payment intent creation failed',
      details: err.response?.data || err.message,
    });
  }
};

export const handleZiinaWebhook = async (req, res) => {
  try {
    // Allowed IP addresses
    const allowedIps = ['3.29.184.186', '3.29.190.95', '20.233.47.127'];

    // Get IP address
    const ip =
      req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;

    console.log('Webhook received from IP:', ip);

    // Check if the incoming IP is allowed
    if (!allowedIps.includes(ip)) {
      console.warn('❌ Webhook rejected — invalid IP:', ip);
      return res.status(403).send('Forbidden');
    }

    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-hmac-signature'];

    // Compute HMAC from the raw body and the secret key
    const computedHmac = crypto
      .createHmac('sha256', ZIINA_SECRET_KEY)
      .update(rawBody)
      .digest();

    const incomingSig = Buffer.from(signature, 'hex');

    // Compare the signatures securely
    if (
      incomingSig.length !== computedHmac.length ||
      !crypto.timingSafeEqual(incomingSig, computedHmac)
    ) {
      console.error('Invalid signature', { receivedSignature: signature });
      return res.status(400).send('Invalid signature');
    }

    // Handle the webhook event
    const event = req.body;
    console.log('Webhook event received:', event);

    const status = event?.data?.status;
    const paymentIntentId = event?.data?.id;
    const userEmail = event?.data?.metadata?.userEmail;
    const courseId = event?.data?.metadata?.courseId;

    if (!userEmail || !courseId || !paymentIntentId) {
      console.error('Missing metadata or payment ID');
      return res.status(400).send('Invalid webhook payload');
    }

    if (!['succeeded', 'completed'].includes(status)) {
      console.warn('Ignoring non-successful payment status:', status);
      return res.status(400).send('Payment not successful');
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error('User not found:', userEmail);
      return res.status(404).send('User not found');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found:', courseId);
      return res.status(404).send('Course not found');
    }

    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      paymentIntentId,
    });

    if (existingEnrollment) {
      if (existingEnrollment.status !== 'completed') {
        existingEnrollment.status = 'completed';
        await existingEnrollment.save();
        console.log('Updated enrollment to completed for:', userEmail);
      } else {
        console.log('Enrollment already marked as completed.');
      }
      return res.status(200).send('Enrollment updated');
    }

    // Fallback if enrollment wasn't created at intent stage (rare case)
    await Enrollment.create({
      user: user._id,
      course: course._id,
      paymentIntentId,
      status: 'completed',
    });

    console.log('Enrollment created via webhook:', userEmail);
    res.status(201).send('Enrollment recorded');

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Server Error');
  }
};
