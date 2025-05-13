import React, { useEffect, useState } from 'react';
import VideoForm from './VideoForm';
import axiosInstance from '../api/axiosInstance';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      const res = await axiosInstance.get('/youtube');
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSave = async (video) => {
    try {
      if (editingVideo) {
        await axiosInstance.put(`/youtube/${editingVideo._id}`, video);
      } else {
        await API.post('/videos', video);
      }
      fetchVideos();
      setEditingVideo(null);
    } catch (err) {
      console.error('Error saving video:', err);
    }
  };

  return (
    <div className="p-6">
      <VideoForm
        selectedVideo={editingVideo}
        onSave={handleSave}
        onCancel={() => setEditingVideo(null)}
      />

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {videos.map((video) => (
          <div key={video._id} className="bg-white p-4 shadow rounded">
            <iframe
              src={video.embeddedUrl}
              title={video.title}
              className="w-full h-52 mb-3"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h3 className="font-semibold text-lg">{video.title}</h3>
            <button
              className="mt-2 text-sm text-blue-600 underline"
              onClick={() => setEditingVideo(video)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
