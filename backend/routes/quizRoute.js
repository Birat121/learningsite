import express from "express";
import { createQuiz, getAllQuizzes, getQuiz, updateQuestionInQuiz, deleteQuestionInQuiz} from "../controllers/quizController.js";

const quizRouter = express.Router();

// Routes for quiz operations
quizRouter.post("/quizzes", createQuiz); // Create quiz
quizRouter.get("/quizzes", getAllQuizzes); // Get all quizzes
quizRouter.get("/quizzes/:courseId", getQuiz); // Get quiz by course ID
quizRouter.put("/quizzes/:quizId/questions/:questionIndex", updateQuestionInQuiz);
quizRouter.delete("/quizzes/:quizId/questions/:questionIndex", deleteQuestionInQuiz);


export default quizRouter;