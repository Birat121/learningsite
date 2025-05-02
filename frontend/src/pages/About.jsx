import React from "react";
import { Helmet } from 'react-helmet';

const About = () => {

  return (
    <>
      <Helmet>
        {/* Title for the About Page */}
        <title>About Kirren - Real Estate Mentor & Educator</title>

        {/* Meta description for better search engine indexing */}
        <meta
          name="description"
          content="Learn about Kirren, a passionate real estate mentor, educator, and investor. Discover the values and offerings that make this platform stand out in real estate education."
        />

        {/* Meta keywords for additional SEO boost */}
        <meta
          name="keywords"
          content="real estate mentor, real estate education, property buying and selling, real estate strategies"
        />
      </Helmet>

      <section className="bg-gray-100 py-16 px-6 mt-16 md:px-24">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Who Am I Section */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-green-900 mb-6">
              Who Am I?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-4xl mx-auto">
              My deep understanding of the real estate market is the foundation of the value I bring to my clients, both local and international. With over 26 years of experience, I offer comprehensive expertise across all facets of the industry.
            </p>
          </div>

          {/* Professional Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-800">A Diverse Background</h3>
              <p className="text-lg text-gray-700">
                Born and raised in the UK with Punjabi heritage, I bring a unique cultural perspective and a strong work ethic to my profession. My background combines practical experience with a solid academic foundation, enabling me to bridge the gap between theory and real-world practice.
              </p>
              <p className="text-lg text-gray-700">
                I began with a focus on construction and design, which ignited my passion for the built environment. This led to formal studies in those areas, followed by business and finance studies, giving me a robust understanding of the financial drivers within real estate.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-800">Early Career & CeMAP Qualification</h3>
              <p className="text-lg text-gray-700">
                Early in my career, I earned the CeMAP qualification, establishing a solid understanding of mortgage products and financing strategies, which is invaluable when working with international clients navigating different financial systems.
              </p>
              <p className="text-lg text-gray-700">
                Over 16 years, I refined my skills at a UK housing association, gaining invaluable experience in managing the entire sales process, working closely with developers, and leading a sales team. I also achieved professional certifications in marketing, leadership, and property sales.
              </p>
            </div>
          </div>

          {/* Values & Experience */}
          <div className="text-center space-y-6">
            <h3 className="text-3xl sm:text-4xl font-bold text-green-800">
              Formative Experiences & Values
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              One of the most formative experiences of my life was volunteering in Malawi, where I helped build homes for orphans. This experience not only deepened my understanding of the impact safe housing can have on individuals and communities, but it also instilled values of compassion, resilience, and cultural understanding—values that continue to guide my work today.
            </p>
          </div>

          {/* Specialization & Current Focus */}
          <div className="space-y-6">
            <h3 className=" text-center text-2xl sm:text-4xl font-bold text-green-800">
              Specializing in Dubai's Off-Plan Market
            </h3>
            <p className="text-lg text-gray-700">
              I now specialize in the dynamic and competitive off-plan market in Dubai, working extensively with international investors. As a RERA-licensed real estate professional, I provide clients with data-driven market insights, strategic guidance, and an awareness of emerging opportunities. I remain current with market trends and regulatory changes to ensure my clients make well-informed decisions.
            </p>
          </div>

          
          
        </div>
      </section>
    </>
  );
};

export default About;
