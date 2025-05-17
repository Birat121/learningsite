import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Make sure baseURL is set here
import toast from "react-hot-toast";

const ModuleVideoManagementPage = () => {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null); // { type: "module" | "video", data: {} }
  const [formData, setFormData] = useState({ title: "", file: null });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchModules = async () => {
    if (!courseId) {
      toast.error("No course selected");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/courses/course/${courseId}/modules`);
      setModules(data);
    } catch (error) {
      console.error("Fetch modules error:", error);
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
    setFormData({ title: data.title || "", file: null });
    // For video, use existing video url for preview; for module no preview
    setPreviewUrl(type === "video" ? data.url : null);
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditItem(null);
    setFormData({ title: "", file: null });
    setPreviewUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((f) => ({ ...f, file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      if (editItem.type === "module") {
        // Update module title only
        await axiosInstance.put(`/modules/module/${editItem.data._id}`, {
          title: formData.title.trim(),
        });
        toast.success("Module updated");
      } else {
        // Update video title and optional video file
        const videoForm = new FormData();
        videoForm.append("title", formData.title.trim());
        if (formData.file) {
          videoForm.append("video", formData.file);
        }

        await axiosInstance.put(`/videos/video/${editItem.data._id}`, videoForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Video updated");
      }

      closeEditModal();
      fetchModules();
    } catch (error) {
      console.error("Update failed:", error.response || error);
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
      console.error("Delete failed:", error.response || error);
      toast.error("Delete failed");
    }
  };

  if (!courseId) {
    return <div className="text-center text-red-600 mt-10">Error: No course selected.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Modules & Videos</h1>

      {loading && (
        <p className="text-center text-gray-600 font-semibold">Loading modules...</p>
      )}

      {!loading && modules.length === 0 && (
        <p className="text-center text-gray-500 italic">No modules found for this course.</p>
      )}

      {modules.map((module) => (
        <div key={module._id} className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-800">{module.title}</h2>
            <div>
              <button
                onClick={() => openEditModal("module", module)}
                className="mr-3 text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem("module", module._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          {module.videos.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No videos in this module.</p>
          ) : (
            <ul className="space-y-3">
              {module.videos.map((video) => (
                <li key={video._id} className="flex justify-between items-center border-b pb-2">
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
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem("video", video._id)}
                      className="text-red-600 hover:underline"
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
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
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
                  className="w-full mt-1 border px-3 py-2 rounded"
                  required
                  autoFocus
                />
              </label>

              {editItem.type === "video" && (
                <>
                  <label className="block">
                    Replace Video File
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="w-full mt-1 border px-3 py-2 rounded"
                    />
                  </label>

                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <video
                        controls
                        src={previewUrl}
                        className="w-full max-h-64 rounded border"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeEditModal}
                  disabled={saving}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving || !formData.title.trim()}
                  className={`px-4 py-2 rounded text-white ${
                    saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
