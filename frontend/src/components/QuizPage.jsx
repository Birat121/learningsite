import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const AddQuizPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const handleSaveClick = () => {
    if (!selectedCourseId) return toast.error("Please select a course.");
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    try {
      await axiosInstance.post("/quiz/quizzes", {
        courseId: selectedCourseId,
        questions,
      });
      toast.success("Quiz added successfully!");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      setShowConfirmDialog(false);
    } catch (err) {
      toast.error("Error saving quiz");
      setShowConfirmDialog(false);
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
          onClick={handleSaveClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
        >
          ✅ Save Quiz
        </button>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Save</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to save this quiz?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuizPage;
