import { createPaymentIntent } from "../services/ziinaService.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";
import Enrollment from "../models/paymentModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;

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

    return res.json({
      paymentUrl: paymentData.redirect_url,
      paymentIntentId: paymentData.id,
    });
  } catch (err) {
    console.error("❌ handleCoursePayment error:", err);
    res.status(500).json({ error: "Payment failed", details: err.message });
  }
};

export const handleZiinaWebhook = async (req, res) => {
  try {
    const allowedIps = ["3.29.184.186", "3.29.190.95", "20.233.47.127"];
    const rawIp = req.headers["x-forwarded-for"]?.split(",").shift() || req.socket?.remoteAddress;
    const ip = rawIp?.replace("::ffff:", "");

    console.log("🔔 Webhook from IP:", ip);

    if (!allowedIps.includes(ip)) {
      return res.status(403).send("Forbidden");
    }

    const rawBody = JSON.stringify(req.body);
    const signature = req.headers["x-hmac-signature"];

    const hmac = crypto.createHmac("sha256", ZIINA_SECRET_KEY).update(rawBody).digest();
    const incomingSig = Buffer.from(signature, "hex");

    if (!crypto.timingSafeEqual(hmac, incomingSig)) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;
    const { id: paymentIntentId, status, metadata } = event?.data || {};
    const { userEmail, courseId } = metadata;

    if (!userEmail || !courseId || !paymentIntentId) {
      return res.status(400).send("Missing metadata");
    }

    const user = await User.findOne({ email: userEmail });
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).send("User or Course not found");
    }

    let enrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      paymentIntentId,
    });

    if (["completed", "succeeded", "authorized"].includes(status)) {
      if (enrollment) {
        enrollment.status = "completed";
        await enrollment.save();
      } else {
        await Enrollment.create({
          user: user._id,
          course: course._id,
          paymentIntentId,
          status: "completed",
        });
      }
      return res.status(200).send("Enrollment completed");
    }

    if (["failed", "cancelled", "expired"].includes(status)) {
      if (enrollment) {
        enrollment.status = "failed";
        await enrollment.save();
      }
      return res.status(200).send("Payment failed");
    }

    return res.status(200).send("Unhandled status");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).send("Internal Server Error");
  }
};
