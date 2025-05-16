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
    outcome: "",
    thumbnail: null,
    modules: [
      {
        title: "",
        description: "",
        videos: [
          {
            title: "",
            description: "",
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
          description: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Uploading course...");

    try {
      // Prepare form data for course
      const courseForm = new FormData();
      courseForm.append("title", courseData.title);
      courseForm.append("description", courseData.description);
      courseForm.append("outcome", courseData.outcome);
      courseForm.append("price", courseData.price);
      courseForm.append("thumbnail", courseData.thumbnail); // Send image file directly

      const { data: courseRes } = await axiosInstance.post(
        "/courses/course",
        courseForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const courseId = courseRes._id;

      // Upload modules and videos
      for (const module of courseData.modules) {
        const { data: moduleRes } = await axiosInstance.post(
          "/modules/module",
          {
            title: module.title,

            course: courseId,
          }
        );

        for (const module of courseData.modules) {
          const { data: moduleRes } = await axiosInstance.post(
            "/modules/module",
            {
              title: module.title,
              description: module.description,
              course: courseId,
            }
          );

          for (const video of module.videos) {
            if (!video.videoFile) {
              console.warn("Missing video file for video:", video.title);
              continue;
            }
            const videoForm = new FormData();
            videoForm.append("title", video.title);
            videoForm.append("module", moduleRes._id); // <-- use module ID here
            videoForm.append("videoFile", video.videoFile);

            await axiosInstance.post("/videos/videos", videoForm, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          }
        }
      }

      toast.success("✅ Course created successfully!", { id: toastId });

      // Reset form
      setCourseData({
        title: "",
        price: "",
        description: "",
        outcome: "",
        thumbnail: null,
        modules: [
          {
            title: "",

            videos: [
              {
                title: "",
                description: "",
                videoFile: null,
              },
            ],
          },
        ],
      });
    } catch (err) {
      console.error("❌ Course upload failed:", err);

      if (err.response) {
        // The request was made and the server responded with a status code
        console.error("🛑 Server responded with an error:");
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
        console.log("Headers:", err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("⚠️ No response received from server:");
        console.log(err.request);
      } else {
        // Something happened in setting up the request
        console.error("🚨 Error setting up request:", err.message);
      }

      toast.error("❌ Upload failed.", { id: toastId });
    }
  };

  const isFormValid =
    courseData.title &&
    courseData.price &&
    courseData.description &&
    courseData.outcome &&
    courseData.thumbnail;
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
            <label className="mb-2 font-semibold text-gray-700">
              Outcome <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              value={courseData.outcome}
              onChange={(val) => handleEditorChange(val, "outcome")}
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
                  Module Title
                </label>
                <input
                  type="text"
                  placeholder="Module Title"
                  value={module.title}
                  onChange={(e) =>
                    handleModuleChange(mIdx, "title", e.target.value)
                  }
                  className="input border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                      <label className="mb-1 font-medium text-gray-700">
                        Video Title
                      </label>
                      <input
                        type="text"
                        placeholder="Video Title"
                        value={video.title}
                        onChange={(e) =>
                          handleVideoChange(mIdx, vIdx, "title", e.target.value)
                        }
                        className="input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 font-medium text-gray-700">
                        Upload Video File
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
                        className="input border border-gray-300 rounded-md p-1 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addVideoToModule(mIdx)}
                className="mt-4 inline-block px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                ➕ Add Video
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addModule}
            className="w-full py-3 rounded-md font-semibold text-white bg-green-700 hover:bg-green-800 transition"
          >
            ➕ Add Module
          </button>
        </section>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-md font-semibold text-white transition ${
            loading || !isFormValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {loading ? "Adding Course..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;
