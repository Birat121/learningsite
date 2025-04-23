import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaTools, FaBuilding, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const courses = [
  {
    icon: <FaBook className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Real Estate Investing 101",
    description: "Learn the fundamentals of real estate investing, risk management, and portfolio building.",
  },
  {
    icon: <FaTools className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Advanced Property Flipping",
    description: "Master the art of flipping properties with real-world strategies and case studies.",
  },
  {
    icon: <FaBuilding className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Rental Property Mastery",
    description: "Learn how to buy, manage, and profit from rental properties long-term.",
  },
  {
    icon: <FaChartLine className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Financing & Mortgages",
    description: "Understand mortgage structures, financing deals, and getting the best loan terms.",
  },
];

const Courses = () => {
  return (
    <motion.section
      id="courses"
      className="py-16 px-6 md:px-20 bg-gray-50 text-gray-800 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Courses & Training</h2>
      <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
        Empower yourself with practical real estate knowledge tailored to all experience levels.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left justify-items-center">
        {courses.map((course, index) => (
          <div key={index} className="max-w-xs flex flex-col items-center">
            <div className="flex flex-col items-center text-center">
              {course.icon}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{course.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link 
          to="/courses" 
          smooth={true} 
          duration={500} 
          className="inline-block px-8 py-4 text-base sm:text-xl bg-[rgb(0,104,80)] text-white font-semibold rounded-lg shadow-md  transition"
        >
          Explore Courses
        </Link>
      </div>
    </motion.section>
  );
};

export default Courses;
