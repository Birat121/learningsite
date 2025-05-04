import { createPaymentIntent } from '../services/ziinaService.js';
import Video from '../models/videoModel.js';
import User from '../models/userModel.js';
import Enrollment from '../models/paymentModel.js';  // Assuming Enrollment model exists

export const handleCoursePayment = async (req, res) => {
  try {
    const { videoId } = req.body;
    const customer_email = req.user.email;

    if (!videoId) return res.status(400).json({ error: 'Missing videoId' });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const amountInFils = Math.round(video.price * 100); // Convert to fils for Ziina

    const paymentData = await createPaymentIntent({
      amount: amountInFils,
      currency: 'AED',
      email: customer_email,
      videoId: videoId,  // Ensure the videoId is passed to the payment creation service
    });

    res.json({
      confirmation_url: paymentData.next_action?.redirect_url || paymentData.confirmation_url,
      payment_intent_id: paymentData.id
    });

  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ error: 'Payment intent creation failed', details: err.message });
  }
};

export const handleZiinaWebhook = async (req, res) => {
  const event = req.body;

  if (event?.data?.status === "succeeded") {
    const paymentIntentId = event.data.id;
    const userEmail = event.data.customer_email;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error(`User not found with email: ${userEmail}`);
      return res.status(404).send("User not found");
    }

    const videoId = event.data.metadata?.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      console.error(`Video not found with ID: ${videoId}`);
      return res.status(404).send("Video not found");
    }

    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      video: video._id,
      paymentIntentId,
    });

    if (existingEnrollment) {
      return res.status(200).send("User already enrolled");
    }

    await Enrollment.create({
      user: user._id,
      video: video._id,
      paymentIntentId,
    });

    res.status(200).send("Enrollment recorded");

  } else {
    res.status(400).send("Payment not successful");
  }
};
