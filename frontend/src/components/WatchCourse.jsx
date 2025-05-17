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
        // Fetch course with modules & videos (you only need modules & videos)
        const res = await axiosInstance.get(`/courses/course/slug/${slug}`);
        setModules(res.data.modules || []);

        // Set first video of first module as default selected
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
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
      {/* Modules & Videos List */}
      <aside className="md:w-1/3 bg-white rounded-lg shadow p-5 overflow-y-auto max-h-[600px]">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Modules</h2>
        {modules.length === 0 ? (
          <p className="text-gray-500">No modules found.</p>
        ) : (
          modules.map((module) => (
            <div key={module._id} className="mb-6">
              <h3 className="font-semibold text-lg mb-2 border-l-4 border-blue-600 pl-2">
                {module.title}
              </h3>
              {module.videos && module.videos.length > 0 ? (
                <ul>
                  {module.videos.map((video) => (
                    <li key={video._id} className="mb-1">
                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          if (videoRef.current) videoRef.current.load();
                        }}
                        className={`text-left w-full px-2 py-1 rounded ${
                          selectedVideo && selectedVideo._id === video._id
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-gray-800 hover:bg-blue-100"
                        } focus:outline-none`}
                      >
                        {video.title}
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

      {/* Video Player */}
      <main className="md:w-2/3 bg-white rounded-lg shadow p-5 flex flex-col">
        {selectedVideo ? (
          <>
            <h2 className="text-xl font-semibold mb-4">{selectedVideo.title}</h2>
            <video
              ref={videoRef}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full rounded-lg shadow-md"
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
  );
};

export default WatchCourse;
