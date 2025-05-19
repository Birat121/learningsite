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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in all required fields before submitting.");
      return;
    }
    setShowConfirmModal(true); // Open modal
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
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
      navigate(`/admin/dashboard/addmodules/${data.course._id}`);
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

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Submission</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to create this course?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCoursePage;
