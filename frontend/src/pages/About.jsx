import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import kirren1 from "../assets/koffe2.jpeg";
import kirren2 from "../assets/koffe1.jpeg";
import kirren3 from "../assets/koffe3.jpeg";
import kirren4 from "../assets/koffe8.jpeg";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Kirren - Real Estate Mentor & Educator</title>
        <meta
          name="description"
          content="Learn about Kirren, a passionate real estate mentor, educator, and investor. Discover the values and offerings that make this platform stand out in real estate education."
        />
        <meta
          name="keywords"
          content="real estate mentor, real estate education, property buying and selling, real estate strategies"
        />
        <link rel="canonical" href="https://koffeewithkirren.netlify.app/about" />
      </Helmet>

      <section className="bg-gray-100 py-20 px-6 md:px-24 mt-20">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Why Choose Me */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-green-900 mb-6">
              Why Choose Me?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              My deep understanding of the real estate market is the foundation of the value I bring to my clients, both local and international. With over 26 years of experience, I offer comprehensive expertise across all facets of the industry.
            </p>
          </motion.div>

          {/* A Diverse Background */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16"
          >
            <img
              src={kirren1}
              alt="UK background and cultural heritage"
              className="w-full max-w-md rounded-xl shadow-lg object-cover"
            />
            <div className="text-left space-y-4 max-w-xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                Born and raised in the UK with Punjabi heritage, I bring a unique cultural perspective and a strong work ethic to my profession. My background combines practical experience with a solid academic foundation, enabling me to bridge the gap between theory and real-world practice.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                I began with a focus on construction and design, which ignited my passion for the built environment. This led to formal studies in those areas, followed by business and finance studies, giving me a robust understanding of the financial drivers within real estate.
              </p>
            </div>
          </motion.div>

          {/* Early Career */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
          >
            <img
              src={kirren2}
              alt="Mortgage and early career"
              className="w-full max-w-md rounded-xl shadow-lg object-cover"
            />
            <div className="text-left space-y-4 max-w-xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                Early in my career, I earned the CeMAP qualification, establishing a solid understanding of mortgage products and financing strategies, which is invaluable when working with international clients navigating different financial systems.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Over 16 years, I refined my skills at a UK housing association, gaining invaluable experience in managing the entire sales process, working closely with developers, and leading a sales team.
              </p>
            </div>
          </motion.div>

          {/* Formative Experiences */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16"
          >
            <img
              src={kirren3}
              alt="Volunteering in Malawi"
              className="w-full max-w-md rounded-xl shadow-lg object-cover"
            />
            <div className="text-left space-y-4 max-w-xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                One of the most formative experiences of my life was volunteering in Malawi, where I helped build homes for orphans. This experience instilled values of compassion, resilience, and cultural understanding—values that continue to guide my work today.
              </p>
            </div>
          </motion.div>

          {/* Specializing in Dubai */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
          >
            <img
              src={kirren4}
              alt="Dubai off-plan property expert"
              className="w-full max-w-md rounded-xl shadow-lg object-cover"
            />
            <div className="text-left space-y-4 max-w-xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                I now specialize in Dubai's off-plan market, working extensively with international investors. As a RERA-licensed professional, I deliver data-driven insights and strategic guidance, helping clients navigate this evolving market with confidence.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;

