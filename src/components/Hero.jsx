import React from 'react';
import realstate from '../assets/realstate2.jpg';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

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
        style={{ backgroundImage: `url(${realstate})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-[calc(100vh-64px)] text-center px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Welcome to <span className="text-white">KOFFEE WITH KIRREN</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-xl text-white mb-6 max-w-2xl font-semibold drop-shadow-md"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Your Gateway to Smart Real Estate Investments & Education.
        </motion.p>

        <motion.button
          onClick={scrollToCourses}
          className="bg-[rgb(0,104,80)] text-xl text-white font-semibold px-6 py-4 rounded-full transition duration-300 shadow-md hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Start Learning Now
        </motion.button>

        {/* Scroll Down Arrow */}
        <motion.div
          className="absolute bottom-10 animate-bounce cursor-pointer"
          onClick={scrollToCourses}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <ChevronDown className="text-white w-8 h-8" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
