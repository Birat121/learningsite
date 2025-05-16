import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, authToken, logout } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // DEBUG tag for structured logs
  const DEBUG_TAG = "[CheckoutPage]";

  // Fetch course details on mount
  useEffect(() => {
    const fetchCourse = async () => {
      console.log(`${DEBUG_TAG} Fetching course details for slug: "${slug}"`);
      try {
        const res = await axiosInstance.get(`/courses/course/slug/${slug}`);
        console.log(`${DEBUG_TAG} Course fetch success:`, res.data);
        setCourse(res.data);
      } catch (error) {
        console.error(`${DEBUG_TAG} Course fetch failed:`, error?.response?.data || error.message);
        toast.error("Failed to fetch course details");
        navigate("/");
      } finally {
        setLoading(false);
        console.log(`${DEBUG_TAG} Course fetch completed (loading=false)`);
      }
    };

    fetchCourse();
  }, [slug, navigate]);

  // Handle payment
  const handlePayment = async () => {
    if (!course || !user) {
      console.warn(`${DEBUG_TAG} Payment blocked: Missing course or user`);
      return;
    }

    console.log(`${DEBUG_TAG} Starting payment for: ${course.title}`);
    setPaying(true);

    try {
      const payload = {
        courseId: course._id,
        email: user?.email,
      };

      console.log(`${DEBUG_TAG} Sending payment initiation request:`, payload);
      const res = await axiosInstance.post("/payment/initiate", payload);

      if (res.data?.paymentUrl) {
        console.log(`${DEBUG_TAG} Payment URL received: ${res.data.paymentUrl}`);
        window.location.href = res.data.paymentUrl;
      } else {
        console.error(`${DEBUG_TAG} Payment URL not found in response:`, res.data);
        toast.error("Payment URL not found.");
      }
    } catch (err) {
      console.error(`${DEBUG_TAG} Payment initiation failed:`, err?.response?.data || err.message);
      toast.error("Payment initiation failed.");
    } finally {
      setPaying(false);
      console.log(`${DEBUG_TAG} Payment process ended (paying=false)`);
    }
  };

  // Conditional UI
  if (loading) {
    console.log(`${DEBUG_TAG} UI: Loading course data...`);
    return <div className="pt-24 text-center text-lg">Loading checkout…</div>;
  }

  if (!course) {
    console.warn(`${DEBUG_TAG} UI: No course data available.`);
    return (
      <div className="pt-24 text-center text-red-500 text-lg">
        Course not found.
      </div>
    );
  }

  console.log(`${DEBUG_TAG} UI Render: Checkout ready for course "${course.title}"`);

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
              <strong>Price:</strong> AED {course.price?.toFixed(2)}
            </p>
            <p className="text-gray-600">
              {course.description?.substring(0, 150)}...
            </p>
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
