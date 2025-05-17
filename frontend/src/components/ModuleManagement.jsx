import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const ModuleVideoManagementPage = () => {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null); // { type: "module" | "video", data: {} }
  const [formData, setFormData] = useState({ title: "", url: "" });
  const [saving, setSaving] = useState(false);

  const fetchModules = async () => {
    if (!courseId) {
      toast.error("No course selected");
      return;
    }
    setLoading(true);
    try {
      const url = `/courses/course/${courseId}/modules`;
      console.log("Fetching modules from URL:", url);
      const { data } = await axiosInstance.get(url);
      console.log("Modules fetched:", data);
      setModules(data);
    } catch (error) {
      console.error("Fetch modules error:", error);

      // Log detailed axios error info
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received, request:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }

      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const openEditModal = (type, data) => {
    setEditItem({ type, data });
    setFormData({
      title: data.title || "",
      url: type === "video" ? data.url || "" : "",
    });
  };

  const closeEditModal = () => {
    if (saving) return; // prevent closing while saving
    setEditItem(null);
    setFormData({ title: "", url: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const saveEdit = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (editItem.type === "video" && !formData.url.trim()) {
      toast.error("Video URL is required");
      return;
    }

    setSaving(true);
    try {
      if (editItem.type === "module") {
        await axiosInstance.put(`/modules/module/${editItem.data._id}`, {
          title: formData.title.trim(),
        });
        toast.success("Module updated");
      } else {
        await axiosInstance.put(`/videos/video/${editItem.data._id}`, {
          title: formData.title.trim(),
          url: formData.url.trim(),
        });
        toast.success("Video updated");
      }
      closeEditModal();
      fetchModules();
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (type, id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${type}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const route = type === "module" ? "modules/module" : "videos/video";
      await axiosInstance.delete(`/${route}/${id}`);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
      fetchModules();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  if (!courseId) {
    return (
      <div className="text-center text-red-600 mt-10">
        Error: No course selected.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Modules & Videos</h1>

      {loading && (
        <p className="text-center text-gray-600 font-semibold">
          Loading modules...
        </p>
      )}

      {!loading && modules.length === 0 && (
        <p className="text-center text-gray-500 italic">
          No modules found for this course.
        </p>
      )}

      {modules.map((module) => (
        <div
          key={module._id}
          className="bg-white rounded-lg shadow p-4 mb-6"
          role="region"
          aria-labelledby={`module-title-${module._id}`}
        >
          <div className="flex justify-between items-center mb-3">
            <h2
              id={`module-title-${module._id}`}
              className="text-xl font-semibold text-gray-800"
            >
              {module.title}
            </h2>
            <div>
              <button
                onClick={() => openEditModal("module", module)}
                className="mr-3 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`Edit module ${module.title}`}
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem("module", module._id)}
                className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Delete module ${module.title}`}
              >
                Delete
              </button>
            </div>
          </div>

          {module.videos.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No videos in this module.
            </p>
          ) : (
            <ul
              className="space-y-3"
              aria-label={`Videos in module ${module.title}`}
            >
              {module.videos.map((video) => (
                <li
                  key={video._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{video.title}</p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Watch
                    </a>
                  </div>
                  <div>
                    <button
                      onClick={() => openEditModal("video", video)}
                      className="mr-3 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-label={`Edit video ${video.title}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem("video", video._id)}
                      className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label={`Delete video ${video.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Edit Modal */}
      {editItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeEditModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="edit-modal-title"
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="edit-modal-title" className="text-xl font-bold mb-4">
              Edit {editItem.type === "module" ? "Module" : "Video"}
            </h2>

            <div className="space-y-4">
              <label className="block">
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full mt-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  autoFocus
                />
              </label>

              {editItem.type === "video" && (
                <label className="block">
                  Video URL
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full mt-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </label>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeEditModal}
                  disabled={saving}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={
                    saving ||
                    !formData.title.trim() ||
                    (editItem.type === "video" && !formData.url.trim())
                  }
                  className={`px-4 py-2 rounded text-white ${
                    saving
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }`}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleVideoManagementPage;
