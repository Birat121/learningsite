import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;
const ZIINA_API_URL = process.env.ZIINA_API_URL;
const SUCCESS_URL = process.env.SUCCESS_URL;
const CANCEL_URL = process.env.CANCEL_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

let webhookInitialized = false; // ensures webhook is not created repeatedly

export async function createPaymentIntent({ amount, currency, email, courseId }) {
  try {
    const metadata = {
      courseId,
      userEmail: email,
    };

    const paymentPayload = {
      amount,
      currency_code: currency,
      email,
      capture_method: 'automatic',
      confirmation_method: 'automatic',
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      test: true,
      metadata,
    };

    console.log('Creating payment intent with:', paymentPayload);

    const paymentIntentResponse = await axios.post(
      `${ZIINA_API_URL}/payment_intent`,
      paymentPayload,
      {
        headers: {
          Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paymentIntentData = paymentIntentResponse.data;
    console.log('✅ Payment intent created:', paymentIntentData);

    // Optional: Setup webhook only once per runtime
    if (!webhookInitialized) {
      await setupWebhook();
      webhookInitialized = true;
    }

    return paymentIntentData;

  } catch (error) {
    console.error('❌ Failed to create payment intent:', error.message);
    if (error.response) {
      console.error('Ziina API error response:', error.response.data);
    }
    throw new Error('Failed to create Ziina payment intent');
  }
}

async function setupWebhook() {
  try {
    const webhookResponse = await axios.post(
      `${ZIINA_API_URL}/webhook`,
      {
        url: WEBHOOK_URL,
        secret: ZIINA_SECRET_KEY,
      },
      {
        headers: {
          Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ Webhook URL registered:', webhookResponse.data);
  } catch (err) {
    if (err.response?.status === 409) {
      console.warn('⚠️ Webhook already exists, skipping setup.');
    } else {
      console.error('❌ Failed to setup webhook:', err.message);
      throw new Error('Failed to register Ziina webhook');
    }
  }
}