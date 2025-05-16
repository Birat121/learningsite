import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddPage = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: null,
    modules: [
      {
        title: "",

        videos: [
          {
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
          title: "",

          videos: [
            {
              title: "",

              videoFile: null,
            },
          ],
        },
      ],
    }));
  };

  const addVideoToModule = (moduleIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].videos.push({
      title: "",

      videoFile: null,
    });
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
      courseForm.append("title", courseData.title);
      courseForm.append("description", courseData.description);
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
            title: module.title,

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
          videoForm.append("title", video.title);
          videoForm.append("module", moduleRes._id);
          videoForm.append("videoFile", video.videoFile);

          await axiosInstance.post("/videos/videos", videoForm, {
            headers: { "Content-Type": "multipart/form-data" },
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
            title: "",

            videos: [
              {
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
              key={mIdx}
              className="border border-gray-300 rounded-md p-6 bg-gray-50 shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-green-800">
                Module {mIdx + 1}
              </h3>

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
                  className="input border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              {/* Videos List */}
              <div className="space-y-6">
                {module.videos.map((video, vIdx) => (
                  <div
                    key={vIdx}
                    className="border border-gray-300 rounded-md p-4 bg-white shadow-sm"
                  >
                    <h4 className="font-semibold mb-3 text-green-600">
                      Video {vIdx + 1}
                    </h4>

                    <div className="flex flex-col mb-3">
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
                        className="input border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="input border border-gray-300 rounded-md p-2 cursor-pointer"
                        required
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addVideoToModule(mIdx)}
                  className="text-green-600 font-semibold hover:underline mt-2"
                >
                  + Add Video
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addModule}
            className="px-6 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            + Add Module
          </button>
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-md text-white font-semibold ${
            isFormValid && !loading
              ? "bg-green-600 hover:bg-green-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;
