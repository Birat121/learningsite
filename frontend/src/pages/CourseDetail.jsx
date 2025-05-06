import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, authToken, hasCourseAccess } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/videos/videos/slug/${slug}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const handleBuyNowClick = () => {
    if (!user || !authToken) {
      toast.error("Please log in to purchase this course.");
      navigate("/login");
      return;
    }

    navigate(`/checkout/${slug}`);
  };

  const handleGoToCourseClick = () => {
    navigate(`/watch/${slug}`);
  };

   if (loading) return <div className="text-center py-10">Loading...</div>;
if (!course) return <div className="text-center py-10">Course not found</div>;

const outcomes = Array.isArray(course.courseOutcome) ? course.courseOutcome : [];


  return (
    <div className="max-w-6xl mx-auto px-4 py-20 mt-18 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Section: Text */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-700 mb-6">{course.description}</p>
          {outcomes.length > 0 && (
  <div className="bg-gray-100 p-4 rounded">
    <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
    <ul className="list-disc list-inside text-gray-600">
      {outcomes.map((o, idx) => (
        <li key={idx}>{o}</li>
      ))}
    </ul>
  </div>
)}

        </div>

        {/* Right Section: Thumbnail + Buttons */}
        <div className="bg-white shadow p-4 rounded-lg">
          <img
            src={course.thumbnailUrl || "/default-course.jpg"}
            alt={course.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
          <div className="text-xl font-semibold mb-4">Price: AED {course.price}</div>
          {hasCourseAccess(slug) ? (
            <button
              onClick={handleGoToCourseClick}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Go to Course
            </button>
          ) : (
            <button
              onClick={handleBuyNowClick}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

