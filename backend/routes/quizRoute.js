import express from "express";
import { createQuiz, getAllQuizzes, getQuizByCourseId, updateQuiz, deleteQuiz} from "../controllers/quizController.js";

const quizRouter = express.Router();

// Routes for quiz operations
quizRouter.post("/quizzes", createQuiz); // Create quiz
quizRouter.get("/quizzes", getAllQuizzes); // Get all quizzes
quizRouter.get("/quizzes/:courseId", getQuizByCourseId); // Get quiz by course ID
quizRouter.put("/quizzes/:courseId", updateQuiz); // Update quiz by course ID
quizRouter.delete("/quizzes/:courseId", deleteQuiz); // Delete quiz by course ID


export default quizRouter;