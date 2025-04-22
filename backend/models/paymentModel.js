import mongoose from "mongoose";

const purchasedCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  paymentIntentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  status: { type: String, enum: ["succeeded", "pending", "failed"], default: "pending" },
  purchasedAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", purchasedCourseSchema);
export default Payment;




