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
          videoUrl: "", // <-- changed here
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

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
            videoUrl: "", // <-- changed here
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
      videoUrl: "", // <-- changed here
    });
    setModules(updatedModules);
  };

  const removeVideoFromModule = (moduleIndex, videoIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].videos.splice(videoIndex, 1);
    setModules(updatedModules);
  };

  // Validate modules and videos - check videoUrl instead of videoFile
  const areModulesValid = () => {
    if (!modules.length) return false;
    return modules.every((module) => {
      if (!module.title.trim()) return false;
      if (!module.videos.length) return false;
      return module.videos.every(
        (video) => video.title.trim() && video.videoUrl.trim()
      );
    });
  };

  const isFormValid = areModulesValid();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
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
          await axiosInstance.post("/videos/videos", {
            title: video.title.trim(),
            module: moduleRes._id,
            videoUrl: video.videoUrl.trim(), // <-- sending URL instead of file
          });
        }
      }

      toast.success("✅ Modules and videos added!", { id: toastId });
      navigate("/admin/dashboard/list");
    } catch (err) {
      console.error("❌ Upload failed:");
      if (err.response) {
        console.error("Response Data:", err.response.data);
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
      } else if (err.request) {
        console.error("Request made but no response received:", err.request);
      } else {
        console.error("Error Message:", err.message);
      }
      console.error("Axios Config:", err.config);

      toast.error("❌ Upload failed. Check console for details.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
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
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Video URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={video.videoUrl}
                      onChange={(e) =>
                        handleVideoChange(mIdx, vIdx, "videoUrl", e.target.value)
                      }
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addVideoToModule(mIdx)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Video
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addModule}
          className="px-6 py-3 bg-green-700 text-white rounded font-semibold hover:bg-green-800"
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
