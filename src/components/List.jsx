import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./confirmationModel"; // Import ConfirmationModal

const ListPage = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedCourse, setSelectedCourse] = useState(null); // Store the selected course for editing
  const [courseData, setCourseData] = useState({
    title: "",
    price: "",
    description: "",
    courseOutcome: "",
    thumbnailFile: null,
    videoFile: null,
  }); // Form data for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for delete confirmation
  const [courseToDelete, setCourseToDelete] = useState(null); // Course ID for deletion

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/videos/Videos"); // Adjust path
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  // Handle changes to input fields in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCourseData({ ...courseData, [name]: files[0] });
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setCourseData({
      title: course.title,
      price: course.price,
      description: course.description,
      courseOutcome: course.courseOutcome,
      thumbnailFile: null, // Reset the file input
      videoFile: null, // Reset the file input
    });
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    setCourseToDelete(courseId);
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    const deleteToast = toast.loading("Please wait...", {
      position: "top-center",
    });

    try {
      await axiosInstance.delete(`/videos/videos/${courseToDelete}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseToDelete));

      toast.success("Course deleted successfully!", {
        id: deleteToast,
        position: "top-center",
      });

      setIsModalOpen(false); // Close the modal after deletion
    } catch (err) {
      console.error("Delete failed:", err);

      toast.error("Something went wrong while deleting.", {
        id: deleteToast,
        position: "top-center",
      });

      setIsModalOpen(false); // Close the modal if error occurs
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("price", courseData.price);
    formData.append("description", courseData.description);
    formData.append("courseOutcome", courseData.courseOutcome);

    if (courseData.thumbnailFile) {
      formData.append("thumbnail", courseData.thumbnailFile);
    }
    if (courseData.videoFile) {
      formData.append("video", courseData.videoFile);
    }

    try {
      const updatedCourse = await axiosInstance.put(
        `/videos/videos/${selectedCourse._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === selectedCourse._id ? updatedCourse.data : course
        )
      );
      setShowModal(false);

      toast.success("Course updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Something went wrong while updating.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Course List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3">Thumbnail</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(courses) &&
              courses.map((course, index) => (
                <tr key={course._id || course.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4">
                    <img src={course.thumbnailUrl} alt={course.title} className="w-20 h-auto rounded-md" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{course.title}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">${course.price}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => handleEdit(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing course */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96">
            <h3 className="text-2xl font-bold mb-4">Edit Course</h3>
            <form onSubmit={handleUpdateCourse} encType="multipart/form-data">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Course Outcome</label>
                <textarea
                  name="courseOutcome"
                  value={courseData.courseOutcome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                <input
                  type="file"
                  name="thumbnailFile"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Video</label>
                <input
                  type="file"
                  name="videoFile"
                  onChange={handleFileChange}
                  accept="video/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />
    </div>
  );
};

export default ListPage;
