import React from 'react';
import {
  FaChalkboardTeacher,
  FaSearch,
  FaDollarSign,
  FaRegHandshake,
  FaUsers,
  FaFileAlt,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

const WhyChooseMe = () => {
  return (
    <section className="py-14 px-4 bg-[rgb(0,104,80)]">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-3">Why Choose Me?</h2>
        <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto">
          Here’s what I offer to help you succeed in your real estate journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto ">
        {[ 
          {
            icon: <FaChalkboardTeacher className="text-4xl text-yellow-400" />,
            title: 'Expert Real Estate Mentorship',
            desc: 'Receive personalized mentorship tailored to your goals.',
          },
          {
            icon: <FaSearch className="text-4xl text-yellow-400" />,
            title: 'Comprehensive Investment Courses',
            desc: 'Access real estate investment courses from basics to advanced strategies.',
          },
          {
            icon: <FaDollarSign className="text-4xl text-yellow-400" />,
            title: 'Market Insights & Trends',
            desc: 'Stay up-to-date with the latest real estate market trends.',
          },
          {
            icon: <FaRegHandshake className="text-4xl text-yellow-400" />,
            title: 'Property Financing Guidance',
            desc: 'Learn about various property financing options.',
          },
          {
            icon: <FaUsers className="text-4xl text-yellow-400" />,
            title: 'Real Estate Networking',
            desc: 'Get access to a network of industry professionals, including brokers.',
          },
          {
            icon: <FaFileAlt className="text-4xl text-yellow-400" />,
            title: 'Hands-On Experience',
            desc: 'Gain practical knowledge through case studies and live projects.',
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center  hover:bg-opacity-100"
          >
            <div className="flex justify-center mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
            <p className="text-base text-gray-600">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Button to navigate to Contact Us */}
      <div className="text-center mt-12">
        <Link
          to='/contact'
          className="inline-block bg-yellow-400 text-white font-semibold px-8 py-5 rounded-full shadow hover:bg-yellow-500 transition duration-300"
        >
          Connect With Me
        </Link>
      </div>
    </section>
  );
};

export default WhyChooseMe;

