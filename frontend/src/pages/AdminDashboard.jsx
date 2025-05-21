import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Plus, List, LogOut, Menu, X } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const AdminPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === `/admin/dashboard/${path}`;

  const handleLogout = async () => {
  const toastId = toast.loading("Logging out... Please wait");

  try {
    await axiosInstance.post("/auth/admin/logout", {}, { withCredentials: true });
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  } catch (error) {
    toast.error("Logout failed. Please try again.");
  } finally {
    toast.dismiss(toastId);
  }
};

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navLinks = [
    { to: "add", icon: <Plus size={20} />, label: "Add Course" },
    { to: "list", icon: <List size={20} />, label: "List Courses" },
    { to: "quiz", icon: <Plus size={20} />, label: "Add Quiz" },
    { to: "listquiz", icon: <List size={20} />, label: "Quiz List" },
    { to: "addblog", icon: <Plus size={20} />, label: "Add Blog" },
    { to: "listblog", icon: <List size={20} />, label: "List Blogs" },
    { to: "heroeditor", icon: <List size={20} />, label: "Hero Editor" },
    { to: "introeditor", icon: <List size={20} />, label: "Intro Editor" },
    { to: "youtubeadd", icon: <List size={20} />, label: "Youtube Add" },
  ];

  const renderLinks = (onClick) =>
    navLinks.map(({ to, icon, label }) => (
      <Link
        key={to}
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
          isActive(to) ? "bg-green-800" : "hover:bg-green-600"
        }`}
      >
        {icon}
        {label}
      </Link>
    ));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Topbar */}
      <div className="flex items-center justify-between bg-[rgb(0,104,80)] text-white p-4 md:hidden">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button onClick={toggleSidebar}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[rgb(0,104,80)] text-white z-50 flex flex-col p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <button onClick={toggleSidebar}>
              <X size={28} />
            </button>
          </div>
          <nav className="flex flex-col gap-4 text-lg">{renderLinks(() => setSidebarOpen(false))}</nav>
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 mt-6"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="bg-[rgb(0,104,80)] text-white w-64 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-10 text-center">Dashboard</h2>
          <nav className="space-y-4">{renderLinks()}</nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-md text-lg bg-red-600 hover:bg-red-700 transition duration-200 mt-4"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto mt-4 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Welcome to the Admin Panel
        </h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
