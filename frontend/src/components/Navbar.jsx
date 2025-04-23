import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoLight from "../assets/darklogo.webp";
import logoDark from "../assets/white logo.webp";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const dropdownRef = useRef(null);

  const { authToken, logout, user } = useAuth();

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
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isScrolled = scrollY > 50;
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const links = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT US" },
    { to: "/courses", label: "COURSES" },
    { to: "/why-dubai", label: "WHY US?" },
    { to: "/contact", label: "CONTACT US" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };
  

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
        <NavLink
          to="/"
          className="hover:opacity-80 transition-opacity duration-300"
        >
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

        {/* User/Profile Section */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          {authToken ? (
            <div
              className="cursor-pointer flex items-center space-x-3 relative"
              onClick={toggleDropdown}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold uppercase">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>

              {/* User Name */}
              <span
                className={`${
                  isScrolled ? "text-black" : "text-white"
                } font-medium`}
              >
                {user?.name || "User"}
              </span>

              {/* Dropdown */}
              <div
                className={`absolute top-full right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border z-50 transition-all duration-200 ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "User Name"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <ul className="p-2 space-y-1">
                  <li
                    className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    🧑‍💼 Profile
                  </li>
                  <li
                    className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/enrolledCourse");
                    }}
                  >
                    📚 Courses
                  </li>
                  <li
                    className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className={`px-6 py-2 rounded-md font-semibold transition-colors duration-300 ${
                isScrolled
                  ? "bg-[rgb(0,104,80)] text-white hover:bg-[rgb(0,85,65)]"
                  : "bg-white text-black"
              }`}
            >
              Login
            </button>
          )}
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

          {/* Mobile Auth Buttons */}
          {authToken ? (
            <div className="mt-6 w-4/5 space-y-2">
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/profile");
                }}
                className="w-full px-6 py-2 rounded-md bg-[rgb(0,104,80)] text-white font-semibold hover:bg-[rgb(0,85,65)] transition-colors duration-300"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                  toast.success("Logged out successfully!");
                  navigate("/");
                }}
                
                className="w-full px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-6 w-4/5">
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/");
                }}
                className="w-full px-6 py-2 rounded-md bg-[rgb(0,104,80)] text-white font-semibold hover:bg-[rgb(0,85,65)] transition-colors duration-300"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
