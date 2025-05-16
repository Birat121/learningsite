// src/pages/admin/AddQuizPage.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const AddQuizPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axiosInstance.get("/courses/course");
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "question") updated[index].question = value;
    else if (field.startsWith("option")) {
      const optIndex = Number(field.split("-")[1]);
      updated[index].options[optIndex] = value;
    } else if (field === "correctAnswer") {
      updated[index].correctAnswer = Number(value);
    }
    setQuestions(updated);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedCourseId) return toast.error("Please select a course.");
    try {
      await axiosInstance.post("/quiz/quizzes", {
        courseId: selectedCourseId,
        questions,
      });
      toast.success("Quiz added successfully!");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    } catch (err) {
      toast.error("Error saving quiz");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Add New Quiz</h2>

      {/* Course Selection */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Select Course
        </label>
        <select
          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Choose a course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Questions List */}
      {questions.map((q, idx) => (
        <div
          key={idx}
          className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Question {idx + 1}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter the question"
              className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={q.question}
              onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
            />

            {q.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={opt}
                onChange={(e) => handleQuestionChange(idx, `option-${i}`, e.target.value)}
              />
            ))}

            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                Correct Option (0-3)
              </label>
              <input
                type="number"
                min={0}
                max={3}
                className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={addNewQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
        >
          ➕ Add Question
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
        >
          ✅ Save Quiz
        </button>
      </div>
    </div>
  );
};

export default AddQuizPage;
