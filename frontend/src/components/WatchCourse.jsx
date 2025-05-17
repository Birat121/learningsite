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
  const videoRef = useRef(null);

  useEffect(() => {
    if (!hasCourseAccess(slug)) {
      navigate("/login");
      return;
    }

    const fetchModules = async () => {
      try {
        const res = await axiosInstance.get(`/courses/course/slug/${slug}`);
        setModules(res.data.modules || []);

        if (res.data.modules && res.data.modules.length > 0) {
          const firstModule = res.data.modules[0];
          if (firstModule.videos && firstModule.videos.length > 0) {
            setSelectedVideo(firstModule.videos[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load modules", err);
      }
    };

    fetchModules();
  }, [slug, hasCourseAccess, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar - Modules & Videos */}
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
                {module.videos && module.videos.length > 0 ? (
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

        {/* Main Content - Video Player */}
        <main className="md:w-2/3 bg-white rounded-2xl shadow-lg p-5 flex flex-col border border-gray-100">
          {selectedVideo ? (
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
                className="w-full rounded-lg shadow-md aspect-video"
                src={selectedVideo.videoUrl}
              />
            </>
          ) : (
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
