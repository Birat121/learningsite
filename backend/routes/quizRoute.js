import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuiz,
  getQuizByCourseId,
  updateQuestionInQuiz,
  deleteQuestionInQuiz
} from "../controllers/quizController.js";

const quizRouter = express.Router();

quizRouter.post("/quizzes", createQuiz);                  // Create quiz
quizRouter.get("/quizzes", getAllQuizzes);                // Get all quizzes
quizRouter.get("/quizzes/:id", getQuiz);                  // Get quiz by quiz ID
quizRouter.get("/quizzes/:courseId", getQuizByCourseId);   // ✅ Get quiz by course ID

quizRouter.put("/quizzes/:quizId/questions/:questionIndex", updateQuestionInQuiz);
quizRouter.delete("/quizzes/:quizId/questions/:questionIndex", deleteQuestionInQuiz);

export default quizRouter;
