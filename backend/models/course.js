import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  courseOutcome: { type: String },
  price: { type: Number, required: true },
  thumbnailUrl: { type: String, required: true },
  thumbnailPublicId: { type: String, required: true },
}, { timestamps: true });

courseSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await mongoose.models.Course.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;

