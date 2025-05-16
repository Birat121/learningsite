import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import DOMPurify from "dompurify";

const WatchCourse = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasCourseAccess } = useAuth();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
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
        // Assuming this returns course with modules and their videos
        const res = await axiosInstance.get(`/courses/course/slug/${slug}`);
        setCourse(res.data);
        // Set first video of first module as default selected
        if (res.data.modules && res.data.modules.length > 0) {
          const firstModule = res.data.modules[0];
          if (firstModule.videos && firstModule.videos.length > 0) {
            setSelectedVideo(firstModule.videos[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load course", err);
      }
    };

    fetchCourse();
  }, [slug, hasCourseAccess, navigate]);

  const handleVideoEnded = async () => {
    if (!selectedVideo) return;
    try {
      const res = await axiosInstance.get(`/quiz/quizzes/${selectedVideo._id}`);
      setQuiz(res.data.quiz || []);
      setShowQuiz(true);
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
    }
  };

  if (!course)
    return <div className="text-center py-10">Loading course...</div>;

  const sanitizedDescription = DOMPurify.sanitize(course.description);

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 mt-20 mb-26">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-700 mb-6">
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Modules list */}
        <div className="space-y-6 overflow-y-auto max-h-[600px] border p-4 rounded shadow">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module) => (
              <div key={module._id}>
                <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                <ul className="pl-4">
                  {module.videos && module.videos.length > 0 ? (
                    module.videos.map((video) => (
                      <li key={video._id} className="mb-1">
                        <button
                          onClick={() => {
                            setSelectedVideo(video);
                            setShowQuiz(false);
                            setQuiz([]);
                            if (videoRef.current) videoRef.current.load();
                          }}
                          className={`text-left w-full ${
                            selectedVideo && selectedVideo._id === video._id
                              ? "font-bold text-blue-600"
                              : "text-gray-800 hover:text-blue-600"
                          }`}
                        >
                          {video.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No videos</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p>No modules found</p>
          )}
        </div>

        {/* Right: Video player and quiz */}
        <div className="md:col-span-2">
          {selectedVideo ? (
            <video
              ref={videoRef}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-64 md:h-96 rounded shadow"
              src={selectedVideo.videoUrl}
              onEnded={handleVideoEnded}
            />
          ) : (
            <p>Select a video to start watching.</p>
          )}

          {/* Quiz Section */}
          {showQuiz && quiz.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Quiz</h2>
              {quiz.map((question, idx) => (
                <div key={question._id} className="mb-6">
                  <p className="font-medium">
                    {idx + 1}. {question.question}
                  </p>
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
      </div>
    </div>
  );
};

export default WatchCourse;
