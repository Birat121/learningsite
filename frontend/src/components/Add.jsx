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
              description: "",
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
      description: "",
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
        const { data: moduleRes } = await axiosInstance.post("/modules", {
          title: module.title,
          description: module.description,
          course: courseId,
        });

        const moduleId = moduleRes._id;

        for (const video of module.videos) {
          const videoForm = new FormData();
          videoForm.append("title", video.title);
          videoForm.append("description", video.description);
          videoForm.append("module", moduleId);
          videoForm.append("videoFile", video.videoFile); // Send video file directly

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
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    courseData.title &&
    courseData.price &&
    courseData.description &&
    courseData.outcome &&
    courseData.thumbnail;

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-6 p-6 border shadow-md rounded-lg h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        Add New Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleCourseChange}
            placeholder="Course Title"
            className="input"
          />
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleCourseChange}
            placeholder="Price (AED)"
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <ReactQuill
            value={courseData.description}
            onChange={(val) => handleEditorChange(val, "description")}
            className="bg-white rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Outcome
          </label>
          <ReactQuill
            value={courseData.outcome}
            onChange={(val) => handleEditorChange(val, "outcome")}
            className="bg-white rounded"
          />
        </div>

        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleCourseChange}
          className="input"
        />

        {/* Modules & Videos */}
        {courseData.modules.map((module, mIdx) => (
          <div key={mIdx} className="border p-4 rounded mb-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Module {mIdx + 1}</h3>
            <input
              type="text"
              placeholder="Module Title"
              value={module.title}
              onChange={(e) =>
                handleModuleChange(mIdx, "title", e.target.value)
              }
              className="input"
            />
            <textarea
              placeholder="Module Description"
              value={module.description}
              onChange={(e) =>
                handleModuleChange(mIdx, "description", e.target.value)
              }
              className="input"
            />

            {module.videos.map((video, vIdx) => (
              <div key={vIdx} className="border p-3 rounded mb-3 bg-white">
                <h4 className="font-medium mb-2">Video {vIdx + 1}</h4>
                <input
                  type="text"
                  placeholder="Video Title"
                  value={video.title}
                  onChange={(e) =>
                    handleVideoChange(mIdx, vIdx, "title", e.target.value)
                  }
                  className="input"
                />
                <textarea
                  placeholder="Video Description"
                  value={video.description}
                  onChange={(e) =>
                    handleVideoChange(mIdx, vIdx, "description", e.target.value)
                  }
                  className="input"
                />
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
                  className="input"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addVideoToModule(mIdx)}
              className="btn mt-2"
            >
              ➕ Add Video
            </button>
          </div>
        ))}

        <button type="button" onClick={addModule} className="btn">
          ➕ Add Module
        </button>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-3 rounded-md font-semibold text-white transition ${
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
