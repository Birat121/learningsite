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

import Enrollment from "../models/paymentModel.js";

export async function createPaymentIntent({ amount, currency, email, userId, courseId }) {
  try {
    const operation_id = uuidv4();
    const expiry = Date.now() + 60 * 60 * 1000;

    const successUrl = SUCCESS_URL.replace("{PAYMENT_INTENT_ID}", operation_id);
    const cancelUrl = CANCEL_URL.replace("{PAYMENT_INTENT_ID}", operation_id);

    const payload = {
      amount: Math.round(amount * 100),
      currency_code: currency,
      message: `Payment for course`,
      success_url: successUrl,
      cancel_url: cancelUrl,
      failure_url: cancelUrl,
      transaction_source: "directApi",
      expiry: expiry.toString(),
      operation_id,
    };

    const response = await axios.post(`${ZIINA_API_URL}/payment_intent`, payload, {
      headers: {
        Authorization: `Bearer ${ZIINA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const { id: paymentIntentId, status } = response.data;

    // 🔄 Save enrollment record
    await Enrollment.create({
      user: userId,
      course: courseId,
      paymentIntentId,
      status: "pending",
    });

    if (!webhookInitialized) {
      await setupWebhook();
      webhookInitialized = true;
    }

    return response.data;
  } catch (err) {
    console.error("❌ Ziina error:", err.response?.data || err.message);
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


