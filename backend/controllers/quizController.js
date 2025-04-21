import quiz from "../models/quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { courseId, questions } = req.body;
    const newQuiz = new quiz({ courseId, questions });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quiz.find().populate("courseId");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quiz for a specific course
export const getQuizByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizData = await quiz.findOne({ courseId });

    if (!quizData) {
      return res.status(404).json({ message: "Quiz not found for this course." });
    }

    res.status(200).json(quizData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updatedQuiz = await quiz.findOneAndUpdate({ courseId }, req.body, {
      new: true,
    });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    await quiz.findOneAndDelete({ courseId });
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};