import React from 'react';
import {
  Home,
  LineChart,
  Layers3,
  Handshake,
  BadgeCheck,
  Gem,
  Target,
  Users,
} from 'lucide-react';

const About = () => {
  const offerings = [
    {
      icon: <Home className="w-8 h-8 text-green-900" />,
      title: 'Buying & Selling Property',
    },
    {
      icon: <LineChart className="w-8 h-8 text-green-900" />,
      title: 'Real Estate Investment Strategies',
    },
    {
      icon: <Layers3 className="w-8 h-8 text-green-900" />,
      title: 'Off-Plan vs. Ready Property Guide',
    },
    {
      icon: <Handshake className="w-8 h-8 text-green-900" />,
      title: 'Mastering Real Estate Negotiation',
    },
    {
      icon: <BadgeCheck className="w-8 h-8 text-green-900" />,
      title: 'Real Estate Licensing & Career Guide',
    },
  ];

  const values = [
    {
      icon: <Gem className="w-8 h-8 text-green-800" />,
      title: 'Integrity First',
      desc: 'Transparency and honesty in every step of the process.',
    },
    {
      icon: <Target className="w-8 h-8 text-green-800" />,
      title: 'Result-Oriented',
      desc: 'Focused on helping you achieve measurable real estate success.',
    },
    {
      icon: <Users className="w-8 h-8 text-green-800" />,
      title: 'People-Driven',
      desc: 'Your growth and learning are at the heart of everything I do.',
    },
  ];

  return (
    <section className="bg-gray-100 py-32 px-6 mt-12 md:px-24">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Who Am I Section */}
        <div className="text-center">
          <h2 className="text-6xl font-bold text-green-900 mb-6 sm:text-5xl">Who Am I?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hi, I’m Kirren — a real estate mentor, investor, and educator passionate about turning complex property insights into clear, actionable guidance for aspiring professionals.
          </p>
        </div>

        {/* What I Offer */}
        <div>
          <h3 className="text-4xl font-bold text-green-800 text-center mb-12">What I Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {offerings.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-6 bg-white shadow-sm hover:shadow-lg transition-shadow p-6 rounded-lg"
              >
                {item.icon}
                <span className="text-xl text-gray-800 font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Me */}
        <div>
          <h3 className="text-4xl font-bold text-green-800 text-center mb-12">Why Choose Me?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow text-center space-y-4">
                <div className="flex justify-center">{value.icon}</div>
                <h4 className="text-xl font-semibold text-green-900">{value.title}</h4>
                <p className="text-gray-600 text-base">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => alert('Redirecting to contact page or form!')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-xl font-semibold px-10 py-5 rounded-full transition duration-300"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
