import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[rgb(0,104,80)] text-gray-200 py-6 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-6 text-base">

        {/* Contact Info */}
        <div className="space-y-2">
          <p className="text-lg">
            📧 <a href="mailto:contact@koffee-kirren.com" className="text-yellow-400 hover:underline">contact@koffee-kirren.com</a> |
            📞 <a href="tel:+1234567890" className="text-yellow-400 hover:underline">+1 (234) 567-890</a>
          </p>
          <p className="text-lg">📍 123 Real Estate Lane, Property City, USA</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-yellow-400 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-yellow-400 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-yellow-400 transition"><FaInstagram /></a>
          <a href="#" className="hover:text-yellow-400 transition"><FaLinkedinIn /></a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-300">
          &copy; {new Date().getFullYear()} Koffee With Kirren. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
