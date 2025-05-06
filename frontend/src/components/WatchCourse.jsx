import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";

const WatchCourse = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasCourseAccess } = useAuth();
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!hasCourseAccess(slug)) {
      navigate("/login");
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/videos/videos/slug/${slug}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to load course", err);
      }
    };

    fetchCourse();
  }, [slug, hasCourseAccess, navigate]);

  const handleVideoEnded = async () => {
    try {
      const res = await axiosInstance.get(`/quiz/quizzes/${slug}`);
      setQuiz(res.data.quiz || []);
      setShowQuiz(true);
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
    }
  };

  if (!course) return <div className="text-center py-10">Loading course...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

      <video
        ref={videoRef}
        controls
        className="w-full rounded"
        src={course.videoUrl}
        onEnded={handleVideoEnded}
      />

      <p className="mt-4 text-gray-700">{course.description}</p>

      {showQuiz && quiz.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quiz</h2>
          {quiz.map((question, idx) => (
            <div key={question._id} className="mb-6">
              <p className="font-medium">{idx + 1}. {question.question}</p>
              {question.options.map((opt, i) => (
                <div key={i} className="flex items-center mt-2">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    id={`q${idx}-opt${i}`}
                    value={opt}
                    className="mr-2"
                  />
                  <label htmlFor={`q${idx}-opt${i}`}>{opt}</label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchCourse;
