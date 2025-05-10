import React from 'react';
import dubai from '../assets/Dubai-Skyline.jpg';
import { motion } from 'framer-motion';
import { ChevronDown } from 'react-feather'; // Make sure you have installed react-feather or use your preferred icon library

const Hero = () => {
  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-cover"
        style={{ backgroundImage: `url(${dubai})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-[calc(100vh-64px)] text-center px-4">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-snug"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-white">KOFFEE WITH KIRREN</h1>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-white mb-6 max-w-md sm:max-w-xl font-medium drop-shadow-md"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Your Gateway to Smart Real Estate Investments & Education.
        </motion.p>

        {/* Scroll Down Text & Arrow */}
        <motion.div
          className="flex flex-col items-center space-x-2 absolute bottom-16 sm:bottom-20 cursor-pointer animate-bounce"
          onClick={scrollToCourses}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <h2 className="text-white text-sm sm:text-lg">Scroll</h2>
          <ChevronDown className="text-white w-6 h-6 sm:w-8 sm:h-8" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


