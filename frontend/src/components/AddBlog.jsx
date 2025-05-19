import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ⬅️ for loading dialog

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
    setFormData(prev => ({
      ...prev,
      description: content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // show dialog

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('author', formData.author);
      payload.append('description', formData.description);
      if (image) payload.append('image', image);

      await axiosInstance.post('/blogs/blogs', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Blog created successfully');
      setFormData({ title: '', author: '', description: '' });
      setImage(null);
      setEditorContent('');
    } catch (err) {
      toast.error('Failed to create blog');
    } finally {
      setIsSubmitting(false); // hide dialog
    }
  };

  return (
    <div className="relative">
      {/* Overlay Modal */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <div className="text-lg font-semibold mb-2">Adding Blog...</div>
            <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin mx-auto"></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 relative z-10">
        <h2 className="text-2xl font-bold text-center">📝 Create Blog</h2>

        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            placeholder="Write your blog description here..."
            className="border p-4 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
