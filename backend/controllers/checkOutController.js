import { createPaymentIntent } from '../services/ziinaService.js';
import Video from '../models/videoModel.js';
import User from '../models/userModel.js';
import Enrollment from '../models/paymentModel.js';  // Assuming Enrollment model exists
import crypto from 'crypto';
import dotenv from 'dotenv';
const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;


export const handleCoursePayment = async (req, res) => {
  try {
    const { videoId } = req.body;
    const customer_email = req.user?.email;

    if (!videoId) return res.status(400).json({ error: 'Missing videoId' });
    if (!customer_email) return res.status(400).json({ error: 'Missing customer email' });

    console.log('Initiating payment for email:', customer_email);

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const amountInFils = Math.round(video.price * 100);

    const paymentData = await createPaymentIntent({
      amount: amountInFils,
      currency: 'AED',
      email: customer_email,
      videoId,
    });

    console.log("Ziina payment response:", paymentData);

    const redirectUrl =
      paymentData.redirect_url ||
      paymentData.confirmation_url;

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
  const event = req.body;

  try {
    // Step 1: Verify HMAC signature (optional but recommended)
    const signature = req.headers['x-hmac-signature'];
    const computedSignature = crypto
      .createHmac('sha256', ZIINA_SECRET_KEY)
      .update(JSON.stringify(event))
      .digest('hex');

    if (signature !== computedSignature) {
      console.error('Invalid signature', { receivedSignature: signature, computedSignature });
      return res.status(400).send('Invalid signature');
    }

    console.log('Webhook event received:', event);

    // Step 2: Check payment success
    if (['succeeded', 'completed'].includes(event?.data?.status)) {
      const paymentIntentId = event.data.id;

      // ✅ Fetch email from metadata instead of event.data.customer_email
      const userEmail = event.data.metadata?.userEmail;
      const videoId = event.data.metadata?.videoId;

      if (!userEmail || !videoId) {
        console.error('Missing metadata fields:', { userEmail, videoId });
        return res.status(400).send('Metadata incomplete');
      }

      console.log('Received webhook for userEmail:', userEmail);

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        console.error('User not found:', userEmail);
        return res.status(404).send('User not found');
      }

      const video = await Video.findById(videoId);
      if (!video) {
        console.error('Video not found:', videoId);
        return res.status(404).send('Video not found');
      }

      // Check for existing enrollment
      const existingEnrollment = await Enrollment.findOne({
        user: user._id,
        video: video._id,
        paymentIntentId,
      });

      if (existingEnrollment) {
        console.log('User already enrolled:', userEmail);
        return res.status(200).send('Already enrolled');
      }

      // Create new enrollment
      await Enrollment.create({
        user: user._id,
        video: video._id,
        paymentIntentId,
      });

      console.log('Enrollment successful:', userEmail);
      return res.status(201).send('Enrollment recorded');
    } else {
      console.warn('Ignoring non-successful payment status:', event?.data?.status);
      return res.status(400).send('Payment not successful');
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).send('Internal Server Error');
  }
};