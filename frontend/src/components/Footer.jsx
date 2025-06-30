import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[rgb(0,104,80)] text-gray-200 py-6 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-6 text-base sm:text-lg">
        {/* Contact Info */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base">
            📧{" "}
            <a
              href="mailto:sales@koffeewithkirren.com"
              className="text-yellow-400 hover:underline"
            >
              sales@koffeewithkirren.com
            </a>{" "}
            | 📞{" "}
            <a
              href="tell:+971555547963"
              className="text-yellow-400 hover:underline"
            >
              +971555547963
            </a>
          </p>
          <p className="text-sm sm:text-base">
            📍 DSO-IFZA, Dubai Silicon Oasis, Dubai
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 text-xl sm:text-2xl">
          <a
            href="https://www.linkedin.com/company/koffee-with-kirren/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://www.youtube.com/@KoffeewithKirren"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.instagram.com/koffeewithkirren?igsh=M3c1NG5jbzlwanZ3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@koffeewithkirren?_t=ZN-8vagd7GohCp&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition"
          >
            <FaTiktok />
          </a>
          <a
            href="https://www.facebook.com/share/18c2MMRyJR/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://wa.me/971555547963"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition"
          >
            <FaWhatsapp />
          </a>
        </div>
        {/* Copyright */}
        <div>
          <Link
            to="/privacy-policy"
            className="underline hover:text-gray-100 text-sm "
          >
            Privacy Policy
          </Link>
        </div>
        <div className="text-xs sm:text-sm text-gray-300">
          &copy; {new Date().getFullYear()} Koffee With Kirren. All rights
          reserved.{" "}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
