import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance"; // Adjust if needed
import { toast } from "react-hot-toast";

const EditAboutPage = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    sections: [], // Ensure this is initialized as an empty array
  });

  // Fetch data when the component mounts
  useEffect(() => {
    axiosInstance
      .get("/about/get")
      .then((res) => {
        // Make sure the response structure is correct
        setAboutData({
          title: res.data.title || "",
          description: res.data.description || "",
          sections: res.data.sections || [], // Ensure sections is always an array
        });
      })
      .catch((err) => {
        console.error("Error fetching about data:", err);
        toast.error("Failed to fetch About page data");
      });
  }, []);

  // Handle input changes for sections
  const handleChange = (e, index, field) => {
    const newSections = [...aboutData.sections];
    newSections[index][field] = e.target.value;
    setAboutData({ ...aboutData, sections: newSections });
  };

  // Handle paragraph changes within sections
  const handleParagraphChange = (e, sectionIndex, paraIndex) => {
    const newSections = [...aboutData.sections];
    newSections[sectionIndex].paragraphs[paraIndex] = e.target.value;
    setAboutData({ ...aboutData, sections: newSections });
  };

  // Add a new section
  const addSection = () => {
    setAboutData({
      ...aboutData,
      sections: [
        ...aboutData.sections,
        {
          heading: "",
          paragraphs: [""],
          imageUrl: "",
          reverseLayout: false,
        },
      ],
    });
  };

  // Add a new paragraph to a section
  const addParagraph = (sectionIndex) => {
    const newSections = [...aboutData.sections];
    newSections[sectionIndex].paragraphs.push("");
    setAboutData({ ...aboutData, sections: newSections });
  };

  // Toggle reverse layout (image on left)
  const handleReverseToggle = (index) => {
    const newSections = [...aboutData.sections];
    newSections[index].reverseLayout = !newSections[index].reverseLayout;
    setAboutData({ ...aboutData, sections: newSections });
  };

  // Handle image upload
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosInstance.post("/about/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newSections = [...aboutData.sections];
      newSections[index].imageUrl = res.data.imageUrl;
      setAboutData({ ...aboutData, sections: newSections });
    } catch (err) {
      toast.error("Failed to upload image: " + err.message);
    }
  };

  // Save changes to the backend
  const handleSave = () => {
    axios
      .put("/about/update", aboutData)
      .then(() => toast.success("About page updated successfully"))
      .catch((err) => toast.error("Failed to update about page"));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit About Page</h1>

      <div className="mb-6">
        <label className="block font-semibold">Page Title</label>
        <input
          type="text"
          value={aboutData.title}
          onChange={(e) =>
            setAboutData({ ...aboutData, title: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-8">
        <label className="block font-semibold">Meta Description</label>
        <textarea
          rows={3}
          value={aboutData.description}
          onChange={(e) =>
            setAboutData({ ...aboutData, description: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Render Sections */}
      {aboutData.sections && aboutData.sections.length > 0 ? (
        aboutData.sections.map((section, index) => (
          <div key={index} className="mb-10 border p-4 rounded bg-gray-100">
            <h3 className="text-xl font-semibold mb-3">Section {index + 1}</h3>

            <input
              type="text"
              placeholder="Heading"
              value={section.heading}
              onChange={(e) => handleChange(e, index, "heading")}
              className="w-full p-2 mb-3 border rounded"
            />

            {/* Render Paragraphs */}
            {section.paragraphs.map((para, paraIndex) => (
              <textarea
                key={paraIndex}
                value={para}
                onChange={(e) =>
                  handleParagraphChange(e, index, paraIndex)
                }
                placeholder={`Paragraph ${paraIndex + 1}`}
                rows={3}
                className="w-full p-2 mb-2 border rounded"
              />
            ))}

            <button
              onClick={() => addParagraph(index)}
              className="mb-3 px-3 py-1 text-sm bg-blue-200 rounded hover:bg-blue-300"
            >
              ➕ Add Paragraph
            </button>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="block font-semibold mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
              />
              {section.imageUrl && (
                <p className="text-sm text-gray-600 mt-1">
                  Current: {section.imageUrl}
                </p>
              )}
            </div>

            {/* Reverse Layout Checkbox */}
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={section.reverseLayout}
                onChange={() => handleReverseToggle(index)}
              />
              Reverse Layout (image on left)
            </label>
          </div>
        ))
      ) : (
        <p>No sections available</p>
      )}

      <button
        onClick={addSection}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
      >
        ➕ Add Section
      </button>

      <button
        onClick={handleSave}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        💾 Save Changes
      </button>
    </div>
  );
};

export default EditAboutPage;

