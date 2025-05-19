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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center">📝 Create Blog</h2>

        {/* Inline loading indicator at top */}
        {isSubmitting && (
          <div className="mb-4 flex items-center space-x-2">
            <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6 animate-spin"></div>
            <span className="text-blue-600 font-medium">Adding Blog...</span>
          </div>
        )}

        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            placeholder="Write your blog description here..."
            className="border p-4 rounded"
            readOnly={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Publish Blog
        </button>
      </form>

      {/* Loader CSS */}
      <style>{`
        .loader {
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlogForm;

