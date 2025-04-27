import React from 'react';
import image from '../assets/photo4.webp';
import { Link } from 'react-router-dom';

const Introduction = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-20 py-16 sm:py-20 bg-white text-gray-800 overflow-hidden">
      {/* Left Side Image */}
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0 relative z-10">
        <img
          src={image}
          alt="Introduction"
          className="w-[85%] sm:w-[80%] md:w-[100%] lg:w-[80%] h-auto object-cover rounded-md"
        />
      </div>

      {/* Right Side Text */}
      <div className="w-full md:w-1/2 relative z-10 flex flex-col justify-center md:pl-12 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[rgb(0,104,80)]">
          HELLO THERE
        </h2>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-gray-700">
          <span className="font-bold">My name</span> Kirren, Your Real Estate Mentor
        </h3>
        <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
          If you’re an aspiring investor, homeowner, or property enthusiast, you’re in the right
          place! With years of experience in the industry, I’ve helped countless individuals
          navigate the complexities of real estate investment, financing, and market trends.
        </p>
        <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 leading-relaxed">
          Through my expert courses, mentorship, and insightful content, you’ll gain the confidence
          to make informed real estate decisions.
        </p>
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-bold">
            Ready to level up your real estate knowledge?
          </p>
          <Link
            to='/contact'
            className="bg-[rgb(0,104,80)] text-white text-sm sm:text-base md:text-lg font-semibold px-5 py-2 sm:px-6 sm:py-3 rounded-md transition duration-300 w-max"
          >
            Book Your Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
