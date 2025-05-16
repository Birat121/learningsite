import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const ModuleVideoManagementPage = ({ courseId }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null); // { type: "module" | "video", data: object }
  const [formData, setFormData] = useState({});

  const fetchModules = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/courses/${courseId}/modules`);
      setModules(data);
    } catch (err) {
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
      ...(type === "video" && { url: data.url || "" }),
    });
  };

  const closeEditModal = () => {
    setEditItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const saveEdit = async () => {
    const { type, data } = editItem;
    try {
      if (type === "module") {
        await axiosInstance.put(`/modules/${data._id}`, { title: formData.title });
        toast.success("Module updated");
      } else {
        await axiosInstance.put(`/videos/${data._id}`, {
          title: formData.title,
          url: formData.url,
        });
        toast.success("Video updated");
      }
      closeEditModal();
      fetchModules();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteItem = async (type, id) => {
    const confirmed = window.confirm(`Delete this ${type}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/${type === "module" ? "modules" : "videos"}/${id}`);
      toast.success(`${type} deleted`);
      fetchModules();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Modules & Videos</h1>

      {modules.map((module) => (
        <div key={module._id} className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">{module.title}</h2>
            <div>
              <button
                onClick={() => openEditModal("module", module)}
                className="mr-2 text-blue-600 hover:underline"
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
                      className="text-blue-500 text-sm"
                    >
                      Watch
                    </a>
                  </div>
                  <div>
                    <button
                      onClick={() => openEditModal("video", video)}
                      className="mr-2 text-blue-600 hover:underline"
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
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full mt-1 border px-3 py-2 rounded"
                />
              </label>
              {editItem.type === "video" && (
                <label>
                  Video URL
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full mt-1 border px-3 py-2 rounded"
                  />
                </label>
              )}
              <div className="flex justify-end space-x-3">
                <button onClick={closeEditModal} className="bg-gray-300 px-4 py-2 rounded">
                  Cancel
                </button>
                <button onClick={saveEdit} className="bg-blue-600 text-white px-4 py-2 rounded">
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

export default ModuleVideoManagementPage;
