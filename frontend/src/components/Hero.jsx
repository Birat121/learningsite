import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'react-feather';

import dubai from '../assets/Dubai-Skyline.jpg';
import axiosInstance from '../api/axiosInstance';

const Hero = () => {
  const [hero, setHero] = useState({
    title: 'KOFFEE WITH KIRREN',
    subtitle: 'Your Gateway to Smart Real Estate Investments & Education.',
    image: dubai,
  });

  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/hero/get')
      .then((res) => {
        setHero((prev) => ({
          ...prev,
          ...res.data,
          image: res.data.image || prev.image,
        }));
      })
      .catch(() => {
        // Already using default fallback
      });
  }, []);

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen w-full pt-16 overflow-hidden">
      {/* Lazy-loaded background image */}
      <img
        src={hero.image}
        alt="Hero"
        onLoad={() => setBgLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ display: bgLoaded ? 'block' : 'none' }}
        loading="eager"
        decoding="async"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-[calc(100vh-64px)] text-center px-4">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-snug"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {hero.title}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-white mb-6 max-w-md sm:max-w-xl font-medium drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {hero.subtitle}
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          className="flex flex-col items-center absolute bottom-16 sm:bottom-20 cursor-pointer animate-bounce"
          onClick={scrollToCourses}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h2 className="text-white text-sm sm:text-lg">Scroll</h2>
          <ChevronDown className="text-white w-6 h-6 sm:w-8 sm:h-8" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
