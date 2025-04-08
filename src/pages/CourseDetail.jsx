import React from "react";
import { useParams } from "react-router-dom";
import dummyCourses from "../data/dummyCourse";

const CourseDetails = () => {
  const { id } = useParams();
  const course = dummyCourses.find((c) => c.id === parseInt(id));
  const isPurchased = course.price === 0;

  if (!course) {
    return (
      <div className="pt-24 text-center text-xl text-red-600">
        Course not found.
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 pt-24 pb-20">
      {/* Video Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full rounded-xl overflow-hidden shadow-lg">
          {isPurchased ? (
            <video controls className="w-full h-[450px] object-cover">
              <source src="/videos/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-[450px] bg-gray-200 flex items-center justify-center text-center px-6">
              <p className="text-gray-600 text-lg">
                Please purchase this course to access video content.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            {course.title}
          </h1>
          <p className="text-gray-600 text-lg mb-6">By {course.author}</p>

          <p className="text-gray-700 text-base leading-relaxed mb-8">
            This course provides an in-depth understanding of real estate investment strategies,
            portfolio management, and market analysis. You'll explore real-world scenarios, financial
            modeling, and risk assessment to become a confident investor. Whether you're just
            starting or looking to refine your skills, this course is your gateway to mastering real
            estate. From buying and managing properties to calculating returns and scaling your
            investments, every module is designed to empower your journey.
          </p>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              What you'll learn
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-700 text-base">
              <li>Understanding real estate basics</li>
              <li>Managing rental properties</li>
              <li>Calculating ROI on property investment</li>
              <li>Risk assessment and market analysis</li>
              <li>Financial planning and investment scaling</li>
            </ul>
          </div>

          {/* Price & Action Buttons (Bottom of content) */}
          {!isPurchased && (
            <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-3xl font-bold text-gray-900">
                ${course.price.toFixed(2)}
                <span className="text-sm text-gray-500 ml-1">incl. tax</span>
              </div>
              <div className="flex gap-4">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition">
                  Add to Cart
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
