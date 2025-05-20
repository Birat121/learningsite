import { createPaymentIntent } from "../services/ziinaService.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";
import Enrollment from "../models/paymentModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;

// ✅ 1. Create payment intent
export const handleCoursePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const customer_email = req.user?.email;

    if (!courseId || !customer_email) {
      return res.status(400).json({ error: "Missing courseId or email" });
    }

    const course = await Course.findById(courseId);
    if (!course || isNaN(course.price)) {
      return res.status(400).json({ error: "Invalid course or price" });
    }

    // Check for existing enrollment
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existing && existing.status === "completed") {
      return res.status(400).json({ error: "Already enrolled in this course" });
    } else if (existing) {
      await Enrollment.deleteOne({ _id: existing._id }); // Remove pending/failed
    }

    const amountInFils = Math.round(course.price * 100); // AED to fils

    const paymentData = await createPaymentIntent({
      amount: amountInFils,
      currency: "AED",
      email: customer_email,
      metadata: {
        userEmail: customer_email,
        courseId,
      },
    });

    await Enrollment.create({
      user: req.user._id,
      course: course._id,
      paymentIntentId: paymentData.id,
      status: "pending",
    });

    return res.json({
      paymentUrl: paymentData.redirect_url || paymentData.confirmation_url,
      paymentIntentId: paymentData.id,
    });
  } catch (err) {
    console.error("❌ Payment error:", err);
    res.status(500).json({
      error: "Payment intent creation failed",
      details: err.response?.data || err.message,
    });
  }
};

// ✅ 2. Handle webhook from Ziina
export const handleZiinaWebhook = async (req, res) => {
  try {
    const allowedIps = ["3.29.184.186", "3.29.190.95", "20.233.47.127"];
    const rawIp =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress;
    const ip = rawIp.replace("::ffff:", "");

    console.log("🔔 Webhook received from:", ip);

    if (!allowedIps.includes(ip)) {
      console.warn("❌ Invalid IP:", ip);
      return res.status(403).send("Forbidden");
    }

    const rawBody = JSON.stringify(req.body);
    const signature = req.headers["x-hmac-signature"];

    if (!signature || typeof signature !== "string") {
      return res.status(400).send("Invalid signature");
    }

    const computedHmac = crypto
      .createHmac("sha256", ZIINA_SECRET_KEY)
      .update(rawBody)
      .digest();
    const incomingSig = Buffer.from(signature, "hex");

    if (
      incomingSig.length !== computedHmac.length ||
      !crypto.timingSafeEqual(incomingSig, computedHmac)
    ) {
      console.error("❌ Invalid HMAC signature");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;
    const status = event?.data?.status;
    const paymentIntentId = event?.data?.id;
    const metadata = event?.data?.metadata || {};
    const userEmail = metadata.userEmail;
    const courseId = metadata.courseId;

    console.log("📩 Webhook Data:", {
      status,
      paymentIntentId,
      userEmail,
      courseId,
    });

    if (!userEmail || !courseId || !paymentIntentId) {
      return res.status(400).send("Missing metadata");
    }

    const user = await User.findOne({ email: userEmail });
    const course = await Course.findById(courseId);
    if (!user || !course) {
      console.error("❌ User or course not found");
      return res.status(404).send("User or Course not found");
    }

    let enrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      paymentIntentId,
    });

    if (["completed", "succeeded", "authorized"].includes(status)) {
      if (enrollment) {
        if (enrollment.status !== "completed") {
          enrollment.status = "completed";
          await enrollment.save();
          console.log("✅ Enrollment updated to completed");
        } else {
          console.log("✅ Enrollment already completed");
        }
      } else {
        await Enrollment.create({
          user: user._id,
          course: course._id,
          paymentIntentId,
          status: "completed",
        });
        console.log("✅ New enrollment created");
      }
      return res.status(200).send("Enrollment recorded");
    }

    // Handle failed payments
    if (["failed", "cancelled", "expired", "rejected"].includes(status)) {
      if (enrollment && enrollment.status !== "completed") {
        enrollment.status = "failed";
        await enrollment.save();
        console.warn("❌ Enrollment marked as failed");
      }
      return res.status(200).send("Payment failed, enrollment updated");
    }

    console.log("⚠️ Unhandled payment status:", status);
    return res.status(200).send("Unhandled status");
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).send("Internal Server Error");
  }
};
