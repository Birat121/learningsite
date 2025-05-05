import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
  const { slug } = useParams(); // Get course slug from URL
  const navigate = useNavigate(); // Navigate to other pages
  const { user, authToken, logout } = useAuth(); // Get user data and token from context
  const [course, setCourse] = useState(null); // Store course details
  const [loading, setLoading] = useState(true); // Loading state
  const [paying, setPaying] = useState(false); // Payment processing state

  // Fetch course details when the component mounts
  useEffect(() => {
    console.log("useEffect triggered - fetching course details");
    const fetchCourse = async () => {
      try {
        console.log("Making API request to fetch course details for slug:", slug);
        const res = await axiosInstance.get(`/videos/videos/slug/${slug}`);
        console.log("Course details fetched:", res.data);
        setCourse(res.data); // Set course details
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Failed to fetch course details");
        navigate("/"); // Navigate to homepage if course not found
      } finally {
        console.log("Setting loading state to false");
        setLoading(false); // Set loading state to false
      }
    };

    fetchCourse();
  }, [slug, navigate]);

  // Handle payment initiation
  const handlePayment = async () => {
    if (!course || !user) {
      console.warn("No course or user data available. Payment cannot proceed.");
      return; // Ensure course and user exist before proceeding
    }

    console.log("Payment initiation started for course:", course.title);
    setPaying(true); // Set paying state to true

    try {
      console.log("Sending payment request with videoId:", course._id, "and email:", user.email);
      const res = await axiosInstance.post("/payment/initiate", {
        videoId: course._id,
        email: user.email, // Pass the user's email for payment processing
      });
      console.log("Payment initiation response:", res.data);

      // If payment URL is returned, redirect the user to the payment gateway
      if (res.data.paymentUrl) {
        console.log("Redirecting to payment gateway with URL:", res.data.paymentUrl);
        window.location.href = res.data.paymentUrl;
      } else {
        console.error("Payment URL not found in response:", res.data);
        toast.error("Payment URL not found.");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      toast.error("Payment initiation failed.");
    } finally {
      console.log("Payment processing complete. Resetting 'paying' state.");
      setPaying(false); // Reset paying state
    }
  };

  if (loading) {
    console.log("Loading course data, returning loading state...");
    return <div className="pt-24 text-center text-lg">Loading checkout…</div>;
  }

  if (!course) {
    console.warn("Course data not available, displaying error message.");
    return (
      <div className="pt-24 text-center text-red-500 text-lg">
        Course not found.
      </div>
    );
  }

  console.log("Rendering checkout page for course:", course.title);

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto mt-18 mb-26">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={course.thumbnailUrl || "/default-thumbnail.jpg"}
            alt={course.title}
            className="w-full h-64 object-cover rounded-xl shadow"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Checkout</h1>
            <p className="mb-3 text-gray-700 text-lg">
              <strong>Course:</strong> {course.title}
            </p>
            <p className="mb-3 text-gray-700 text-lg">
              <strong>Price:</strong> AED {course.price.toFixed(2)}
            </p>
            <p className="text-gray-600">{course.description?.substring(0, 150)}...</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={paying}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            aria-label="Proceed with payment for course"
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
