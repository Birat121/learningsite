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
          {/* Real Estate Video 1 */}
          <div className="flex flex-col items-center bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition">
            <iframe
              width="320"
              height="180"
              src="https://www.youtube.com/embed/kOwpoIiLxYw"
              title="Dubai Real Estate Market 2024"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mb-3"
            ></iframe>
            <p>Dubai Real Estate Market 2024</p>
          </div>

          {/* Real Estate Video 2 */}
          <div className="flex flex-col items-center bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition">
            <iframe
              width="320"
              height="180"
              src="https://www.youtube.com/embed/9JjMOripZ14"
              title="How to Invest in Dubai Real Estate"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mb-3"
            ></iframe>
            <p>How to Invest in Dubai Real Estate</p>
          </div>

          {/* Real Estate Video 3 */}
          <div className="flex flex-col items-center bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition">
            <iframe
              width="320"
              height="180"
              src="https://www.youtube.com/embed/dXqwh2JvySc"
              title="Beginner’s Guide to Off-Plan Property in Dubai"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mb-3"
            ></iframe>
            <p>Beginner’s Guide to Off-Plan Property</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastHighlight;
