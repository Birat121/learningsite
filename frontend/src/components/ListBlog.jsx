import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blogs/blogs");
      setBlogs(res.data);
    } catch {
      toast.error("Failed to fetch blogs");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/blogs/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditOpen = (blog) => {
    setSelectedBlog(blog);
    setEditData({ title: blog.title, description: blog.description });
  };

  const handleEditClose = () => {
    setSelectedBlog(null);
    setEditData({ title: "", description: "" });
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axiosInstance.put(`/blogs/blogs/${selectedBlog._id}`, editData);
      toast.success("Blog updated");

      // Update local state
      const updatedBlogs = blogs.map((blog) =>
        blog._id === selectedBlog._id ? res.data : blog
      );
      setBlogs(updatedBlogs);
      handleEditClose();
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4">
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
                      onClick={() => handleEditOpen(blog)}
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

      {/* Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Blog</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  rows={5}
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleEditClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBlogs;
