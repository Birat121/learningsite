import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/admin/blog");
      setBlogs(res.data);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/blog/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Blog List</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-t">
              <td className="p-2">{blog.title}</td>
              <td className="p-2">{blog.description.slice(0, 50)}...</td>
              <td className="p-2">{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListBlogs;
