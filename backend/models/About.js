import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  title: String,
  description: String,
  sections: [
    {
      heading: String,
      paragraphs: [String],
      imageUrl: String,
      reverseLayout: Boolean // for alternating layout
    }
  ]
});

export default mongoose.model("About", aboutSchema);
