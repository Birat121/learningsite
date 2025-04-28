import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
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
        "service_jx2m2lv",
        "template_jygv2as",
        form,
        "A_NTgdITLFkCwT63H"
      );

      // Send auto-reply
      await emailjs.send(
        "service_jx2m2lv",
        "template_nvvvrf4",
        autoReplyParams,
        "A_NTgdITLFkCwT63H"
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
    <section className="pt-24 pb-12 px-6 mt-20 bg-white text-gray-800 mb-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-4">Let’s Connect</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Have questions or want to learn more? Reach out through the form or contact us directly — we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <form
            ref={formRef}
            onSubmit={sendEmail}
            className="bg-gray-50 p-6 rounded-xl shadow-md space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  placeholder="First"
                  className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  placeholder="Last"
                  className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="user_email"
                required
                placeholder="example@email.com"
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
              <input
                type="text"
                name="phone"
                placeholder="xxx-xxx-xxxx"
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Type your message ..."
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md resize-none focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`bg-[rgb(0,104,80)] text-white font-semibold px-6 py-2 rounded-full text-base transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          <div className="relative rounded-xl overflow-hidden shadow-md h-full min-h-[400px]">
            {!mapLoaded && (
              <div className="absolute inset-0 bg-gray-200 blur-md animate-pulse z-10"></div>
            )}
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.2657749782253!2d55.37806847535893!3d25.119035777754404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f637f4c2e7c7f%3A0xd7cf6a4d2c15b6e2!2sDSO-IFZA%2C%20Dubai%20Silicon%20Oasis%2C%20Dubai%2C%20UAE!5e0!3m2!1sen!2snp!4v1714292765793!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              className={`w-full h-full transition-all duration-700 ${mapLoaded ? "blur-0" : "blur-sm"}`}
              onLoad={() => setMapLoaded(true)}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

