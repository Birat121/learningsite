import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";

const WatchCourse = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasCourseAccess } = useAuth();

  const [modules, setModules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const videoRef = useRef(null);

  useEffect(() => {
  if (!hasCourseAccess(slug)) {
    console.warn("Access denied or not logged in for course:", slug);
    navigate("/login");
    return;
  }

  const fetchCourseAndQuiz = async () => {
    try {
      console.log("Fetching course with slug:", slug);
      const courseRes = await axiosInstance.get(`/courses/course/slug/${slug}`);
      const course = courseRes.data;

      console.log("Fetched course:", course);

      if (!course || !course.modules) {
        console.warn("No course data or modules found.");
        setModules([]);
      } else {
        setModules(course.modules);
      }

      // Select first video
      if (course.modules?.length > 0) {
        const firstModule = course.modules[0];
        if (firstModule.videos?.length > 0) {
          setSelectedVideo(firstModule.videos[0]);
        }
      }

      // Fetch quiz if course has an ID
      if (course._id) {
        console.log("Fetching quiz for course ID:", course._id);
        const quizRes = await axiosInstance.get(`/quiz/course/${course._id}`);
        console.log("Fetched quiz:", quizRes.data);
        setQuiz(quizRes.data);
      } else {
        console.warn("Course ID not found. Skipping quiz fetch.");
      }
    } catch (err) {
      console.error("Error loading course or quiz:", err);
    }
  };

  fetchCourseAndQuiz();
}, [slug, hasCourseAccess, navigate]);


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
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 mt-28">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
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
                            if (videoRef.current) videoRef.current.load();
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
                  <p className="text-gray-400 italic ml-4">
                    No videos available
                  </p>
                )}
              </div>
            ))
          )}
        </aside>

        {/* Main Content */}
        <main className="md:w-2/3 bg-white rounded-2xl shadow-lg p-5 flex flex-col border border-gray-100">
          {selectedVideo && !allCompleted && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {selectedVideo.title}
              </h2>
              <video
                ref={videoRef}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                onEnded={() => markVideoComplete(selectedVideo._id)}
                className="w-full rounded-lg shadow-md aspect-video"
                src={selectedVideo.videoUrl}
              />
              <p className="mt-2 text-sm text-gray-600">
                Watch all videos to unlock the quiz.
              </p>
            </>
          )}

          {allCompleted && quiz && (
            <div className="quiz-section mt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Course Quiz
              </h2>
              {quiz.questions?.length > 0 ? (
                quiz.questions.map((q, i) => (
                  <div key={i} className="mb-5 p-4 border rounded shadow-sm">
                    <p className="font-semibold mb-2">
                      {i + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options?.map((opt, idx) => (
                        <label key={idx} className="block">
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={opt}
                            disabled={submitted}
                            checked={userAnswers[i] === opt}
                            onChange={() =>
                              setUserAnswers((prev) => ({
                                ...prev,
                                [i]: opt,
                              }))
                            }
                            className="mr-2"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No quiz questions available.</p>
              )}

              {!submitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit Quiz
                </button>
              ) : (
                <p className="mt-4 text-lg font-semibold text-green-600">
                  You scored {score} out of {quiz.questions.length}
                </p>
              )}
            </div>
          )}

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
