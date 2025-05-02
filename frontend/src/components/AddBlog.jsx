import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("author", formData.author);
      data.append("image", formData.image);

      await axiosInstance.post("/admin/blog", data);
      toast.success("Blog added successfully");
      setFormData({ title: "", description: "", author: "", image: null });
    } catch (error) {
      toast.error("Failed to add blog");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded" />
        <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author" required className="w-full p-2 border rounded" />
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-2" />
        <button type="submit" className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded">
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
