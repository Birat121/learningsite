import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet"; // Import React Helmet

const CourseDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();

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
        const res = await axiosInstance.get(`/videos/videos/slug/${slug}`);
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
        const res = await axiosInstance.get(`/purchases/${slug}`, {
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
  }, [slug]); // ✅ use slug here

  const fetchQuiz = async () => {
    try {
      setQuizLoading(true);
      const res = await axiosInstance.get(`/api/quiz/quizzes/${id}`);
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
    // Optional: Submit answers to backend
  };

  const handleBuyNowClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/checkout/${slug}`);
    } else {
      toast.error("Please log in to buy this course.");
      navigate("/login");
    }
  };

  if (loading) return <div className="pt-24 text-center">Loading course…</div>;
  if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;
  if (!course) return <div className="pt-24 text-center text-red-600">Course not found.</div>;

  const outcomes = Array.isArray(course.courseOutcome) ? course.courseOutcome : [];

  return (
    <div className="pt-32 pb-20 px-4">

      {/* Meta Tags for SEO using React Helmet */}
      <Helmet>
        <title>{course.title} | Koffee With Kirren</title>
        <meta name="description" content={course.description} />
        <meta property="og:title" content={course.title} />
        <meta property="og:description" content={course.description} />
        <meta property="og:image" content={course.thumbnailUrl} />
        <meta property="og:url" content={`https://yourdomain.com/courses/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={course.title} />
        <meta name="twitter:description" content={course.description} />
        <meta name="twitter:image" content={course.thumbnailUrl} />
        <link rel="canonical" href={`https://yourdomain.com/courses/${slug}`} />
      </Helmet>

      {/* Course Main Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Left: Course Info */}
        <div className="lg:w-2/3 bg-white p-8 rounded-xl shadow">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{course.title}</h1>
          <p className="text-gray-700 mb-6">{course.description}</p>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">What you’ll learn</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {outcomes.map((o, idx) => (
                <li key={idx}>{o}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Video and Buy Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
            {hasAccess ? (
              showVideo ? (
                <video
                  controls
                  autoPlay
                  poster={course.thumbnailUrl}
                  className="w-full h-[400px] object-cover"
                  onEnded={handleVideoEnd}
                >
                  <source src={course.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  onClick={() => setShowVideo(true)}
                  className="relative w-full h-[400px] bg-gray-300 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt="Click to play"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 bg-black bg-opacity-50 px-4 py-2 rounded">
                    <p className="text-white text-lg font-semibold">▶ Click to watch video</p>
                  </div>
                </div>
              )
            ) : (
              <div className="relative w-full h-[400px] bg-gray-200 flex items-center justify-center">
                <img
                  src={course.thumbnailUrl}
                  alt="Course Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="relative z-10 text-center px-4">
                  <p className="text-gray-800 font-semibold mb-2">
                    Purchase to access this video
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
            <div className="text-3xl font-bold text-gray-900">AED {course.price.toFixed(2)}</div>
            <button
              onClick={handleBuyNowClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      {videoEnded && (
        <div className="max-w-4xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Quiz</h2>
          {quizLoading ? (
            <p className="text-gray-600">Loading quiz…</p>
          ) : quiz && quiz.questions && quiz.questions.length > 0 ? (
            <>
              <p className="text-gray-700 mb-6">Test your knowledge from the video.</p>
              {quiz.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-6">
                  <p className="font-medium mb-2">{qIndex + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="block">
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={i}
                          checked={answers[qIndex] === i}
                          onChange={() => setAnswers((prev) => ({ ...prev, [qIndex]: i }))}
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
                      {answers[i] === q.correctOption ? (
                        <p className="text-green-500">
                          Question {i + 1}: Correct!
                        </p>
                      ) : (
                        <p className="text-red-500">
                          Question {i + 1}: Incorrect.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">No quiz available for this course.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;

