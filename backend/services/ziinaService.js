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
      metadata: { videoId, userEmail: email } // ✅ add userEmail here too
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
          videoId: videoId,
          userEmail: email, // ✅ this is what your webhook depends on
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

    // Set the webhook URL (optional)
    const webhookResponse = await axios.post(
      `${ZIINA_API_URL}/webhook`,
      {
        url: process.env.WEBHOOK_URL,
        secret: process.env.ZIINA_SECRET_KEY,
      },
      {
        headers: {
          Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Webhook URL set successfully:', webhookResponse.data);

    return paymentIntentResponse.data;

  } catch (error) {
    console.error('Error creating payment intent or setting webhook:', error.message);
    if (error.response) {
      console.error('Error response from Ziina API:', error.response.data);
    }
    if (error.stack) {
      console.error('Error stack trace:', error.stack);
    }
    throw new Error('Ziina payment intent creation or webhook setup failed');
  }
}
