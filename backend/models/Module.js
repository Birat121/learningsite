import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // <-- add this if you have Video model
}, { timestamps: true });


const Module = mongoose.model("Module", moduleSchema);
export default Module;
