import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
