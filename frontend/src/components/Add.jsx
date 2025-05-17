import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";

const AddPage = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: null,
    modules: [
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
    ],
  });

  const [loading, setLoading] = useState(false);

  const handleCourseChange = (e) => {
    const { name, value, files } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditorChange = (value, field) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...courseData.modules];
    updatedModules[index][field] = value;
    setCourseData((prev) => ({ ...prev, modules: updatedModules }));
  };

  const handleVideoChange = (moduleIndex, videoIndex, field, value) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].videos[videoIndex][field] = value;
    setCourseData((prev) => ({ ...prev, modules: updatedModules }));
  };

  const addModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
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
      ],
    }));
  };

  const removeModule = (index) => {
    const updatedModules = [...courseData.modules];
    updatedModules.splice(index, 1);
    setCourseData((prev) => ({ ...prev, modules: updatedModules }));
  };

  const addVideoToModule = (moduleIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].videos.push({
      id: uuidv4(),
      title: "",
      videoFile: null,
    });
    setCourseData((prev) => ({ ...prev, modules: updatedModules }));
  };

  const removeVideoFromModule = (moduleIndex, videoIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].videos.splice(videoIndex, 1);
    setCourseData((prev) => ({ ...prev, modules: updatedModules }));
  };

  // Validation helper for modules and videos
  const areModulesValid = () => {
    if (!courseData.modules.length) return false;
    return courseData.modules.every((module) => {
      if (!module.title.trim()) return false;
      if (!module.videos.length) return false;
      return module.videos.every(
        (video) => video.title.trim() && video.videoFile
      );
    });
  };

  // Overall form validation including course fields and modules/videos
  const isFormValid =
    courseData.title.trim() &&
    courseData.price &&
    courseData.description.trim() &&
    courseData.thumbnail &&
    areModulesValid();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in all required fields before submitting.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading course...");

    try {
      // Prepare form data for course
      const courseForm = new FormData();
      courseForm.append("title", courseData.title.trim());
      courseForm.append("description", courseData.description.trim());
      courseForm.append("price", courseData.price);
      courseForm.append("thumbnail", courseData.thumbnail);

      // Save course first
      const { data: courseRes } = await axiosInstance.post(
        "/courses/course",
        courseForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const courseId = courseRes._id;

      // Loop through each module and save
      for (const module of courseData.modules) {
        const { data: moduleRes } = await axiosInstance.post(
          "/modules/module",
          {
            title: module.title.trim(),
            course: courseId,
          }
        );

        // Loop through each video in the module and save
        for (const video of module.videos) {
          if (!video.videoFile) {
            console.warn("Missing video file for video:", video.title);
            continue;
          }

          const videoForm = new FormData();
          videoForm.append("title", video.title.trim());
          videoForm.append("module", moduleRes._id);
          videoForm.append("video", video.videoFile); // key must be "video"

          await axiosInstance.post("/videos/videos", videoForm, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Video Upload Progress: ${percent}%`);
            },
          });
        }
      }

      toast.success("✅ Course created successfully!", { id: toastId });

      // Reset form
      setCourseData({
        title: "",
        price: "",
        description: "",
        thumbnail: null,
        modules: [
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
        ],
      });
    } catch (err) {
      console.error("❌ Course upload failed:", err);

      if (err.response) {
        console.error("🛑 Server responded with an error:");
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
        console.log("Headers:", err.response.headers);
      } else if (err.request) {
        console.error("⚠️ No response received from server:");
        console.log(err.request);
      } else {
        console.error("🚨 Error setting up request:", err.message);
      }

      toast.error("❌ Upload failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-12 p-8 border rounded-lg shadow-lg bg-white min-h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-4xl font-extrabold text-center text-green-700 mb-10">
        Add New Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Info */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="title"
                className="mb-2 font-semibold text-gray-700"
              >
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleCourseChange}
                placeholder="Enter course title"
                className="input border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="price"
                className="mb-2 font-semibold text-gray-700"
              >
                Price (AED) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleCourseChange}
                placeholder="Enter price"
                className="input border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              value={courseData.description}
              onChange={(val) => handleEditorChange(val, "description")}
              className="bg-white rounded-md border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="thumbnail"
              className="mb-2 font-semibold text-gray-700"
            >
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <input
              id="thumbnail"
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleCourseChange}
              className="input border border-gray-300 rounded-md p-2 cursor-pointer"
              required
            />
          </div>
        </section>

        {/* Modules & Videos */}
        <section className="space-y-8">
          {courseData.modules.map((module, mIdx) => (
            <div
              key={module.id}
              className="border border-gray-300 rounded-md p-6 bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-green-800">
                  Module {mIdx + 1}
                </h3>
                {courseData.modules.length > 1 && (
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

              <div className="flex flex-col mb-4">
                <label className="mb-2 font-medium text-gray-700">
                  Module Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Module Title"
                  value={module.title}
                  onChange={(e) =>
                    handleModuleChange(mIdx, "title", e.target.value)
                  }
                  className="input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Videos in Module */}
              <div className="space-y-6">
                {module.videos.map((video, vIdx) => (
                  <div
                    key={video.id}
                    className="border border-gray-300 rounded-md p-4 bg-white"
                  >
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">
                          Video Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Video Title"
                          value={video.title}
                          onChange={(e) =>
                            handleVideoChange(mIdx, vIdx, "title", e.target.value)
                          }
                          className="input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">
                          Video File <span className="text-red-500">*</span>
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
                          className="input border border-gray-300 rounded-md p-2 cursor-pointer"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addVideoToModule(mIdx)}
                  className="mt-3 text-green-700 font-semibold hover:underline"
                >
                  + Add Another Video
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addModule}
            className="text-green-700 font-semibold hover:underline"
          >
            + Add Another Module
          </button>
        </section>

        <button
          type="submit"
          disabled={loading}
          className={`mt-8 w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading ? "Uploading..." : "Save Course"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;
