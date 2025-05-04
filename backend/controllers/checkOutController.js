import { createPaymentIntent } from '../services/ziinaService.js';
import Video from '../models/videoModel.js'; // Your model name is Video

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
      customer_email
    });

    res.json({
      confirmation_url: paymentData.next_action?.redirect_url || paymentData.confirmation_url,
      payment_intent_id: paymentData.id
    });

  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
};


export const handleZiinaWebhook = async (req, res) => {
  const event = req.body;

  if (event?.data?.status === "succeeded") {
    const paymentIntentId = event.data.id;
    const userEmail = event.data.customer_email;

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).send("User not found");

    const videoId = event.data.metadata?.videoId;  // Assuming you send videoId in metadata
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).send("Video not found");

    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
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