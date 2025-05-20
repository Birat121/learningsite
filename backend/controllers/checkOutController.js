import { createPaymentIntent } from "../services/ziinaService.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";
import Enrollment from "../models/paymentModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;

// CREATE PAYMENT INTENT
export const handleCoursePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const customer_email = req.user?.email;

    if (!courseId) return res.status(400).json({ error: "Missing courseId" });
    if (!customer_email) return res.status(400).json({ error: "Missing customer email" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existing) {
      if (existing.status === "completed") {
        return res.status(400).json({ error: "You are already enrolled." });
      }
      await Enrollment.deleteOne({ _id: existing._id }); // remove old pending/failed
    }

    const amountInFils = Math.round(course.price * 100);

    const paymentData = await createPaymentIntent({
      amount: amountInFils,
      currency: "AED",
      email: customer_email,
      courseId,
    });

    await Enrollment.create({
      user: req.user._id,
      course: course._id,
      paymentIntentId: paymentData.id,
      status: "pending",
    });

    res.json({
      paymentUrl: paymentData.redirect_url || paymentData.confirmation_url,
      payment_intent_id: paymentData.id,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({
      error: "Payment intent creation failed",
      details: err.response?.data || err.message,
    });
  }
};

// HANDLE WEBHOOK
export const handleZiinaWebhook = async (req, res) => {
  try {
    const allowedIps = ["3.29.184.186", "3.29.190.95", "20.233.47.127"];
    const rawIp = req.headers["x-forwarded-for"]?.split(",").shift() || req.socket?.remoteAddress;
    const ip = rawIp.replace("::ffff:", "");

    console.log("📬 Webhook received from IP:", ip);
    if (!allowedIps.includes(ip)) {
      console.warn("❌ Invalid IP:", ip);
      return res.status(403).send("Forbidden");
    }

    const rawBody = req.body.toString(); // raw body is a buffer
    const signature = req.headers["x-hmac-signature"];
    const parsed = JSON.parse(rawBody);

    if (!signature || typeof signature !== "string") {
      return res.status(400).send("Missing signature");
    }

    const computedHmac = crypto.createHmac("sha256", ZIINA_SECRET_KEY).update(rawBody).digest();
    const incomingSig = Buffer.from(signature, "hex");

    if (
      incomingSig.length !== computedHmac.length ||
      !crypto.timingSafeEqual(incomingSig, computedHmac)
    ) {
      console.error("❌ Invalid HMAC signature");
      return res.status(400).send("Invalid signature");
    }

    const status = parsed?.data?.status;
    const paymentIntentId = parsed?.data?.id;
    const metadata = parsed?.data?.metadata || {};
    const userEmail = metadata.userEmail;
    const courseId = metadata.courseId;

    console.log("📦 Webhook Data:", { status, userEmail, courseId });

    if (!userEmail || !courseId || !paymentIntentId) {
      return res.status(400).send("Missing metadata");
    }

    const user = await User.findOne({ email: userEmail });
    const course = await Course.findById(courseId);
    if (!user || !course) {
      console.error("❌ User or course not found");
      return res.status(404).send("User or course not found");
    }

    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      paymentIntentId,
    });

    const completedStatuses = ["succeeded", "completed", "authorized"];
    const failedStatuses = ["failed", "cancelled", "expired", "rejected"];

    if (completedStatuses.includes(status)) {
      if (existingEnrollment) {
        if (existingEnrollment.status !== "completed") {
          existingEnrollment.status = "completed";
          await existingEnrollment.save();
          console.log("✅ Enrollment marked as completed for", userEmail);
        }
      } else {
        await Enrollment.create({
          user: user._id,
          course: course._id,
          paymentIntentId,
          status: "completed",
        });
        console.log("✅ New enrollment completed for", userEmail);
      }
      return res.status(200).send("Enrollment updated");
    }

    if (failedStatuses.includes(status)) {
      if (existingEnrollment && existingEnrollment.status !== "completed") {
        existingEnrollment.status = "failed";
        await existingEnrollment.save();
        console.warn("❌ Enrollment marked as failed for", userEmail);
      }
      return res.status(200).send("Marked enrollment as failed");
    }

    console.log("⚠️ Unhandled status:", status);
    res.status(200).send("Unhandled status");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Server error");
  }
};
