import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    courseOutcome: [String],
    price: { type: Number, required: true },
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    thumbnailPublicId: { type: String, required: true },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
