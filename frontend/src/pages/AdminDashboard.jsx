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
    await axiosInstance.post(
      "/auth/admin/logout",
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
    toast.success("Logged out successfully!");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Topbar */}
      <div className="flex items-center justify-between bg-[rgb(0,104,80)] text-white p-4 md:hidden">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button onClick={toggleSidebar}>
          <Menu size={28} />
        </button>
      </div>

      {/* Fullscreen Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[rgb(0,104,80)] text-white z-50 flex flex-col p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <button onClick={toggleSidebar}>
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-lg">
            {/* Consistent mobile and desktop links */}
            <Link
              to="add"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("add") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <Plus size={20} />
              Add Course
            </Link>
            <Link
              to="list"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("list") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              List Courses
            </Link>
            <Link
              to="listModules"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("listModules") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              List Modules
            </Link>
            <Link
              to="quiz"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("quiz") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Manage Quizzes
            </Link>
            <Link
              to="addblog"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("add-blog") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <Plus size={20} />
              Add Blog
            </Link>
            <Link
              to="listblog"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("list-blog") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              List Blogs
            </Link>
            <Link
              to="heroeditor"  
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("hero-editor") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Hero Editor
            </Link>
            <Link
              to="introeditor"  
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
                isActive("intro-editor") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Intro Editor
            </Link>
            <Link
              to="youtubeadd"  
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
                isActive("youtube-add") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Youtube Add
            </Link>
            
         

            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="bg-[rgb(0,104,80)] text-white w-64 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Dashboard
          </h2>
          <nav className="space-y-4">
            {/* Consistent mobile and desktop links */}
            <Link
              to="add"
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
                isActive("add") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <Plus size={20} />
              Add Course
            </Link>
            <Link
              to="list"
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
                isActive("list") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              List Courses
            </Link>
            <Link
              to="listModules"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("listModules") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              List Modules
            </Link>
            <Link
              to="quiz"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("quiz") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <Plus size={20} />
              Add Quiz
            </Link>
            <Link
              to="listquiz"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("listquiz") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Quiz List
            </Link>
            <Link
              to="addblog"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("add-blog") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <Plus size={20} />
              Add Blog
            </Link>
            <Link
              to="listblog"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                isActive("list-blog") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              List Blogs
            </Link>
            <Link
              to="heroeditor"  
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
                isActive("hero-editor") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Hero Editor
            </Link>
            <Link
              to="introeditor"  
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
                isActive("intro-editor") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Intro Editor
            </Link>
            <Link
              to="youtubeadd"  
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg transition duration-200 ${
                isActive("youtube-add") ? "bg-green-800" : "hover:bg-green-600"
              }`}
            >
              <List size={20} />
              Youtube Add
            </Link>
            
          </nav>
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
