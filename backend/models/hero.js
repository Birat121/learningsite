import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,  // Image URL or filename
}, { timestamps: true });

export default mongoose.model('Hero', heroSchema);
