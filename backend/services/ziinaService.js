import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;
const ZIINA_API_URL = process.env.ZIINA_API_URL;

export async function createPaymentIntent({ amount, currency, email, videoId }) {
  try {
    // Log the request details
    console.log('Creating payment intent with the following details:');
    console.log({
      amount,
      currency_code: currency,
      email,
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      metadata: { videoId }
    });

    // Create payment intent
    const paymentIntentResponse = await axios.post(
      `${ZIINA_API_URL}/payment_intent`,
      {
        amount,
        currency_code: currency,
        email,
        capture_method: 'automatic',
        confirmation_method: 'automatic',
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL,
        test: true,
        metadata: {
          videoId: videoId,  // Add videoId to the metadata here
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the successful response
    console.log('Payment intent created successfully:', paymentIntentResponse.data);

    // Set the webhook URL for event notifications (Optional: You can set this at the time of intent creation or separately)
    const webhookResponse = await axios.post(
      `${ZIINA_API_URL}/webhook`,
      {
        url: process.env.WEBHOOK_URL,  // The URL where Ziina will send payment updates
        secret: process.env.ZIINA_SECRET_KEY,  // Optional secret for HMAC signature validation
      },
      {
        headers: {
          Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the successful webhook setup
    console.log('Webhook URL set successfully:', webhookResponse.data);

    return paymentIntentResponse.data;  // Return the payment intent details

  } catch (error) {
    // Log error details
    console.error('Error creating payment intent or setting webhook:', error.message);

    // If error response data exists, log that as well
    if (error.response) {
      console.error('Error response from Ziina API:', error.response.data);
    }

    // Log the error stack trace if available
    if (error.stack) {
      console.error('Error stack trace:', error.stack);
    }

    throw new Error('Ziina payment intent creation or webhook setup failed');
  }
}
