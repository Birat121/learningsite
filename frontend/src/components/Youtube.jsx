import React, { useState, useEffect } from 'react';

const VideoForm = ({ selectedVideo, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [embeddedUrl, setEmbeddedUrl] = useState('');

  useEffect(() => {
    if (selectedVideo) {
      setTitle(selectedVideo.title);
      setEmbeddedUrl(selectedVideo.embeddedUrl);
    } else {
      setTitle('');
      setEmbeddedUrl('');
    }
  }, [selectedVideo]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !embeddedUrl) return;

  if (typeof onSave === 'function') {
    try {
      await onSave({ title, embeddedUrl });
      setTitle('');
      setEmbeddedUrl('');
    } catch (error) {
      console.error("Save failed:", error);
    }
  } else {
    console.error('onSave is not a function:', onSave);
  }
};


  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{selectedVideo ? 'Edit' : 'Add'} Video</h2>

      <input
        className="w-full p-2 mb-3 border rounded"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full p-2 mb-3 border rounded"
        placeholder="YouTube Embed URL"
        value={embeddedUrl}
        onChange={(e) => setEmbeddedUrl(e.target.value)}
      />

      <div className="flex justify-between">
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          {selectedVideo ? 'Update' : 'Add'}
        </button>
        {selectedVideo && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default VideoForm;
