import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import soon from '../assets/soon.webp';
import { PlayCircle } from 'react-feather';

const staticVideos = [
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

const PodcastHighlight = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get('/youtube/get');
        setVideos(res.data || []);
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const displayedVideos = videos.length > 0 ? videos : staticVideos;

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
          {displayedVideos.map((video, idx) => (
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
                <>
                  <img
                    src={soon}
                    alt={video.title}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </>
              ) : (
                <div className="relative w-full h-[180px]">
                  <iframe
                    src={video.embeddedUrl}
                    title={video.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>
              )}

              <div className="px-4 py-3 text-[rgb(0,104,80)] font-semibold text-base">
                {video.title}
                {video.comingSoon && (
                  <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodcastHighlight;
