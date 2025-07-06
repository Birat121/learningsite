import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ConsultationFormModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    investmentInterest: "",
    investmentAmount: "",
    preferredTime: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // disable button

    try {
      await emailjs.send(
        "service_o2fqnnj",
        "template_eo2ox46",
        {
          full_name: formData.fullName,
          user_email: formData.email,
          phone: formData.phone,
          investment_interest: formData.investmentInterest,
          investment_amount: formData.investmentAmount,
          preferred_time: formData.preferredTime,
        },
        "ofUAIyX7aUVuSeYsO"
      );

      await emailjs.send(
        "service_o2fqnnj",
        "template_hvxw41z",
        {
          full_name: formData.fullName,
          user_email: formData.email,
        },
        "ofUAIyX7aUVuSeYsO"
      );

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          investmentInterest: "",
          investmentAmount: "",
          preferredTime: "",
        });
        setLoading(false);
        onClose(); // close modal
      }, 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Something went wrong. Please try again later.");
      setLoading(false); // enable button again
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-xl max-w-lg w-full mx-auto overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Book Your Free Consultation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600">
                Your Free Consultation Request Has Been Received. I'll be in
                touch within 24 business hours to confirm your details and
                schedule your personalized session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number (with country code) *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+971501234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="investmentInterest"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Primary Investment Interest *
                  </label>
                  <select
                    id="investmentInterest"
                    name="investmentInterest"
                    required
                    value={formData.investmentInterest}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select an option</option>
                    <option value="Investment">Investment</option>
                    <option value="Relocation">Relocation</option>
                    <option value="Holiday Home">Holiday Home</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="investmentAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Approximate Investment Amount (AED) *
                  </label>
                  <select
                    id="investmentAmount"
                    name="investmentAmount"
                    required
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select an option</option>
                    <option value="1m-2m">1m - 2m</option>
                    <option value="3m-5m">3m - 5m</option>
                    <option value="6m+">6m+</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="preferredTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Preferred Time for Call *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    required
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select an option</option>
                    <option value="Weekday AM">Weekday AM</option>
                    <option value="Weekday PM">Weekday PM</option>
                    <option value="Weekend AM">Weekend AM</option>
                    <option value="Weekend PM">Weekend PM</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-4">
                  By submitting, you agree to our{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationFormModal;
