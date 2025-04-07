import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <div className="flex flex-col justify-between flex-grow p-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500">{course.author}</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {course.title}
            </h3>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{course.students} students</span>
            <span className={course.price === 0 ? "text-green-600" : "text-red-500 font-semibold"}>
              {course.price === 0 ? "Free" : `Rs. ${course.price}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
