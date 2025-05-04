import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/videos/videos/slug/${slug}`);
        setCourse(res.data);
      } catch (error) {
        toast.error("Failed to fetch course details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, navigate]);

  const handlePayment = async () => {
    if (!course) return;
    setPaying(true);
    try {
      const res = await axiosInstance.post("/payment/initiate", {
        videoId: course._id, // ✅ Key updated to match backend
      });

      window.location.href = res.data.paymentUrl; // ✅ Key aligned with backend response
    } catch (err) {
      toast.error("Payment initiation failed.");
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  if (loading)
    return <div className="pt-24 text-center text-lg">Loading checkout…</div>;

  if (!course)
    return (
      <div className="pt-24 text-center text-red-500 text-lg">
        Course not found.
      </div>
    );

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto mt-14 mb-14">
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
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
