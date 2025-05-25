import { createPaymentIntent } from "../services/ziinaService.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";
import Enrollment from "../models/paymentModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const ZIINA_WEBHOOK_SECRET = process.env.ZIINA_WEBHOOK_SECRET;

// 🎯 INITIATE PAYMENT
// 🎯 INITIATE PAYMENT
export const handleCoursePayment = async (req, res) => {
  try {
    // Defensive logging
    console.log("req.user:", req.user);

    // Defensive checks
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    const userId = req.user._id;
    const { courseId } = req.body;
    const email = req.user.email;

    if (!courseId || !email) {
      return res.status(400).json({ error: "Missing courseId or email" });
    }

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid courseId" });
    }

    const course = await Course.findById(courseId);
    if (!course || isNaN(course.price)) {
      return res.status(400).json({ error: "Invalid course or price" });
    }

    // Check existing enrollment
    const existing = await Enrollment.findOne({
      user: userId,
      course: course._id,
    });

    if (existing?.status === "completed") {
      return res
        .status(409)
        .json({ error: "You are already enrolled in this course." });
    }

    if (existing) {
      await Enrollment.deleteOne({ _id: existing._id });
    }

    // Create payment intent via Ziina
    const paymentIntent = await createPaymentIntent({
      amount: course.price,
      currency: "AED",
      email,
      courseId,
    });

    // Save enrollment with status 'pending'
    await Enrollment.create({
      user: userId,
      course: course._id,
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });

    res.json({
      paymentUrl: paymentIntent.redirect_url,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("❌ Payment intent creation error:", err);
    res
      .status(500)
      .json({ error: "Failed to create payment", details: err.message });
  }
};

// 🔔 HANDLE WEBHOOK

export const handleZiinaWebhook = async (req, res) => {
  try {
    const allowedIps = ["3.29.184.186", "3.29.190.95", "20.233.47.127"];
    const ip = (
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      ""
    )
      .split(",")[0]
      .replace("::ffff:", "")
      .trim();

    if (!allowedIps.includes(ip)) {
      return res.status(403).send("Forbidden: IP not allowed");
    }

    const rawBody = req.body.toString("utf8");
    const signature = req.headers["x-hmac-signature"];
    const hmac = crypto
      .createHmac("sha256", ZIINA_WEBHOOK_SECRET)
      .update(rawBody)
      .digest();
    const incomingSig = Buffer.from(signature || "", "hex");

    if (!signature || !crypto.timingSafeEqual(hmac, incomingSig)) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody);
    const { id: paymentIntentId, status, metadata } = event?.data || {};

    const { userEmail, courseId } = metadata || {};
    if (!userEmail || !courseId || !paymentIntentId) {
      return res.status(400).send("Missing metadata");
    }

    const user = await User.findOne({ email: userEmail });
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).send("User or Course not found");
    }

    const successStatuses = [
      "completed",
      "succeeded",
      "authorized",
      "captured",
    ];
    const failedStatuses = ["failed", "cancelled", "expired"];

    const enrollmentStatus = successStatuses.includes(status)
      ? "completed"
      : failedStatuses.includes(status)
      ? "failed"
      : "pending";

    const enrollment = await Enrollment.findOneAndUpdate(
      { user: user._id, course: course._id, paymentIntentId },
      {
        $set: {
          status: enrollmentStatus,
          enrolledAt: new Date(),
        },
        $setOnInsert: {
          user: user._id,
          course: course._id,
          paymentIntentId,
        },
      },
      { upsert: true, new: true }
    );

    if (enrollmentStatus === "completed") {
      const alreadyEnrolled = user.enrolledCourses.includes(course._id);
      if (!alreadyEnrolled) {
        user.enrolledCourses.push(course._id);
        await user.save();
        console.log(
          `✅ Access granted for course: ${course.title} to ${user.email}`
        );
      }
    }

    return res.status(200).send(`Enrollment ${enrollmentStatus}`);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.status(500).send("Server error");
  }
};
