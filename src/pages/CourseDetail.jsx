import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate hook

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/videos/videos/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAccess = async () => {
      try {
        const res = await axiosInstance.get(`/purchases/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHasAccess(res.data.hasAccess);
      } catch (err) {
        console.error("Access check failed:", err);
        setHasAccess(false);
      }
    };

    fetchCourse();
    fetchAccess();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setQuizLoading(true);
      const res = await axiosInstance.get(`/quiz/quizzes/${id}`);
      setQuiz(res.data);
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    fetchQuiz();
  };

  const handleQuizSubmit = () => {
    setSubmitted(true);

    // Optional: Submit to backend
    // axiosInstance.post("/quiz-results", {
    //   courseId: id,
    //   answers,
    // });
  };

  // Navigate to checkout page
  const handleBuyNowClick = () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
    if (token) {
      navigate(`/checkout/${id}`); // If the user is logged in, navigate to the checkout page
    } else {
      // If the user is not logged in, show an alert or redirect to the login page
      toast.error("Please log in to buy this course.");
      navigate("/login"); // Redirect to login page (you can change this as per your routing structure)
    }
  };
  

  if (loading) return <div className="pt-24 text-center">Loading course…</div>;
  if (error)
    return <div className="pt-24 text-center text-red-500">{error}</div>;
  if (!course)
    return (
      <div className="pt-24 text-center text-red-600">Course not found.</div>
    );

  const outcomes = Array.isArray(course.courseOutcome)
    ? course.courseOutcome
    : [];

  return (
    <div className="mt-16 mb-10 pt-24 pb-20">
      {/* Video Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full rounded-xl overflow-hidden shadow-lg">
          {hasAccess ? (
            showVideo ? (
              <video
                controls
                autoPlay
                poster={course.thumbnailUrl}
                className="w-full h-[450px] object-cover"
                onEnded={handleVideoEnd}
              >
                <source src={course.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                onClick={() => setShowVideo(true)}
                className="relative w-full h-[450px] bg-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <img
                  src={course.thumbnailUrl}
                  alt="Click to play"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 bg-black bg-opacity-50 p-4 rounded-full">
                  <p className="text-xl text-white">▶ Click to watch course video</p>
                </div>
              </div>
            )
          ) : (
            <div className="relative w-full h-[450px] bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden">
              <img
                src={course.thumbnailUrl}
                alt="Course Thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="relative z-10 text-center px-4">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Please purchase this course to access the video.
                </p>
                <button
                  onClick={handleBuyNowClick} // Trigger navigate on click
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            {course.title}
          </h1>

          <p className="text-gray-700 text-base leading-relaxed mb-8">
            {course.description}
          </p>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              What you’ll learn
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-700 text-base">
              {outcomes.map((o, idx) => (
                <li key={idx}>{o}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-3xl font-bold text-gray-900">
              Rs. {course.price.toFixed(2)}
            </div>
            <button
              onClick={handleBuyNowClick} // Trigger navigate on click
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      {videoEnded && (
        <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Quick Quiz
          </h2>
          {quizLoading ? (
            <p className="text-gray-600">Loading quiz…</p>
          ) : quiz && quiz.questions && quiz.questions.length > 0 ? (
            <>
              <p className="text-gray-700 mb-6">
                Test your knowledge based on the video you just watched.
              </p>

              {quiz.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-6">
                  <p className="text-gray-800 font-medium mb-2">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="block">
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={i}
                          checked={answers[qIndex] === i}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [qIndex]: i,
                            }))
                          }
                          className="mr-2"
                          disabled={submitted}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {!submitted && (
                <button
                  onClick={handleQuizSubmit}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  Submit Answers
                </button>
              )}

              {submitted && (
                <div className="mt-6 space-y-4 text-lg">
                  {quiz.questions.map((q, i) => (
                    <div key={i}>
                      {answers[i] === q.correctAnswer ? (
                        <span className="text-green-600 font-semibold">
                          ✅ Question {i + 1} is correct!
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          ❌ Question {i + 1} is incorrect. Correct answer is:{" "}
                          {q.options[q.correctAnswer]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-red-600">No quiz available for this course.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
