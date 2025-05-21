import { createPaymentIntent } from "../services/ziinaService.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";
import Enrollment from "../models/paymentModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const ZIINA_WEBHOOK_SECRET = process.env.ZIINA_WEBHOOK_SECRET;

// 🎯 INITIATE PAYMENT
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

    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existing && existing.status === "completed") {
      return res.status(400).json({ error: "Already enrolled in this course" });
    } else if (existing) {
      await Enrollment.deleteOne({ _id: existing._id });
    }

    const paymentData = await createPaymentIntent({
      amount: course.price, // raw AED, backend converts to fils
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

    return res.json({
      paymentUrl: paymentData.redirect_url,
      paymentIntentId: paymentData.id,
    });
  } catch (err) {
    console.error("❌ handleCoursePayment error:", err);
    res.status(500).json({ error: "Payment failed", details: err.message });
  }
};

// 🔔 HANDLE WEBHOOK







export const handleZiinaWebhook = async (req, res) => {
  try {
    // IP Whitelist check
    const allowedIps = ["3.29.184.186", "3.29.190.95", "20.233.47.127"];
    const rawIp = req.headers["x-forwarded-for"]?.split(",").shift() || req.connection?.remoteAddress;
    const ip = rawIp?.replace("::ffff:", "").trim();

    console.log("🔔 Webhook from IP:", ip);
    if (!allowedIps.includes(ip)) {
      console.warn("⛔ Blocked IP:", ip);
      return res.status(403).send("Forbidden");
    }

    // HMAC signature verification
    const rawBody = req.body.toString("utf8");
    const signature = req.headers["x-hmac-signature"];

    if (!signature) {
      console.warn("❌ Missing signature");
      return res.status(400).send("Missing signature");
    }

    const hmac = crypto.createHmac("sha256", ZIINA_WEBHOOK_SECRET).update(rawBody).digest();
    const incomingSig = Buffer.from(signature, "hex");

    if (!crypto.timingSafeEqual(hmac, incomingSig)) {
      console.warn("❌ Signature mismatch");
      return res.status(400).send("Invalid signature");
    }

    // Parse event payload
    const event = JSON.parse(rawBody);
    console.log("📦 Webhook received:", JSON.stringify(event, null, 2));

    const { id: paymentIntentId, status, metadata } = event?.data || {};
    if (!metadata) {
      return res.status(400).send("Missing metadata");
    }

    const { userEmail, courseId } = metadata;

    if (!userEmail || !courseId || !paymentIntentId) {
      console.error("⚠️ Missing required metadata:", { userEmail, courseId, paymentIntentId });
      return res.status(400).send("Missing metadata");
    }

    const user = await User.findOne({ email: userEmail });
    const course = await Course.findById(courseId);

    if (!user || !course) {
      console.error("🚫 User or Course not found:", { userEmail, courseId });
      return res.status(404).send("User or Course not found");
    }

    // Map Ziina status to internal status
    const statusMap = {
      completed: "completed",
      succeeded: "completed",
      authorized: "completed",
      failed: "failed",
      cancelled: "failed",
      expired: "failed",
    };

    const enrollmentStatus = statusMap[status] || "pending";

    // Upsert enrollment
    const enrollment = await Enrollment.findOneAndUpdate(
      {
        user: user._id,
        course: course._id,
      },
      {
        $set: {
          status: enrollmentStatus,
          enrolledAt: new Date(),
          paymentIntentId,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log("✅ Enrollment upserted:", enrollment);

    return res.status(200).send(`Enrollment ${enrollmentStatus}`);
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return res.status(500).send("Internal Server Error");
  }
};