import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const EnrolledCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to sanitize and shorten description
  const sanitizeAndShorten = (html, maxLength = 100) => {
    const plainText = html?.replace(/<[^>]+>/g, "") || "";
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/courses/enrolled", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enrolledCourses = Array.isArray(response.data.courses)
          ? response.data.courses
          : [];

        const validCourses = enrolledCourses.filter(
          (course) => course && course._id
        );

        setCourses(validCourses);
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err);
        setCourses([]);
      } finally {
        setLoading(false);
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
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You have not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              if (!course || !course._id) return null;

              return (
                <div
                  key={course._id}
                  onClick={() =>
                    navigate(`/courses/${course.slug || course._id}`)
                  }
                  className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
                >
                  <img
                    src={course.thumbnailUrl || "/placeholder.jpg"}
                    alt={course.title || "Course thumbnail"}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {course.title || "Untitled Course"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      {sanitizeAndShorten(course.description)}
                    </p>
                    <p className="text-green-600 mt-3 font-medium">View Course</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;
