import { createPaymentIntent } from "../services/ziinaService.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";
import Enrollment from "../models/paymentModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const ZIINA_SECRET_KEY = process.env.ZIINA_SECRET_KEY;

// Payment intent creation (on client request)
export const handleCoursePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const customer_email = req.user?.email;

    if (!courseId) return res.status(400).json({ error: "Missing courseId" });
    if (!customer_email)
      return res.status(400).json({ error: "Missing customer email" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (isNaN(course.price))
      return res.status(400).json({ error: "Invalid course price" });

    // Allow retry if previous enrollment is not completed
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existing) {
      if (existing.status === "completed") {
        return res
          .status(400)
          .json({ error: "You have already enrolled in this course." });
      }

      // Delete failed or pending enrollment to allow retry
      await Enrollment.deleteOne({ _id: existing._id });
    }

    const amountInFils = Math.round(course.price * 100);

    const paymentData = await createPaymentIntent({
      amount: amountInFils,
      currency: "AED",
      email: customer_email,
      courseId: courseId, // pass courseId directly here
    });

    await Enrollment.create({
      user: req.user._id,
      course: course._id,
      paymentIntentId: paymentData.id,
      status: "pending",
    });

    const redirectUrl =
      paymentData.redirect_url || paymentData.confirmation_url;
    if (!redirectUrl) {
      console.error("Redirect URL missing in Ziina response:", paymentData);
      return res
        .status(500)
        .json({ error: "Ziina did not return a redirect URL." });
    }

    res.json({
      paymentUrl: redirectUrl,
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

export const handleZiinaWebhook = async (req, res) => {
  try {
    const allowedIps = ["3.29.184.186", "3.29.190.95", "20.233.47.127"];
    const rawIp =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress;
    const ip = rawIp.replace("::ffff:", "");

    console.log("Webhook received from IP:", ip);
    if (!allowedIps.includes(ip)) {
      console.warn("❌ Webhook rejected — invalid IP:", ip);
      return res.status(403).send("Forbidden");
    }

    const rawBody = JSON.stringify(req.body);
    const signature = req.headers["x-hmac-signature"];

    if (
      !signature ||
      typeof signature !== "string" ||
      !/^[a-f0-9]+$/i.test(signature)
    ) {
      return res.status(400).send("Malformed or missing signature");
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
      console.error("Invalid HMAC signature", { receivedSignature: signature });
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;
    const status = event?.data?.status;
    const paymentIntentId = event?.data?.id;
    const userEmail = event?.data?.metadata?.userEmail;
    const courseId = event?.data?.metadata?.courseId;

    if (!userEmail || !courseId || !paymentIntentId) {
      console.error("Missing metadata or payment ID");
      return res.status(400).send("Invalid webhook payload");
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error("User not found:", userEmail);
      return res.status(404).send("User not found");
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.error("Course not found:", courseId);
      return res.status(404).send("Course not found");
    }

    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      paymentIntentId,
    });

    // ✅ Handle successful payments
    if (["succeeded", "completed"].includes(status)) {
      if (existingEnrollment) {
        if (existingEnrollment.status !== "completed") {
          existingEnrollment.status = "completed";
          await existingEnrollment.save();
          console.log("✅ Enrollment updated to completed for:", userEmail);
        } else {
          console.log("Enrollment already marked as completed.");
        }
      } else {
        await Enrollment.create({
          user: user._id,
          course: course._id,
          paymentIntentId,
          status: "completed",
        });
        console.log("✅ Enrollment created via webhook for:", userEmail);
      }
      return res.status(200).send("Enrollment updated");
    }

    // ❌ Handle failed/cancelled payments
    const failedStatuses = ["failed", "cancelled", "expired", "rejected"];
    if (failedStatuses.includes(status)) {
      if (existingEnrollment && existingEnrollment.status !== "completed") {
        existingEnrollment.status = "failed";
        await existingEnrollment.save();
        console.warn("❌ Enrollment marked as failed for:", userEmail);
      } else {
        console.warn(
          "No pending enrollment to mark as failed, or already completed."
        );
      }
      return res.status(200).send("Marked enrollment as failed");
    }

    // Unknown or other status
    console.log(`⚠️ Webhook received with unhandled status: '${status}'`);
    res.status(200).send("Unhandled status received");
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Internal Server Error");
  }
};
