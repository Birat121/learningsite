import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/about/get")
      .then((res) => {
        setAboutData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load About page content.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold animate-pulse text-gray-700">
          Loading About Page...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{aboutData.title}</title>
        <meta name="description" content={aboutData.description} />
        <link
          rel="canonical"
          href="https://realstatelearning3.netlify.app/about"
        />
      </Helmet>

      <section className="bg-gray-100 py-20 px-6 md:px-24 mt-20">
        <div className="max-w-7xl mx-auto space-y-24">
          {aboutData.sections.map((section, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`flex flex-col ${
                section.reverseLayout ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-10 md:gap-16`}
            >
              <img
                src={section.imageUrl}
                alt={section.heading}
                className="w-full max-w-md rounded-xl shadow-lg object-cover"
              />
              <div className="text-left space-y-4 max-w-xl">
                <h3 className="text-2xl font-semibold text-green-900">
                  {section.heading}
                </h3>
                {section.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-lg text-gray-700 leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;



