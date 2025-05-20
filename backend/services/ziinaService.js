import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;
const ZIINA_API_URL = process.env.ZIINA_API_URL;
const SUCCESS_URL = process.env.SUCCESS_URL;
const CANCEL_URL = process.env.CANCEL_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

let webhookInitialized = false;



export async function createPaymentIntent({ amount, currency, email, courseId }) {
  try {
    const operation_id = uuidv4();

    const paymentPayload = {
      amount,
      currency_code: currency,
      message: `Payment for course`,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      failure_url: CANCEL_URL,
      test: true,
      transaction_source: "directApi",
      expiry: (Math.floor(expiry / 1000)).toString(),

      metadata: {
        courseId,
        userEmail: email,
      },
      operation_id,
    };

    console.log("🟢 Creating payment intent:", paymentPayload);

    const response = await axios.post(`${ZIINA_API_URL}/payment_intent`, paymentPayload, {
      headers: {
        Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!webhookInitialized) {
      await setupWebhook();
      webhookInitialized = true;
    }

    return response.data;
  } catch (err) {
  console.error('❌ Ziina payment intent error:', err.response?.data || err.message);
    throw err;
  }
}

async function setupWebhook() {
  try {
    const res = await axios.post(
      `${ZIINA_API_URL}/webhook`,
      { url: WEBHOOK_URL, secret: ZIINA_SECRET_KEY },
      {
        headers: {
          Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Webhook registered:", res.data);
  } catch (err) {
    if (err.response?.status === 409) {
      console.log("ℹ️ Webhook already registered.");
    } else {
      console.error("❌ Webhook registration failed:", err.message);
    }
  }
}
