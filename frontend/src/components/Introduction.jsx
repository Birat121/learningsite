import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

const Introduction = () => {
  const [content, setContent] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axiosInstance.get("intro/intro");
        setContent(res.data);
      } catch (error) {
        console.error("Failed to fetch introduction content:", error);
      }
    };

    fetchContent();
  }, []);

  if (!content) {
    return (
      <section className="py-16 bg-white text-center">
        <p className="text-gray-500">Loading content...</p>
      </section>
    );
  }

  return (
    <section
      id="next-section"
      className="relative flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20 py-16 sm:py-20 bg-white text-gray-800 overflow-hidden"
    >
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-2 relative z-10 px-2">
        <img
          src={content.image}
          alt="Introduction"
          onLoad={() => setImageLoaded(true)}
          className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl h-auto object-cover rounded-lg shadow-md transition-all duration-300"
          style={{ display: imageLoaded ? "block" : "none" }}
          loading="eager"
          decoding="async"
        />
        {!imageLoaded && (
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl h-[300px] bg-gray-200 animate-pulse rounded-lg" />
        )}
      </div>

      {/* Right Side Text */}
      <div className="w-full md:w-1/2 relative z-10 flex flex-col justify-center px-2 md:pl-12 text-center md:text-left">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[rgb(0,104,80)] text-center md:text-left">
    {content.heading}
  </h2>
  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 text-gray-700 text-center md:text-left">
    {content.subheading}
  </h3>
  <p className="text-sm sm:text-base md:text-lg mb-2 leading-relaxed text-justify md:text-left">
    {content.paragraph1}
  </p>
  <p className="text-sm sm:text-base md:text-lg mb-4 leading-relaxed text-justify md:text-left">
    {content.paragraph2}
  </p>
  <div className="flex flex-col items-center md:items-start gap-2">
    <p className="text-sm sm:text-base md:text-lg text-gray-700 font-bold text-center md:text-left">
      Ready to level up your real estate knowledge?
    </p>
    <Link
      to="/about"
      className="flex items-center space-x-2 text-sm sm:text-base md:text-lg text-[rgb(0,104,80)] font-semibold"
    >
      <span>Why Choose Me?</span>
      <span className="text-xl md:text-2xl">→</span>
    </Link>
  </div>
</div>

    </section>
  );
};

export default Introduction;
