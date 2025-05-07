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

const outcomes = Array.isArray(course.courseOutcome) ? course.courseOutcome : [];


  return (
    <div className="max-w-6xl mx-auto px-4 py-20 mt-20 mb-26">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Title, description, outcome */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-700 mb-6">{course.description}</p>

          {outcomes.length > 0 && (
  <div className="bg-gray-100 p-4 rounded">
    <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
    <ul className="list-disc list-inside text-gray-600">
      {outcomes.map((o, idx) => (
        <li key={idx}>{o}</li>
      ))}
    </ul>
  </div>
)}

        </div>

        {/* Right: Video player */}
        <div>
         <video
  ref={videoRef}
  controls
  controlsList="nodownload noremoteplayback"
  disablePictureInPicture
  onContextMenu={(e) => e.preventDefault()}
  className="w-full h-64 md:h-80 rounded shadow"
  src={course.videoUrl}
  onEnded={handleVideoEnded}
/>

        </div>
      </div>

      {/* Quiz Section */}
      {showQuiz && quiz.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Quiz</h2>
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
