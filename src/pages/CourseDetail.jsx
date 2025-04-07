import React from "react";
import { useParams } from "react-router-dom";
import dummyCourses from "../data/dummyCourse"; // Import your dummy courses from a file or prop

const CourseDetails = () => {
  const { id } = useParams();
  const course = dummyCourses.find((c) => c.id === parseInt(id));

  const isPurchased = course.price === 0; // simulate purchase state

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <img src={course.image} alt={course.title} className="w-full h-72 object-cover rounded-lg shadow" />
      <h1 className="text-3xl font-bold mt-6">{course.title}</h1>
      <p className="text-gray-500 mt-2">By {course.author}</p>

      <p className="mt-4 text-lg text-gray-700">
        This is a detailed description of the course. You'll learn how to invest, manage, and grow your real estate portfolio effectively.
      </p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">What you'll learn</h2>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Understanding real estate basics</li>
          <li>Managing rental properties</li>
          <li>Calculating ROI on property investment</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Course Preview</h2>
        {isPurchased ? (
          <video controls className="w-full rounded-lg shadow">
            <source src="/videos/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="bg-gray-100 p-6 rounded text-center">
            <p className="text-gray-600 mb-4">Please purchase this course to view the full video content.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Purchase Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
