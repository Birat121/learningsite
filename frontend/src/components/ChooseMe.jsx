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
    <section className="py-12 px-4 bg-[rgb(0,104,80)]">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
          Discover My Range of Services
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto">
          I provide the expertise and resources necessary to navigate your real estate dreams effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {[ 
          {
            icon: <FaChalkboardTeacher className="text-3xl sm:text-4xl text-[rgb(0,104,80)]" />,
            title: 'Expert Real Estate Mentorship',
            desc: 'Extensive Real Estate Expertise - over 26 years experience in real estate in UK and Dubai',
          },
          {
            icon: <FaFileAlt className="text-3xl sm:text-4xl text-[rgb(0,104,80)]" />,
            title: 'Dubai Real Estate Guidance',
            desc: 'Learn about various investment options including the buying and leasing process.',
          },
          {
            icon: <FaDollarSign className="text-3xl sm:text-4xl text-[rgb(0,104,80)]" />,
            title: 'Market Insights & Trends',
            desc: 'Stay up-to-date with the latest real estate market trends.',
          },
          {
            icon: <FaRegHandshake className="text-3xl sm:text-4xl text-[rgb(0,104,80)]" />,
            title: 'Property Financing Guidance',
            desc: 'Learn about various property financing options.',
          },
          {
            icon: <FaUsers className="text-3xl sm:text-4xl text-[rgb(0,104,80)]" />,
            title: 'Golden Visa Guidance',
            desc: 'Learn about the criteria and benefits of the golden visa.',
          },
          {
            icon: <FaSearch className="text-3xl sm:text-4xl text-[rgb(0,104,80)]" />,
            title: 'Courses & Training',
            desc: 'Practical Dubai real estate knowledge tailored to new and aspiring agents at foundation level.',
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center hover:bg-opacity-100"
          >
            <div className="flex justify-center mb-3">{card.icon}</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseMe;
