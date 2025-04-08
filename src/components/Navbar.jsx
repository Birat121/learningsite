import React, { useState, useEffect } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // <-- updated here

import logoLight from "../assets/darklogo.webp";
import logoDark from "../assets/white logo.webp";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // <-- added this
  const isHome = location.pathname === "/";

  const controlNavbar = () => {
    const currentScroll = window.scrollY;
    setScrollY(currentScroll);

    if (currentScroll > 150) {
      setShowNavbar(currentScroll < lastScrollY);
    } else {
      setShowNavbar(true);
    }

    setLastScrollY(currentScroll);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isScrolled = scrollY > 50;
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const links = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT US" },
    { to: "/courses", label: "COURSES" },
    { to: "/contact", label: "CONTACT US" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white text-black shadow-md"
          : isHome
          ? "bg-transparent text-white"
          : "bg-[rgb(0,104,80)] text-white"
      } ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="hover:opacity-80 transition-opacity duration-300">
          <img
            src={isScrolled ? logoDark : isHome ? logoLight : logoLight}
            alt="Logo"
            className="h-16 w-auto object-contain"
          />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `relative transition duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] ${
                  isActive
                    ? "after:bg-yellow-400"
                    : "after:bg-transparent hover:after:bg-white/50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Login Button */}
        <div className="relative hidden md:block">
          <button
            onClick={() => navigate("/login")}
            className={`px-6 py-2 rounded-md font-semibold transition-colors duration-300 ${
              isScrolled
                ? "bg-[rgb(0,104,80)] text-white hover:bg-[rgb(0,85,65)]"
                : "bg-white text-black "
            }`}
          >
            Login
          </button>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden z-50 text-yellow-400">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-full h-screen bg-white flex flex-col justify-center items-center text-black font-medium space-y-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `text-lg transition duration-200 ${
                  isActive ? "text-yellow-500" : "hover:text-[rgb(0,104,80)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Login Button */}
          <div className="mt-6 w-4/5">
            <button
              onClick={() => {
                closeMenu();
                navigate("/login");
              }}
              className="w-full px-6 py-2 rounded-md bg-[rgb(0,104,80)] text-white font-semibold hover:bg-[rgb(0,85,65)] transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
