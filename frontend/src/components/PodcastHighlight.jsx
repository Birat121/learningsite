import React from 'react';

const PodcastHighlight = () => {
  return (
    <section className="py-12 px-4 bg-[rgb(0,104,80)] text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Learn On the Go
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white mb-8">
          Tune into my podcasts and videos for quick, actionable real estate tips and insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {/* Embed YouTube Video */}
          <div className="flex flex-col items-center bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition">
            <iframe
              width="320"
              height="180"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID_1" // Replace with your actual YouTube video ID
              title="YouTube video 1"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mb-3"
            ></iframe>
            <p>Watch on YouTube</p>
          </div>

          {/* Embed Another YouTube Video */}
          <div className="flex flex-col items-center bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition">
            <iframe
              width="320"
              height="180"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID_2" // Replace with your actual YouTube video ID
              title="YouTube video 2"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mb-3"
            ></iframe>
            <p>Watch on YouTube</p>
          </div>

          {/* Embed Another YouTube Video */}
          <div className="flex flex-col items-center bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition">
            <iframe
              width="320"
              height="180"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID_3" // Replace with your actual YouTube video ID
              title="YouTube video 3"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mb-3"
            ></iframe>
            <p>Watch on YouTube</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastHighlight;
