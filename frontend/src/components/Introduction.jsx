import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import fallbackImage from '../assets/photo4.webp';

const Introduction = () => {
  const [intro, setIntro] = useState({
    heading: 'HELLO THERE',
    subheading: 'My name is Kirren, your Dubai real estate mentor!',
    paragraph1:
      'If you’re an aspiring investor, homeowner, or property enthusiast, you’re in the right place! With years of experience in the industry, I’ve helped countless individuals navigate the complexities of real estate investment, financing, and market trends.',
    paragraph2:
      'Through my expert courses, mentorship, and insightful content, you’ll gain the confidence to make informed real estate decisions.',
    image: fallbackImage,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/intro/intro')
      .then((res) => {
        if (res.data) {
          setIntro((prev) => ({
            ...prev,
            ...res.data,
            image: res.data.image || fallbackImage,
          }));
        }
      })
      .catch(() => {
        // Fallback content remains
      });
  }, []);

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-20 py-16 sm:py-20 bg-white text-gray-800 overflow-hidden">
      {/* Left Side Image */}
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0 relative z-10">
        <img
          src={intro.image}
          alt="Introduction"
          onLoad={() => setImageLoaded(true)}
          onError={() => setIntro((prev) => ({ ...prev, image: fallbackImage }))}
          className="w-[85%] sm:w-[80%] md:w-[100%] lg:w-[80%] h-auto object-cover rounded-md"
          style={{ display: imageLoaded ? 'block' : 'none' }}
          loading="lazy"
          decoding="async"
        />
        {!imageLoaded && (
          <div className="w-[85%] sm:w-[80%] md:w-[100%] lg:w-[80%] h-[300px] bg-gray-200 animate-pulse rounded-md" />
        )}
      </div>

      {/* Right Side Text */}
      <div className="w-full md:w-1/2 relative z-10 flex flex-col justify-center md:pl-12 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[rgb(0,104,80)]">
          {intro.heading}
        </h2>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-gray-700">
          {intro.subheading}
        </h3>
        <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
          {intro.paragraph1}
        </p>
        <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 leading-relaxed">
          {intro.paragraph2}
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
