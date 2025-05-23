import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { Pencil } from "lucide-react"; // Modern icon (requires lucide-react)

const convertToEmbedUrl = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return "";
};

const PodcastVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [embeddedUrl, setEmbeddedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await axiosInstance.get("/youtube/get");
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching podcast videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !embeddedUrl)
      return toast.error("Please fill in all fields.");

    const embedUrl = convertToEmbedUrl(embeddedUrl);
    if (!embedUrl) return toast.error("Invalid YouTube URL.");

    setLoading(true);
    try {
      if (editingVideo) {
        await axiosInstance.put(`/youtube/update/${editingVideo._id}`, {
          title,
          embeddedUrl: embedUrl,
        });
      } else {
        await axiosInstance.post("/youtube/add", {
          title,
          embeddedUrl: embedUrl,
        });
      }
      setTitle("");
      setEmbeddedUrl("");
      setEditingVideo(null);
      fetchVideos();
      toast.success("Podcast video saved successfully!");
    } catch (err) {
      toast.error("Error saving podcast video.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setEmbeddedUrl(video.embeddedUrl);
    toast("Edit mode activated", { icon: "✏️" });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {editingVideo ? "✏️ Edit Podcast Video" : "🎥 Add Podcast Video"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={`space-y-4 transition-all duration-300 ${
          editingVideo ? "bg-yellow-50 border border-yellow-400 p-4 rounded" : ""
        }`}
      >
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="YouTube URL"
          value={embeddedUrl}
          onChange={(e) => setEmbeddedUrl(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {convertToEmbedUrl(embeddedUrl) && (
          <iframe
            src={convertToEmbedUrl(embeddedUrl)}
            title="Preview"
            className="w-full h-48 rounded border"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? editingVideo
                ? "Updating..."
                : "Adding..."
              : editingVideo
              ? "Update"
              : "Add"}
          </button>

          {editingVideo && (
            <button
              type="button"
              onClick={() => {
                setEditingVideo(null);
                setTitle("");
                setEmbeddedUrl("");
              }}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Podcast Videos</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <iframe
                src={video.embeddedUrl}
                title={video.title}
                className="w-full h-48 mb-3 rounded"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">{video.title}</h4>
                <button
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition"
                  onClick={() => handleEdit(video)}
                >
                  <Pencil size={16} className="mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastVideoManager;
