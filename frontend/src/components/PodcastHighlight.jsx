import React, { useEffect, useState } from 'react';
import soon from '../assets/soon.webp';
import { PlayCircle } from 'react-feather';
import axiosInstance from '../api/axiosInstance'; // Adjust path if needed

const PodcastHighlight = () => {
  const [videos, setVideos] = useState([]);

  const fallbackVideos = [
    {
      title: "Welcome to the Jungle!",
      comingSoon: true,
    },
    {
      title: "Breaking into Dubai: An Expat's Story",
      comingSoon: true,
    },
    {
      title: "Dubai Real Estate Interviews: The Questions That Matter",
      comingSoon: true,
    },
  ];

  const fetchVideos = async () => {
    try {
      const res = await axiosInstance.get('/youtube/get');
      if (res.data.length > 0) {
        setVideos(res.data);
      } else {
        setVideos(fallbackVideos);
      }
    } catch (err) {
      console.error('Failed to load videos. Showing fallback.', err);
      setVideos(fallbackVideos);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <section className="py-12 px-4 bg-[rgb(0,104,80)] text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Learn On the Go
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white mb-10">
          Tune into my podcasts and videos for quick, actionable real estate tips and insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap">
          {videos.map((video, idx) => (
            <div
              key={idx}
              className="
                relative
                bg-white
                rounded-xl
                overflow-hidden
                shadow-lg
                hover:shadow-xl
                transition
                group
                w-full
                max-w-xs
                sm:w-[320px]
                mx-auto
              "
            >
              {video.comingSoon ? (
                <img
                  src={soon}
                  alt={video.title}
                  className="w-full h-[180px] object-cover"
                />
              ) : (
                <iframe
                  src={video.embeddedUrl}
                  title={video.title}
                  className="w-full h-[180px]"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}

              {/* Overlay Icon */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <PlayCircle className="text-white w-12 h-12" />
              </div>

              <div className="px-4 py-3 text-[rgb(0,104,80)] font-semibold text-base">
                {video.title}
                <p className="text-xs text-gray-500 mt-1">
                  {video.comingSoon ? 'Coming Soon' : 'Now Streaming'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodcastHighlight;
