import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import soon from "../assets/soon.webp";

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
  const isConsultPage = location.pathname.startsWith("/consult");
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/youtube/get");
        setVideos(res.data || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const displayedVideos = videos.length > 0 ? videos : staticVideos;

  return (
    <section className="py-12 px-4 bg-[rgb(0,104,80)] text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          {!isConsultPage ? <div>Learn On the Go</div> : null}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white mb-10">
          {!isConsultPage ? (
            <div>
              {" "}
              Tune into my podcasts and videos for quick, actionable real estate
              tips and insights.
            </div>
          ) : (
            <div>
              Tune into my videos for quick, actionable real estate tips and
              insights.
            </div>
          )}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap">
          {displayedVideos
            .filter(
              (video) =>
                !(
                  isConsultPage &&
                  ["Your Relocation Guide", "Welcome to the Jungle!"].includes(
                    video.title
                  )
                )
            )
            .map((video, idx) => (
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
                  <div className="relative w-full h-[180px]">
                    <iframe
                      src={video.embeddedUrl}
                      title={video.title}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
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
