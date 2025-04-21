import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  method: { type: String, enum: ["card", "paypal", "esewa", "khalti"], required: true },
  status: { type: String, enum: ["success", "failed"], default: "success" },
  paidAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);


