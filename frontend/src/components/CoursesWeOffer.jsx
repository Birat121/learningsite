import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaTools, FaBuilding, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const getStaticCourses = () => ([
  {
    icon: <FaBook className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Introduction to Off Plan",
    description: "Discover Dubai's past, present, and future, and understand the off-plan process.",
  },
  {
    icon: <FaTools className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Introduction to Leasing",
    description: "Coming soon",
  },
  {
    icon: <FaBuilding className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Introduction to Secondary",
    description: "Coming soon",
  },
  {
    icon: <FaChartLine className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Sales Techniques",
    description: "Coming soon",
  },
  {
    icon: <FaBuilding className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Dubai Area Guides",
    description: "Coming soon",
  },
  {
    icon: <FaBuilding className="text-[rgb(0,104,80)] text-4xl mb-4" />,
    title: "Dubai Property Developers",
    description: "Coming soon",
  }
]);

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosInstance.get('/courses/course')
      .then(response => {
        let fetchedCourses = [];
        if (Array.isArray(response.data) && response.data.length > 0) {
          fetchedCourses = response.data.map(course => ({
            ...course,
            description: course.description?.substring(0, 100) || "Learn more",
            icon: <FaBook className="text-[rgb(0,104,80)] text-4xl mb-4" />
          }));
        }

        const staticCourses = getStaticCourses();

        if (fetchedCourses.length < 6) {
          const fetchedTitles = new Set(fetchedCourses.map(c => c.title));
          const remainingStatic = staticCourses.filter(sc => !fetchedTitles.has(sc.title));
          fetchedCourses = [...fetchedCourses, ...remainingStatic.slice(0, 6 - fetchedCourses.length)];
        }

        setCourses(fetchedCourses);
      })
      .catch(err => {
        console.error("Failed to fetch courses:", err);
        setCourses(getStaticCourses());
      });
  }, []);

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
        Empower yourself with practical Dubai real estate knowledge tailored to new and aspiring agents at foundation level.
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
          className="inline-block px-8 py-4 text-base sm:text-xl bg-[rgb(0,104,80)] text-white font-semibold rounded-lg shadow-md transition"
        >
          Explore Courses
        </Link>
      </div>
    </motion.section>
  );
};

export default Courses;
