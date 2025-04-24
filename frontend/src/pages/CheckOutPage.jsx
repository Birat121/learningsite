import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { FaCcVisa, FaCcPaypal, FaMobileAlt, FaMoneyCheckAlt } from "react-icons/fa";

const CheckoutPage = () => {
  const { id, slug } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("paypal");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/videos/videos/${slug}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleCheckout = () => {
    alert(`Payment method '${selectedPayment}' selected. Integration coming soon.`);
  };

  if (!course)
    return (
      <div className="pt-28 flex justify-center text-gray-500 text-lg">
        Loading course details...
      </div>
    );

  return (
    <div className="pt-28 px-4 sm:px-10 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
        {/* Left: Billing Section */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-green-700">Checkout & Payment</h2>

          <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <PaymentOption
              method="card"
              selected={selectedPayment}
              icon={<FaCcVisa size={28} />}
              label="Card"
              onClick={() => setSelectedPayment("card")}
            />
            <PaymentOption
              method="paypal"
              selected={selectedPayment}
              icon={<FaCcPaypal size={28} />}
              label="PayPal"
              onClick={() => setSelectedPayment("paypal")}
            />
            <PaymentOption
              method="esewa"
              selected={selectedPayment}
              icon={<FaMobileAlt size={28} />}
              label="eSewa"
              onClick={() => setSelectedPayment("esewa")}
            />
            <PaymentOption
              method="khalti"
              selected={selectedPayment}
              icon={<FaMoneyCheckAlt size={28} />}
              label="Khalti"
              onClick={() => setSelectedPayment("khalti")}
            />
          </div>

          {/* Temporary Button Until Payment Integration */}
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl text-lg transition-all"
          >
            Proceed to Pay
          </button>
        </div>

        {/* Right: Course Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-48 w-full object-cover rounded-xl mb-5"
          />
          <h3 className="text-2xl font-semibold text-gray-800">{course.title}</h3>
          <p className="text-gray-600 mt-2 text-sm line-clamp-4">{course.description}</p>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-lg text-gray-500 font-medium">Total Price</span>
            <span className="text-2xl text-green-700 font-bold">${course.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentOption = ({ method, selected, onClick, icon, label }) => {
  const isActive = selected === method;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${
        isActive
          ? "border-green-600 bg-green-100 text-green-700"
          : "border-gray-300 text-gray-700 hover:border-green-400"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default CheckoutPage;

