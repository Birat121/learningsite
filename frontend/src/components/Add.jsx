import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const AddCoursePage = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCourseChange = (e) => {
    const { name, value, files } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditorChange = (value) => {
    setCourseData((prev) => ({ ...prev, description: value }));
  };

  const isFormValid =
    courseData.title.trim() &&
    courseData.price &&
    courseData.description.trim() &&
    courseData.thumbnail;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in all required fields before submitting.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Creating course...");
    try {
      const formData = new FormData();
      formData.append("title", courseData.title.trim());
      formData.append("price", courseData.price);
      formData.append("description", courseData.description.trim());
      formData.append("thumbnail", courseData.thumbnail);

      const { data } = await axiosInstance.post("/courses/course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Course created!", { id: toastId });

      // Redirect to modules/videos page with new course ID
      navigate(`/add-modules/${data._id}`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Course creation failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 border rounded-lg shadow bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Add New Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleCourseChange}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Price (AED) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleCourseChange}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            theme="snow"
            value={courseData.description}
            onChange={handleEditorChange}
            className="bg-white border rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleCourseChange}
            required
            className="w-full cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCoursePage;
