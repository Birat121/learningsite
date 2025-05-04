import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { handleCreatePayment, handleZiinaWebhook } from "../controllers/checkOutController";

const paymentRouter = express.Router();

paymentRouter.post("/payment", authMiddleware, handleCreatePayment);
paymentRouter.post("/webhook", handleZiinaWebhook);

export default paymentRouter;