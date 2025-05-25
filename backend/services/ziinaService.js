import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;
const ZIINA_WEBHOOK_SECRET = process.env.ZIINA_WEBHOOK_SECRET;
const ZIINA_API_URL = process.env.ZIINA_API_URL;
const SUCCESS_URL = process.env.SUCCESS_URL;  // Make sure this includes {PAYMENT_INTENT_ID}
const CANCEL_URL = process.env.CANCEL_URL;    // Make sure this includes {PAYMENT_INTENT_ID}
const WEBHOOK_URL = process.env.WEBHOOK_URL;

let webhookInitialized = false;

export async function createPaymentIntent({ amount, currency, email, courseId }) {
  try {
    const operation_id = uuidv4();

    // Set expiry to 1 hour from now
    const expiry = Date.now() + 60 * 60 * 1000; // 1 hour in ms

    const paymentPayload = {
      amount: Math.round(amount * 100), // Multiply here: amount in fils (e.g., 100 AED -> 10000)
      currency_code: currency,
      message: `Payment for course`,
      success_url: SUCCESS_URL,  // Should contain {PAYMENT_INTENT_ID} to be replaced by API
      cancel_url: CANCEL_URL,    // Same here
      failure_url: CANCEL_URL,
      test: true,
      transaction_source: "directApi",
      expiry: expiry.toString(),
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

    console.log("✅ Payment intent created:", response.data);

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
      { url: WEBHOOK_URL, secret: ZIINA_WEBHOOK_SECRET },
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


