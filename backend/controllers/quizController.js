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

export const getQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quizDoc = await quiz.findById(quizId).populate("courseId");
    if (!quizDoc) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quizDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quiz for a specific course
export const updateQuestionInQuiz = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;
    const { question, options, correctAnswer } = req.body;

    const quizDoc = await quiz.findById(quizId);
    if (!quizDoc) return res.status(404).json({ message: "Quiz not found" });

    if (!quizDoc.questions[questionIndex]) {
      return res.status(404).json({ message: "Question not found" });
    }

    quizDoc.questions[questionIndex] = { question, options, correctAnswer };
    await quizDoc.save();

    res.status(200).json({ message: "Question updated", quiz: quizDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteQuestionInQuiz = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;

    const quizDoc = await quiz.findById(quizId);
    if (!quizDoc) return res.status(404).json({ message: "Quiz not found" });

    if (!quizDoc.questions[questionIndex]) {
      return res.status(404).json({ message: "Question not found" });
    }

    quizDoc.questions.splice(questionIndex, 1);
    await quizDoc.save();

    res.status(200).json({ message: "Question deleted", quiz: quizDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
