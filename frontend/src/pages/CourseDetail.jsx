import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/authContext";

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <img
        src={course.thumbnailUrl || "/default-course.jpg"}
        alt={course.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <p className="text-gray-700 mb-6">{course.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">Price: AED {course.price}</span>
        {hasCourseAccess(slug) ? (
          <button
            onClick={handleGoToCourseClick}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Go to Course
          </button>
        ) : (
          <button
            onClick={handleBuyNowClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
