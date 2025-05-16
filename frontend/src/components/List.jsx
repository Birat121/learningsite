import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editCourse, setEditCourse] = useState(null); // course being edited
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnailUrl: "",
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/courses/course");
      setCourses(data);
    } catch (err) {
      toast.error("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openEditModal = (course) => {
    setEditCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      price: course.price?.toString() || "",
      thumbnailUrl: course.thumbnailUrl || "",
    });
  };

  const closeEditModal = () => {
    setEditCourse(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const saveEdit = async () => {
    if (!formData.title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await axiosInstance.put(`/courses/course/${editCourse._id}`, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        thumbnailUrl: formData.thumbnailUrl,
      });

      toast.success("Course updated!");
      closeEditModal();
      fetchCourses();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This cannot be undone.")) return;

    try {
      await axiosInstance.delete(`/courses/course/${courseId}`);
      toast.success("Course deleted!");
      fetchCourses();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
        <style>{`
          .loader {
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
     

      {courses.length === 0 && (
        <p className="text-center text-gray-600 italic">No courses found.</p>
      )}

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={course.thumbnailUrl || "/default-thumbnail.jpg"}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-blue-800 mb-2">{course.title}</h2>
            <p className="mb-4 font-semibold">Price: ₹ {course.price?.toFixed(2)}</p>

            <div className="flex justify-between">
              <button
                onClick={() => openEditModal(course)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCourse(course._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
            <div className="flex flex-col space-y-4">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Price (₹)
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Thumbnail URL
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </label>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
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

export default CourseManagementPage;
