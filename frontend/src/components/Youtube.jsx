import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

// Helper function to convert YouTube URL to embed URL
const convertToEmbedUrl = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
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

    setLoading(true); // Start loading
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
      setLoading(false); // End loading
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setEmbeddedUrl(video.embeddedUrl);
    toast.success("Editing podcast video...");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        {editingVideo ? "Edit Podcast Video" : "Add Podcast Video"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="YouTube URL"
          value={embeddedUrl}
          onChange={(e) => setEmbeddedUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Podcast Videos</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-100 p-3 rounded shadow">
              <iframe
                src={video.embeddedUrl}
                title={video.title}
                className="w-full h-48 mb-2"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <h4 className="font-medium">{video.title}</h4>
              <button
                className="text-blue-600 text-sm underline mt-2"
                onClick={() => handleEdit(video)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastVideoManager;
