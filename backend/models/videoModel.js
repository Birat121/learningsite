import mongoose from "mongoose";
import slugify from "slugify";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // Add slug field
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

// Middleware to generate slug before save
videoSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Ensure uniqueness
  while (await mongoose.models.Video.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
