import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";

const WatchCourse = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasCourseAccess } = useAuth();

  const [courseTitle, setCourseTitle] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const videoRef = useRef();

  useEffect(() => {
    if (!hasCourseAccess(slug)) {
      console.log("Access denied. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchCourseData = async () => {
      try {
        const courseRes = await axiosInstance.get(`/courses/course/slug/${slug}`);
        const course = courseRes.data;
        setCourseTitle(course.title || "");

        if (course.modules?.length > 0) {
          setModules(course.modules);
          const firstModule = course.modules[0];
          if (firstModule.videos?.length > 0) {
            setSelectedVideo(firstModule.videos[0]);
          }
        }

        if (course._id) {
          const quizRes = await axiosInstance.get(`/quiz/course/${course._id}`);
          setQuiz(quizRes.data);
        }
      } catch (err) {
        console.error("Error loading course or quiz:", err);
      }
    };

    fetchCourseData();
  }, [slug, hasCourseAccess, navigate]);

  const markVideoComplete = (videoId) => {
    setCompletedVideos((prev) => new Set(prev).add(videoId));
  };

  const handleSubmitQuiz = () => {
    let total = 0;
    quiz.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        total++;
      }
    });
    setScore(total);
    setSubmitted(true);
  };

  const onVideoLoadStart = () => {
    setVideoLoading(true);
    setVideoError(false);
  };

  const onVideoLoadedData = () => {
    setVideoLoading(false);
  };

  const onVideoError = (e) => {
    console.error("Video failed to load:", e);
    setVideoLoading(false);
    setVideoError(true);
  };

  if (!courseTitle) return <div className="p-4 text-center">Loading course...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">{courseTitle}</h2>

        {selectedVideo ? (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
            <video
              ref={videoRef}
              key={selectedVideo.videoUrl}
              controls
              onEnded={() => markVideoComplete(selectedVideo._id)}
              onLoadStart={onVideoLoadStart}
              onLoadedData={onVideoLoadedData}
              onError={onVideoError}
              className="w-full max-h-[400px] rounded shadow"
            >
              <source src={selectedVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {videoLoading && <p>Loading video...</p>}
            {videoError && <p className="text-red-500">Failed to load video.</p>}
          </div>
        ) : (
          <p>Select a video to start watching.</p>
        )}

        {quiz && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Quiz</h3>
            {!submitted ? (
              <div>
                <p className="mb-4">{quiz.questions[currentQuestionIndex].question}</p>
                <ul className="mb-4">
                  {quiz.questions[currentQuestionIndex].options.map((opt, idx) => (
                    <li key={idx}>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q-${currentQuestionIndex}`}
                          value={opt}
                          checked={userAnswers[currentQuestionIndex] === opt}
                          onChange={() =>
                            setUserAnswers((prev) => ({
                              ...prev,
                              [currentQuestionIndex]: opt,
                            }))
                          }
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-200 px-4 py-2 rounded"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(prev + 1, quiz.questions.length - 1)
                        )
                      }
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={handleSubmitQuiz}
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold">
                  Your Score: {score} / {quiz.questions.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-64 border-l border-gray-300 pl-4">
        <h4 className="text-lg font-semibold mb-2">Course Modules</h4>
        {modules.map((mod) => (
          <div key={mod._id} className="mb-4">
            <p className="font-semibold">{mod.title}</p>
            <ul>
              {mod.videos.map((video) => (
                <li key={video._id} className="text-sm">
                  <button
                    onClick={() => {
                      setSelectedVideo(video);
                      if (videoRef.current) videoRef.current.load();
                      setVideoError(false);
                      setVideoLoading(false);
                    }}
                    className={`text-left w-full px-2 py-1 rounded ${
                      selectedVideo?._id === video._id
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {video.title}
                    {completedVideos.has(video._id) && (
                      <span className="text-green-500 ml-2">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchCourse;
