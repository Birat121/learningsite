import { createPaymentIntent } from '../services/ziinaService.js';
import Video from '../models/videoModel.js';
import User from '../models/userModel.js';
import Enrollment from '../models/paymentModel.js';  // Assuming Enrollment model exists

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


const handleZiinaWebhook = async (req, res) => {
  const event = req.body;

  try {
    // Log the incoming webhook event for debugging purposes
    console.log('Webhook event received:', event);

    // Check if the payment was successful
    if (event?.data?.status === "succeeded") {
      const paymentIntentId = event.data.id;
      const userEmail = event.data.customer_email;  // Assuming this is correct in the webhook

      // Log user email to verify
      console.log('Received webhook for email:', userEmail);

      // Find the user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        console.error(`User with email ${userEmail} not found.`);
        return res.status(404).send("User not found");
      }

      const videoId = event.data.metadata?.videoId;  // Assuming videoId is in metadata
      if (!videoId) {
        console.error('videoId not found in metadata');
        return res.status(400).send("Video ID missing in webhook");
      }

      const video = await Video.findById(videoId);
      if (!video) {
        console.error(`Video with ID ${videoId} not found.`);
        return res.status(404).send("Video not found");
      }

      // Log video info
      console.log('Found video:', video);

      // Check if the user is already enrolled for this course
      const existingEnrollment = await Enrollment.findOne({
        user: user._id,
        video: video._id,
        paymentIntentId,
      });

      if (existingEnrollment) {
        console.log('User already enrolled for this video.');
        return res.status(200).send("User already enrolled");
      }

      // Create a new enrollment record
      await Enrollment.create({
        user: user._id,
        video: video._id,
        paymentIntentId,
      });

      // Successfully enrolled
      console.log('Enrollment successfully recorded for user:', userEmail);
      res.status(200).send("Enrollment recorded");

    } else {
      console.error("Payment not successful:", event);
      return res.status(400).send("Payment not successful");
    }
  } catch (error) {
    // Catch any other unexpected errors
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }
};
