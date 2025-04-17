import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-[rgb(0,104,80)] text-white w-64 p-4">
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <ul>
          <li className="mb-4">
            <Link
              to="add"
              className="text-lg hover:text-gray-400 "
            >
              Add Item
            </Link>
          </li>
          <li>
            <Link
              to="list"
              className="text-lg hover:text-gray-400 "
            >
              List Items
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <Outlet /> {/* This renders the corresponding component (Add or List) */}
      </div>
    </div>
  );
};

export default AdminPage;
