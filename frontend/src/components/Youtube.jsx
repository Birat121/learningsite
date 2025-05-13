import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-hot-toast';

const PodcastVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [embeddedUrl, setEmbeddedUrl] = useState('');

  const fetchVideos = async () => {
    try {
      const res = await axiosInstance.get('/youtube/get');
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching podcast videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !embeddedUrl) return toast.error('Please fill in all fields.');

    try {
      if (editingVideo) {
        await axiosInstance.put(`/youtube/update/${editingVideo._id}`, { title, embeddedUrl });
      } else {
        await axiosInstance.post('/youtube/add', { title, embeddedUrl });
      }
      setTitle('');
      setEmbeddedUrl('');
      setEditingVideo(null);
      fetchVideos();
    } catch (err) {
      console.error('Error saving video:', err);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setEmbeddedUrl(video.embeddedUrl);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        {editingVideo ? 'Edit Podcast Video' : 'Add Podcast Video'}
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
          placeholder="YouTube Embed URL"
          value={embeddedUrl}
          onChange={(e) => setEmbeddedUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-3">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editingVideo ? 'Update' : 'Add'}
          </button>
          {editingVideo && (
            <button
              type="button"
              onClick={() => {
                setEditingVideo(null);
                setTitle('');
                setEmbeddedUrl('');
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
