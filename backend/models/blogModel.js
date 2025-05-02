import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String }, // Store Cloudinary URL or file path
    description: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
