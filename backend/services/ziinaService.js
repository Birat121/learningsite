import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;
const ZIINA_API_URL = process.env.ZIINA_API_URL;

export async function createPaymentIntent({ amount, currency, email }) {
  try {
    const response = await axios.post(
      `${ZIINA_API_URL}/payment_intent`,
      {
        amount,
        currency_code,
        email,
        capture_method: 'automatic',
        confirmation_method: 'automatic',
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL,
        test: true
      },
      {
        headers: {
          Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Ziina Error:', error.response?.data || error.message);
    throw new Error('Ziina payment intent creation failed');
  }
}
