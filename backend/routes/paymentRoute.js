import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { handleCoursePayment, handleZiinaWebhook } from "../controllers/checkOutController.js";

const paymentRouter = express.Router();

paymentRouter.post("/initiate", authMiddleware, handleCoursePayment);
paymentRouter.post("/webhook", handleZiinaWebhook);

export default paymentRouter;