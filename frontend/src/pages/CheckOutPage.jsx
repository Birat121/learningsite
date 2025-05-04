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
      // Simulated Zinna payment initiation (replace with real API)
      const res = await axiosInstance.post("/payments/initiate", {
        courseId: course._id,
        amount: course.price,
      });

      // Redirect to payment gateway or show success
      window.location.href = res.data.paymentUrl; // Simulated response

    } catch (err) {
      toast.error("Payment initiation failed.");
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="pt-24 text-center">Loading checkout…</div>;
  if (!course) return <div className="pt-24 text-center text-red-500">Course not found.</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Checkout</h1>
        <p className="mb-2 text-gray-700"><strong>Course:</strong> {course.title}</p>
        <p className="mb-2 text-gray-700"><strong>Price:</strong> AED {course.price.toFixed(2)}</p>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {paying ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;


