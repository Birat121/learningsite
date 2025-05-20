import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Make sure baseURL is set here
import toast from "react-hot-toast";

const ModuleVideoManagementPage = () => {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null); // { type: "module" | "video", data: {} }
  const [formData, setFormData] = useState({ title: "", vimeoUrl: "" });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchModules = async () => {
    if (!courseId) {
      toast.error("No course selected");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/courses/course/${courseId}/modules`
      );
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
    setFormData({ 
      title: data.title || "", 
      vimeoUrl: data.videoUrl && !data.videoUrl.startsWith("blob:") ? data.videoUrl : "" 
    });
    setPreviewUrl(null);
    setVideoFile(null);
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditItem(null);
    setFormData({ title: "", vimeoUrl: "" });
    setPreviewUrl(null);
    setVideoFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((f) => ({ ...f, vimeoUrl: "" })); // clear Vimeo URL if file chosen
    } else {
      setVideoFile(null);
      setPreviewUrl(null);
    }
  };

  const saveEdit = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (
      editItem.type === "video" &&
      !videoFile &&
      !formData.vimeoUrl.trim()
    ) {
      toast.error("Either upload a video file or provide a Vimeo URL");
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
        // Update video: either file upload or URL
        if (videoFile) {
          const form = new FormData();
          form.append("title", formData.title.trim());
          form.append("video", videoFile);
          await axiosInstance.put(`/vimeo/update/${editItem.data._id}`, form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          // Save Vimeo URL only (assuming backend accepts this)
          await axiosInstance.put(`/videos/videos/${editItem.data._id}`, {
            title: formData.title.trim(),
            videoUrl: formData.vimeoUrl.trim(),
          });
        }
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
      const route = type === "module" ? "modules/module" : "videos/videos";
      await axiosInstance.delete(`/${route}/${id}`);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
      fetchModules();
    } catch (error) {
      console.error("Delete failed:", error.response || error);
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
        <div key={module._id} className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {module.title}
            </h2>
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
            <p className="text-sm text-gray-500 italic">
              No videos in this module.
            </p>
          ) : (
            <ul className="space-y-3">
              {module.videos.map((video) => (
                <li
                  key={video._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{video.title}</p>
                    {video.videoUrl && video.videoUrl.startsWith("http") ? (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Watch
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm italic">
                        No video URL
                      </span>
                    )}
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
                    Vimeo Embed URL (e.g. https://player.vimeo.com/video/123456789)
                    <input
                      type="url"
                      name="vimeoUrl"
                      value={formData.vimeoUrl}
                      onChange={handleChange}
                      placeholder="Paste Vimeo embed URL here"
                      className="w-full mt-1 border px-3 py-2 rounded"
                    />
                  </label>

                  <label className="block mt-4">
                    Or Upload Video File
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="w-full mt-1"
                    />
                  </label>

                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Preview (Uploaded Video):</p>
                      <video
                        controls
                        src={previewUrl}
                        className="w-full max-h-64 rounded border"
                      />
                    </div>
                  )}

                  {!previewUrl && formData.vimeoUrl && (
                    <div className="mt-4 aspect-w-16 aspect-h-9">
                      <p className="text-sm text-gray-500 mb-1">Vimeo Video Preview:</p>
                      <iframe
                        src={formData.vimeoUrl}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Vimeo video preview"
                        className="w-full h-64 rounded border"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleVideoManagementPage;
