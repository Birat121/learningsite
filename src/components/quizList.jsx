import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const res = await axiosInstance.get("/quiz/quizzes", { withCredentials: true });
      console.log("Fetched quizzes:", res.data); // Check the structure here
      if (res.data && Array.isArray(res.data.quizzes)) {
        setQuizzes(res.data.quizzes); // Ensure this is an array
      } else {
        console.error("Expected quizzes data to be an array");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    await axiosInstance.delete(`/quiz/quizzes/${id}`, { withCredentials: true });
    toast.success("Quiz deleted");
    fetchQuizzes();
  };

  const handleUpdate = async () => {
    await axiosInstance.put(`/quiz/quizzes/${editQuiz._id}`, editQuiz, {
      withCredentials: true,
    });
    toast.success("Quiz updated");
    setEditQuiz(null);
    fetchQuizzes();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Quizzes</h2>
      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Question</th>
            <th className="p-3 text-left">Options</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(quizzes) && quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <tr key={quiz._id} className="border-b">
                <td className="p-3">{quiz.question}</td>
                <td className="p-3">
                  {quiz.options?.map((opt, idx) => (
                    <div key={idx}>{opt}</div>
                  ))}
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => setEditQuiz(quiz)}
                    className="text-blue-600 hover:underline"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No quizzes available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Inline Modal */}
      {editQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setEditQuiz(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <X size={22} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Edit Quiz</h3>
            <input
              type="text"
              value={editQuiz.question}
              onChange={(e) =>
                setEditQuiz({ ...editQuiz, question: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />
            {editQuiz.options?.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...editQuiz.options];
                  newOptions[idx] = e.target.value;
                  setEditQuiz({ ...editQuiz, options: newOptions });
                }}
                className="w-full border p-2 rounded mb-2"
              />
            ))}
            <button
              onClick={handleUpdate}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
