import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import Player from "@vimeo/player"; // Vimeo Player SDK import

const WatchCourse = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasCourseAccess } = useAuth();

  const [courseTitle, setCourseTitle] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Vimeo iframe ref and player instance ref
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!hasCourseAccess(slug)) {
      navigate("/login");
      return;
    }

    const fetchCourseAndQuiz = async () => {
      try {
        const courseRes = await axiosInstance.get(`/courses/course/slug/${slug}`);
        const course = courseRes.data;

        setCourseTitle(course.title || "");
        setModules(course.modules || []);

        if (course.modules?.length > 0 && course.modules[0].videos?.length > 0) {
          setSelectedVideo(course.modules[0].videos[0]);
        }

        if (course._id) {
          const quizRes = await axiosInstance.get(`/quiz/course/${course._id}`);
          setQuiz(quizRes.data);
        }
      } catch (err) {
        console.error("Error loading course or quiz:", err);
      }
    };

    fetchCourseAndQuiz();
  }, [slug, hasCourseAccess, navigate]);

  // Vimeo Player setup when selectedVideo changes
  useEffect(() => {
    if (!selectedVideo || !iframeRef.current) return;

    // Clean up previous player instance
    if (playerRef.current) {
      playerRef.current.unload().catch(() => {});
      playerRef.current = null;
    }

    // Initialize new Vimeo Player
    playerRef.current = new Player(iframeRef.current);

    // Listen for video end event
    playerRef.current.on("ended", () => {
      markVideoComplete(selectedVideo._id);
    });

    // Optional: listen for errors
    playerRef.current.on("error", (error) => {
      console.error("Vimeo Player error:", error);
    });

    // Cleanup on unmount or video change
    return () => {
      if (playerRef.current) {
        playerRef.current.unload().catch(() => {});
        playerRef.current = null;
      }
    };
  }, [selectedVideo]);

  const markVideoComplete = (videoId) => {
    setCompletedVideos((prev) => new Set(prev).add(videoId));
  };

  const allVideos = modules.flatMap((m) => m.videos || []);
  const allCompleted =
    allVideos.length > 0 && allVideos.every((v) => completedVideos.has(v._id));

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

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-6xl mx-auto px-4 mb-8 mt-8">
        <h1 className="text-4xl font-bold text-center text-blue-700">
          {courseTitle}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/3 bg-white rounded-2xl shadow-lg p-5 overflow-y-auto max-h-[75vh] border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-blue-700 border-b pb-2">
            Modules
          </h2>
          {modules.length === 0 ? (
            <p className="text-gray-500">No modules found.</p>
          ) : (
            modules.map((module) => (
              <div key={module._id} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 pl-2 border-l-4 border-blue-600">
                  {module.title}
                </h3>
                {module.videos?.length > 0 ? (
                  <ul className="space-y-1">
                    {module.videos.map((video) => (
                      <li key={video._id}>
                        <button
                          onClick={() => {
                            setSelectedVideo(video);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 ${
                            selectedVideo && selectedVideo._id === video._id
                              ? "bg-blue-600 text-white font-semibold"
                              : "text-gray-700 hover:bg-blue-100"
                          }`}
                        >
                          {video.title}
                          {completedVideos.has(video._id) && (
                            <span className="ml-2 text-green-600 font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic ml-4">No videos available</p>
                )}
              </div>
            ))
          )}
        </aside>

        <main className="md:w-2/3 bg-white rounded-2xl shadow-lg p-5 flex flex-col border border-gray-100">
          {/* Video player or quiz area */}

          {/* Show video player if video selected and quiz not unlocked */}
          {selectedVideo && !allCompleted && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {selectedVideo.title}
              </h2>

              {/* Vimeo iframe player */}
              <div className="aspect-video rounded-lg shadow-md overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={selectedVideo.videoUrl}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                  className="w-full h-full rounded-lg"
                />
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Watch all videos to unlock the quiz.
              </p>
            </>
          )}

          {/* Quiz section shown after all videos watched */}
          {allCompleted && (
            <div className="quiz-section mt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Course Quiz
              </h2>

              {!quiz || quiz.questions?.length === 0 ? (
                <p className="text-gray-500 text-lg font-medium">
                  No quiz available for this course.
                </p>
              ) : (
                <>
                  {!submitted ? (
                    <>
                      <p className="mb-4 font-semibold text-gray-700">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                      </p>

                      <div className="mb-4">
                        <p className="mb-2 font-medium text-lg text-gray-800">
                          {quiz.questions[currentQuestionIndex].question}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {quiz.questions[currentQuestionIndex].options.map(
                            (option, index) => (
                              <label
                                key={index}
                                className="block p-3 border rounded-lg cursor-pointer hover:bg-blue-50"
                              >
                                <input
                                  type="radio"
                                  name={`question-${currentQuestionIndex}`}
                                  value={index}
                                  checked={userAnswers[currentQuestionIndex] == index}
                                  onChange={() =>
                                    setUserAnswers({
                                      ...userAnswers,
                                      [currentQuestionIndex]: index,
                                    })
                                  }
                                  className="mr-2"
                                />
                                {option}
                              </label>
                            )
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          onClick={() =>
                            setCurrentQuestionIndex((i) => Math.max(i - 1, 0))
                          }
                          disabled={currentQuestionIndex === 0}
                          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                          Previous
                        </button>

                        {currentQuestionIndex < quiz.questions.length - 1 ? (
                          <button
                            onClick={() =>
                              setCurrentQuestionIndex((i) =>
                                Math.min(i + 1, quiz.questions.length - 1)
                              )
                            }
                            disabled={userAnswers[currentQuestionIndex] === undefined}
                            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitQuiz}
                            disabled={userAnswers[currentQuestionIndex] === undefined}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                          >
                            Submit Quiz
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-4 text-green-700">
                        Your Score: {score} / {quiz.questions.length}
                      </h3>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setUserAnswers({});
                          setScore(0);
                          setCurrentQuestionIndex(0);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* No video selected & no quiz unlocked */}
          {!selectedVideo && !allCompleted && (
            <p className="text-center text-gray-500 py-20">
              Select a video to start watching
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default WatchCourse;
