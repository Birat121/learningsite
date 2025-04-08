import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaTools, FaBuilding, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import react-scroll Link

const courses = [
  {
    icon: <FaBook className="text-indigo-500 text-4xl mb-4" />,
    title: "Real Estate Investing 101",
    description: "Learn the fundamentals of real estate investing, risk management, and portfolio building.",
  },
  {
    icon: <FaTools className="text-indigo-500 text-4xl mb-4" />,
    title: "Advanced Property Flipping",
    description: "Master the art of flipping properties with real-world strategies and case studies.",
  },
  {
    icon: <FaBuilding className="text-indigo-500 text-4xl mb-4" />,
    title: "Rental Property Mastery",
    description: "Learn how to buy, manage, and profit from rental properties long-term.",
  },
  {
    icon: <FaChartLine className="text-indigo-500 text-4xl mb-4" />,
    title: "Financing & Mortgages",
    description: "Understand mortgage structures, financing deals, and getting the best loan terms.",
  },
];

const Courses = () => {
  return (
    <motion.section
      id="courses" // Give the section an ID for scrolling to it
      className="py-16 px-6 md:px-20 bg-gray-50 text-gray-800 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Courses & Training</h2>
      <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8">
        Empower yourself with practical real estate knowledge tailored to all experience levels.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left justify-items-center">
        {courses.map((course, index) => (
          <div key={index} className="max-w-xs">
            <div className="flex flex-col items-start">
              {course.icon}
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-base text-gray-600">{course.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Button to scroll to the Courses section */}
      <div className="mt-8">
        <Link 
          to="/courses" 
          smooth={true} 
          duration={500} 
          className="inline-block px-8 py-4 text-xl bg-[rgb(0,104,80)] text-white font-semibold rounded-lg shadow-md  transition"
        >
          Explore Courses
        </Link>
      </div>
    </motion.section>
  );
};

export default Courses;
