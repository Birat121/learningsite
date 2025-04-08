import React, { useState } from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <Link to={`/course/${course.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-all duration-300">
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className={`w-full h-full object-cover transition duration-500 ease-in-out ${
              isImageLoading ? "blur-sm scale-105" : "blur-0 scale-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
            loading="lazy"
          />
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          )}
        </div>

        <div className="flex flex-col justify-between flex-grow p-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500">{course.author}</p>
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {course.title}
            </h3>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{course.students} students</span>
            <span
              className={
                course.price === 0
                  ? "text-green-600 font-medium"
                  : "text-red-500 font-semibold"
              }
            >
              {course.price === 0 ? "Free" : `Rs. ${course.price}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
