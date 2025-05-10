// models/Introduction.js
import mongoose from 'mongoose';

const introductionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  paragraph1: { type: String, required: true },
  paragraph2: { type: String, required: true },
  image: { type: String, required: true } // Image URL or path
}, { timestamps: true });

export default mongoose.model('Introduction', introductionSchema);
