import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axiosInstance from '../api/axiosInstance';

const Introduction = () => {
  const [content, setContent] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axiosInstance.get('intro/intro');
        setContent(res.data);
      } catch (error) {
        console.error('Failed to fetch introduction content:', error);
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
      className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-20 py-16 sm:py-20 bg-white text-gray-800 overflow-hidden"
    >
      {/* Left Side Image */}
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0 relative z-10">
        <img
          src={content.image}
          alt="Introduction"
          onLoad={() => setImageLoaded(true)}
          className="w-[85%] sm:w-[80%] md:w-[100%] lg:w-[80%] h-auto object-cover rounded-md"
          style={{ display: imageLoaded ? 'block' : 'none' }}
          loading="eager"
          decoding="async"
        />
        {!imageLoaded && (
          <div className="w-[85%] sm:w-[80%] md:w-[100%] lg:w-[80%] h-[300px] bg-gray-200 animate-pulse rounded-md" />
        )}
      </div>

      {/* Right Side Text */}
      <div className="w-full md:w-1/2 relative z-10 flex flex-col justify-center md:pl-12 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[rgb(0,104,80)]">
          {content.heading}
        </h2>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-gray-700">
          {content.subheading}
        </h3>
        <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
          {content.paragraph1}
        </p>
        <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 leading-relaxed">
          {content.paragraph2}
        </p>
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-bold">
            Ready to level up your real estate knowledge?
          </p>
          <Link
            to="/about"
            className="flex items-center space-x-2 text-[rgb(0,104,80)] font-semibold text-sm sm:text-base md:text-lg"
          >
            <span>Why Choose Me?</span>
            <span className="text-[rgb(0,104,80)] text-2xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
