import { FaYoutube, FaSpotify, FaMicrophoneAlt } from 'react-icons/fa';

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
          <a
            href="https://www.youtube.com" // Replace with your YouTube URL
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-full hover:bg-blue-50 transition"
          >
            <FaYoutube className="text-2xl" />
            Watch on YouTube
          </a>
          <a
            href="https://www.spotify.com" // Replace with your Spotify URL
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-full hover:bg-blue-50 transition"
          >
            <FaSpotify className="text-2xl" />
            Listen on Spotify
          </a>
          <a
            href="#shorts" // Optional: link to a Shorts page or section
            className="flex items-center gap-3 bg-white text-[rgb(0,104,80)] px-6 py-4 rounded-full hover:bg-blue-50 transition"
          >
            <FaMicrophoneAlt className="text-2xl" />
            Quick Shorts
          </a>
        </div>
      </div>
    </section>
  );
};

export default PodcastHighlight;
