import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blogs/blogs");
      setBlogs(res.data);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/blogs/blog/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">📚 Blog Posts</h2>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                {blog.image?.url && (
                  <img
                    src={blog.image.url}
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-700 text-sm flex-1">
                    {blog.description.slice(0, 120)}...
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListBlogs;

