import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  FaBuilding,
  FaDollarSign,
  FaHandshake,
  FaGlobe,
  FaCity,
} from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

// Utility to clean HTML and truncate
const stripHtmlAndTruncate = (html, maxLength = 150) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const reasons = [
  {
    icon: <FaBuilding className="text-3xl sm:text-4xl text-white" />,
    title: "World-Class Infrastructure",
    description:
      "Dubai offers state-of-the-art buildings, luxurious properties, and modern amenities. The city is home to some of the world’s tallest and most iconic structures.",
  },
  {
    icon: <FaDollarSign className="text-3xl sm:text-4xl text-white" />,
    title: "High ROI and Investment Potential",
    description:
      "With growing demand for rental properties and high capital appreciation, Dubai promises excellent returns on investment, making it a top choice for investors.",
  },
  {
    icon: <FaHandshake className="text-3xl sm:text-4xl text-white" />,
    title: "Easy and Secure Property Ownership",
    description:
      "Dubai offers clear property laws and guarantees foreign investors can own freehold property in designated areas, with a transparent legal system.",
  },
  {
    icon: <FaGlobe className="text-3xl sm:text-4xl text-white" />,
    title: "Global Business Hub",
    description:
      "Dubai is a leading global business hub, connecting investors and entrepreneurs from all over the world, offering tax-free zones and a dynamic economy.",
  },
  {
    icon: <FaCity className="text-3xl sm:text-4xl text-white" />,
    title: "Lifestyle and Luxury Living",
    description:
      "Dubai is a city of luxury and comfort, offering world-class shopping, fine dining, beachfront resorts, and vibrant nightlife, all alongside scenic views.",
  },
  {
    icon: <FaDollarSign className="text-3xl sm:text-4xl text-white" />,
    title: "Golden Visa",
    description:
      "Enjoy long-term residency in the UAE, usually for 5 or 10 years, thanks to the Golden Visa. This visa streamlines the employment process by allowing holders to work without needing a separate work permit or employment contract.",
  },
];

const ReasonsToChooseDubaiRealEstate = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get("/blogs/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 md:px-20 mt-18">
      <Helmet>
        <title>Why Invest in Dubai Real Estate? | Koffee With Kirren</title>
        <meta
          name="description"
          content="Discover the top reasons to invest in Dubai's booming real estate market. Explore infrastructure, ROI, safety, Golden Visa, and more."
        />
        <link rel="canonical" href="https://yourdomain.com/why-dubai-real-estate" />
      </Helmet>

      <div className="max-w-6xl mx-auto text-center space-y-12 sm:space-y-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[rgb(0,104,80)]">
          Why Choose Dubai Real Estate?
        </h1>
        <p className="text-base sm:text-lg text-black max-w-3xl mx-auto">
          Dubai, often visualized as a city of dazzling skyscrapers and opulent living, offers more than just glamour. It presents a robust and lucrative investment landscape, particularly attractive to international investors. Here are some reasons why Dubai is a prime location for wealth creation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-md sm:shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-green-600 to-blue-500 p-4 rounded-full mb-5 flex justify-center items-center w-20 h-20 mx-auto">
                {reason.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Investment Advantages Section */}
        <div className="mt-12 text-left space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(0,104,80)]">
            Dubai's Investment Advantages:
          </h2>

          <p>
            Several key factors distinguish Dubai as an exceptional investment destination:
          </p>

          <p className="text-sm sm:text-base text-gray-600">
            <strong>Resilient Economic Foundation:</strong> Dubai's economy thrives on a diversified base of tourism, real estate, and international trade. Its strategic geographical position, world-class infrastructure, and pro-business government policies foster a stable environment conducive to long-term investment success.
          </p>

          <p className="text-sm sm:text-base text-gray-600">
            <strong>Potential for High Returns:</strong> Dubai's real estate market consistently delivers competitive ROI. Whether your focus is residential, commercial, or hospitality properties, Dubai offers options with substantial potential for both capital appreciation and rental income.
          </p>

          <p className="text-sm sm:text-base text-gray-600">
            <strong>Secure and Stable Environment:</strong> Safety and security are paramount in Dubai. The city boasts low crime rates, a politically stable climate, and a strong legal framework that protects investor interests.
          </p>

          <p className="text-sm sm:text-base text-gray-600">
            <strong>Supportive Regulatory Landscape:</strong> The Dubai government actively encourages foreign investment through tax benefits, simplified processes, and investor-friendly laws.
          </p>

          <p className="text-sm sm:text-base text-gray-600 mt-6">
            Success in Dubai’s real estate market comes from informed decisions and trustworthy partnerships. Transparency and strong governance make this market highly attractive.
          </p>

          <p className="text-sm sm:text-base text-gray-600 mt-4">
            Whether you're an investor seeking long-term gains or exploring a luxurious lifestyle, Dubai offers unmatched real estate opportunities.
          </p>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => (window.location.href = "/contact")}
            className="bg-[rgb(0,104,80)] text-white font-semibold px-8 py-4 rounded-full hover:bg-[rgb(0,82,60)] transition"
          >
            Get Your Free Consultation
          </button>
        </div>

        {/* Blog Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(0,104,80)]">
            Latest Blogs
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Stay up-to-date with the latest trends and insights in Dubai’s real estate market.
          </p>

          {loadingBlogs ? (
            <p className="mt-6 text-gray-500">Loading blogs...</p>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mt-8">
              {blogs.map((blog, index) => (
                <div
                  key={index}
                  className="bg-white p-6 sm:p-8 rounded-xl shadow-md sm:shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                    {blog.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {stripHtmlAndTruncate(blog.description)}
                  </p>
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="text-[rgb(0,104,80)] font-semibold hover:text-[rgb(0,82,60)]"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-500">
              No blog posts available at the moment. Please check back later.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReasonsToChooseDubaiRealEstate;


