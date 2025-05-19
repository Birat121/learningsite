import mongoose from "mongoose";
import slugify from "slugify";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  videoUrl: { type: String, required: true },  // URL of the video hosted elsewhere
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
}, { timestamps: true });

videoSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await mongoose.models.Video.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Video = mongoose.model("Video", videoSchema);
export default Video;

