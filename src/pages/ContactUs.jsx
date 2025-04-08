import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <section className="pt-24 pb-12 px-6 mt-20 bg-white text-gray-800 mb-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top: Header and Contact Info */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-4">Let’s Connect</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Have questions or want to learn more? Reach out through the form or contact us directly — we're here to help.
          </p>

          
        </div>

        {/* Bottom: Form + Map Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Contact Form */}
          <form className="bg-gray-50 p-6 rounded-xl shadow-md space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  placeholder="First"
                  className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  placeholder="Last"
                  className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
              <input
                type="text"
                placeholder="xxx-xxx-xxxx"
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="4"
                placeholder="Type your message ..."
                className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md resize-none focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[rgb(0,104,80)] text-white font-semibold px-6 py-2 rounded-full text-base transition-all duration-300"
            >
              Submit
            </button>
          </form>

          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-md h-full min-h-[400px]">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.9989691834187!2d-75.38971302417528!3d39.91725088901005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6e9dcb67cf81d%3A0x419f9c8a0554fd2b!2s15%20W%203rd%20St%2C%20Media%2C%20PA%2019063%2C%20USA!5e0!3m2!1sen!2snp!4v1712471428721!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
