import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const EnrolledCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/videos/enrolled", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enrolledCourses = Array.isArray(response.data.courses)
          ? response.data.courses
          : [];
        setCourses(enrolledCourses);
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 mt-26">
      <div className="py-12 px-4 sm:px-10 bg-white shadow-md">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
          Your Enrolled Courses
        </h1>
        <p className="text-center text-gray-600 text-sm">
          Access your purchased real estate training programs below.
        </p>
      </div>

      <div className="px-4 sm:px-10 py-12">
        {courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You have not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => navigate(`/courses/${course.slug || course._id}`)}
                className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    {course.description?.substring(0, 100)}...
                  </p>
                  <p className="text-green-600 mt-3 font-medium">View Course</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;
