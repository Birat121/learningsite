import React from 'react';
import { FaBuilding, FaDollarSign, FaHandshake, FaGlobe, FaCity } from 'react-icons/fa';

const reasons = [
  {
    icon: <FaBuilding className="text-4xl text-white" />,
    title: 'World-Class Infrastructure',
    description: 'Dubai offers state-of-the-art buildings, luxurious properties, and modern amenities. The city is home to some of the world’s tallest and most iconic structures.',
  },
  {
    icon: <FaDollarSign className="text-4xl text-white" />,
    title: 'High ROI and Investment Potential',
    description: 'With growing demand for rental properties and high capital appreciation, Dubai promises excellent returns on investment, making it a top choice for investors.',
  },
  {
    icon: <FaHandshake className="text-4xl text-white" />,
    title: 'Easy and Secure Property Ownership',
    description: 'Dubai offers clear property laws and guarantees foreign investors can own freehold property in designated areas, with a transparent legal system.',
  },
  {
    icon: <FaGlobe className="text-4xl text-white" />,
    title: 'Global Business Hub',
    description: 'Dubai is a leading global business hub, connecting investors and entrepreneurs from all over the world, offering tax-free zones and a dynamic economy.',
  },
  {
    icon: <FaCity className="text-4xl text-white" />,
    title: 'Lifestyle and Luxury Living',
    description: 'Dubai is a city of luxury and comfort, offering world-class shopping, fine dining, beachfront resorts, and vibrant nightlife, all alongside scenic views.',
  },
];

const ReasonsToChooseDubaiRealEstate = () => {
  return (
    <section className=" py-20 px-6 md:px-20 mt-14">
      <div className="max-w-6xl mx-auto text-center space-y-16">
        <h2 className="text-4xl sm:text-5xl  text-[rgb(0,104,80)] mb-4">
          Why Choose Dubai Real Estate?
        </h2>
        <p className="text-lg text-black mb-10 max-w-3xl mx-auto">
          Dubai has become one of the world’s most lucrative real estate markets. Here's why investing in Dubai's real estate is a smart decision.
        </p>

        {/* Reasons Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
              {/* Icon with background */}
              <div className="bg-gradient-to-r from-green-600 to-blue-500 p-4 rounded-full mb-6 flex justify-center items-center w-20 h-20 mx-auto">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-[rgb(0,104,80)] text-white text-lg sm:text-xl font-semibold px-8 py-4 rounded-full transition duration-300 hover:bg-[rgb(0,82,60)]"
          >
            Get in Touch for Investment Opportunities
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReasonsToChooseDubaiRealEstate;
