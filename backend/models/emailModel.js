import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
});

const Email = mongoose.model("Email", emailSchema);

export default Email;