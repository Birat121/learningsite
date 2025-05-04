// blogModel.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    imagePublicId: { type: String },
    slug: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

// Create a slug from the title before saving the blog
blogSchema.pre('save', function(next) {
  if (this.title) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
  next();
});

export default mongoose.model('Blog', blogSchema);


