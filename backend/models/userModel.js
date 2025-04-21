import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  googleId: {
    type: String
  },
  enrolledCourses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "video" } // Array of course IDs
  ]
});

const User = mongoose.model("User", userSchema);

export default User;