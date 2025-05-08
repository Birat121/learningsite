import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const AddPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    outcome: "",
    thumbnail: null,
    video: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes for form data
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((f) => ({ ...f, [name]: file }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  // Handle form submission and send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    const outcomes = formData.outcome
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean);
    outcomes.forEach((item) => data.append("courseOutcome[]", item)); // send as array

    data.append("price", formData.price);
    data.append("thumbnail", formData.thumbnail);
    data.append("video", formData.video);

    const toastId = toast.loading("Uploading... 0%");

    try {
      setLoading(true);

      const res = await axiosInstance.post("/videos/videos", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          toast.loading(`Uploading... ${percent}%`, { id: toastId });
        },
      });

      toast.success("✅ Course added successfully!", { id: toastId });

      // Reset form
      setFormData({
        title: "",
        price: "",
        description: "",
        outcome: "",
        thumbnail: null,
        video: null,
      });
    } catch (err) {
      toast.dismiss(toastId); // ❗️Dismiss progress toast
      toast.error(err.response?.data?.message || "❌ Upload failed.");
      console.log("Upload Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Validate form before enabling submit button
  const isFormValid =
    formData.title &&
    formData.price &&
    formData.description &&
    formData.outcome &&
    formData.thumbnail &&
    formData.video;

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-6 p-6 border shadow-md rounded-lg h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        Add New Course
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
      >
        {[{
            label: "Course Title",
            name: "title",
            type: "text",
            placeholder: "Enter course title",
          },
          {
            label: "Price (in AED)",
            name: "price",
            type: "number",
            placeholder: "Enter course price in AED",
          },
        ].map(({ label, name, type, placeholder }) => (
          <div className="flex flex-col" key={name}>
            <label className="text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            placeholder="Enter course description"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Course Outcome
          </label>
          <textarea
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
            rows="4"
            placeholder="Enter course outcome (one per line)"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Course Video
          </label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-md font-semibold text-white transition ${
              loading || !isFormValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? "Adding Course..." : "Add Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPage;
