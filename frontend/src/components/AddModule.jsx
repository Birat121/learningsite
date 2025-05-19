import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const AddModulesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [modules, setModules] = useState([
    {
      id: uuidv4(),
      title: "",
      videos: [
        {
          id: uuidv4(),
          title: "",
          videoFile: null,
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  // Progress state: { videoId: percentage }
  const [uploadProgress, setUploadProgress] = useState({});

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const handleVideoChange = (moduleIndex, videoIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].videos[videoIndex][field] = value;
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: "",
        videos: [
          {
            id: uuidv4(),
            title: "",
            videoFile: null,
          },
        ],
      },
    ]);
  };

  const removeModule = (index) => {
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  const addVideoToModule = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].videos.push({
      id: uuidv4(),
      title: "",
      videoFile: null,
    });
    setModules(updatedModules);
  };

  const removeVideoFromModule = (moduleIndex, videoIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].videos.splice(videoIndex, 1);
    setModules(updatedModules);
  };

  const areModulesValid = () => {
    if (!modules.length) return false;
    return modules.every((module) => {
      if (!module.title.trim()) return false;
      if (!module.videos.length) return false;
      return module.videos.every(
        (video) => video.title.trim() && video.videoFile
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!areModulesValid()) {
      toast.error("Please fill all required module and video fields.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Uploading modules and videos...");

    try {
      for (const module of modules) {
        const { data: moduleRes } = await axiosInstance.post(
          "/modules/module",
          {
            title: module.title.trim(),
            course: courseId,
          }
        );

        for (const video of module.videos) {
          const videoFormData = new FormData();
          videoFormData.append("video", video.videoFile);
          videoFormData.append("title", video.title.trim());
          videoFormData.append("module", moduleRes._id);

          await axiosInstance.post("/videos/videos", videoFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prev) => ({
                ...prev,
                [video.id]: percentCompleted,
              }));
            },
          });

          // Reset progress for this video after upload completes
          setUploadProgress((prev) => ({
            ...prev,
            [video.id]: 0,
          }));
        }
      }

      toast.success("✅ Modules and videos added!", { id: toastId });
      navigate("/admin/dashboard/list");
    } catch (err) {
      console.error("❌ Upload failed:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
        console.error("Data:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error message:", err.message);
      }

      toast.error("❌ Upload failed. Check console for details.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 border rounded-lg shadow bg-white min-h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Add Modules & Videos to Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {modules.map((module, mIdx) => (
          <div
            key={module.id}
            className="border p-6 rounded-md shadow-sm bg-gray-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-green-800">
                Module {mIdx + 1}
              </h3>
              {modules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeModule(mIdx)}
                  className="text-red-600 hover:underline font-semibold"
                  title="Remove module"
                  disabled={loading}
                >
                  Remove Module
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">
                Module Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Module Title"
                value={module.title}
                onChange={(e) =>
                  handleModuleChange(mIdx, "title", e.target.value)
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                required
                disabled={loading}
              />
            </div>

            {/* Videos */}
            <div className="space-y-6">
              {module.videos.map((video, vIdx) => (
                <div key={video.id} className="border rounded-md p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-green-700">
                      Video {vIdx + 1}
                    </h4>
                    {module.videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideoFromModule(mIdx, vIdx)}
                        className="text-red-600 hover:underline font-semibold"
                        title="Remove video"
                        disabled={loading}
                      >
                        Remove Video
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block font-medium mb-1">
                      Video Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={video.title}
                      onChange={(e) =>
                        handleVideoChange(mIdx, vIdx, "title", e.target.value)
                      }
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Upload Video File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        handleVideoChange(
                          mIdx,
                          vIdx,
                          "videoFile",
                          e.target.files[0]
                        )
                      }
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Progress bar */}
                  {uploadProgress[video.id] > 0 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-600 h-4 rounded-full transition-all"
                        style={{ width: `${uploadProgress[video.id]}%` }}
                      ></div>
                    </div>
                  )}
                  {uploadProgress[video.id] > 0 && (
                    <p className="text-sm text-green-700 mt-1">
                      Uploading: {uploadProgress[video.id]}%
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addVideoToModule(mIdx)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              + Add Video
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addModule}
          className="px-6 py-3 bg-green-700 text-white rounded font-semibold hover:bg-green-800"
          disabled={loading}
        >
          + Add Module
        </button>

        <button
          type="submit"
          disabled={loading}
          className="block w-full py-4 bg-green-800 text-white rounded mt-6 font-bold hover:bg-green-900 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Save Modules & Videos"}
        </button>
      </form>
    </div>
  );
};

export default AddModulesPage;
