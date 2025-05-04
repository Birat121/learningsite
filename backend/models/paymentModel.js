import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  paymentIntentId: { type: String, required: true },
  enrolledAt: { type: Date, default: Date.now }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;





