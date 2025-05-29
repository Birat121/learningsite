import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    const form = formRef.current;
    const formData = new FormData(form);

    const autoReplyParams = {
      first_name: formData.get("first_name"),
      user_email: formData.get("user_email"),
      message: formData.get("message"),
    };

    try {
      // Send main email
      await emailjs.sendForm(
        "service_wtby1jd",
        "template_vy6yi94",
        form,
        "ofUAIyX7aUVuSeYsO"
      );

      // Send auto-reply
      await emailjs.send(
        "service_jx2m2lv",
        "template_nvvvrf4",
        autoReplyParams,
        "ofUAIyX7aUVuSeYsO"
      );

      setSuccess("Message sent successfully!");
      form.reset();
    } catch (err) {
      console.error("Email send error:", err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);

      // Auto clear success/error messages after 5 seconds
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Contact - Free Real Estate Consultation | Koffee With Kirren
        </title>
        <meta
          name="description"
          content="Book your free consultation with Kirren and explore real estate opportunities in Dubai. Let's start your property journey together."
        />
        <link
          rel="canonical"
          href="https://koffeewithkirren.com/contact"
        />
      </Helmet>

      <section className="pt-24 pb-12 px-6 mt-20 bg-white text-gray-800 mb-4 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-900 mb-4">
              Get Your Free Consultation
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Ready to discover the best real estate opportunities in Dubai? I
              invite you to take the first step by requesting a free
              consultation with me. Whether you are looking to invest, buy, or
              simply learn more about the dynamic real estate market in Dubai,
              I’m here to guide you every step of the way.
            </p>
          </div>

          <div className="flex justify-center">
            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="bg-gray-50 p-8 rounded-xl shadow-md space-y-5 w-full sm:w-[600px]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    placeholder="First"
                    className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    placeholder="Last"
                    className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  placeholder="example@email.com"
                  className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone (including country code)
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+971-555-555555"
                  pattern="^\+\d{1,4}[-\s]?\d{6,14}$"
                  title="Please include your country code (e.g., +971-555-555555)"
                  className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  placeholder="Type your message ..."
                  className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-md resize-none focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Query Type
                </label>
                <select
                  name="query_type"
                  className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                >
                  <option value="consultation">Consultation</option>
                  <option value="course">Course</option>
                </select>
              </div>

              {success && <p className="text-green-600">{success}</p>}
              {error && <p className="text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`bg-[rgb(0,104,80)] text-white font-semibold px-6 py-3 rounded-full text-base transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
