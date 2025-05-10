import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'react-feather';
import axiosInstance from '../api/axiosInstance';  // Assuming axiosInstance is set up for API requests

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    image: '',
  });
  const [bgLoaded, setBgLoaded] = useState(false);

  // Fetch hero data from the backend
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axiosInstance.get('/hero/get'); // Adjust endpoint as needed
        setHeroData({
          title: response.data.title,
          subtitle: response.data.subtitle,
          image: response.data.image,
        });
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
      }
    };

    fetchHeroData();
  }, []);  // Empty dependency array means this runs once when the component mounts

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
        src={heroData.image}
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
          {heroData.title || 'Loading...'}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-white mb-6 max-w-md sm:max-w-xl font-medium drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {heroData.subtitle || 'Please wait, loading...'}
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
