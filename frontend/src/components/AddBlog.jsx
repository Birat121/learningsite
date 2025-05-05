import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description); // Contains HTML
      payload.append('author', formData.author);
      if (image) payload.append('image', image);

      await axiosInstance.post('/blogs/blogs', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Blog created successfully');
      setFormData({ title: '', description: '', author: '' });
      setImage(null);
    } catch (err) {
      console.error('Error creating blog:', err.response?.data || err.message);
      toast.error('Failed to create blog');
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          📝 Create a New Blog Post
        </h2>

        <div>
          <label className="block text-lg font-medium mb-2">Blog Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Formatting Buttons */}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => applyFormat('bold')} className="btn">Bold</button>
          <button type="button" onClick={() => applyFormat('italic')} className="btn">Italic</button>
          <button type="button" onClick={() => applyFormat('underline')} className="btn">Underline</button>
          <button type="button" onClick={() => applyFormat('formatBlock', '<h1>')} className="btn">H1</button>
          <button type="button" onClick={() => applyFormat('formatBlock', '<h2>')} className="btn">H2</button>
          <button type="button" onClick={() => applyFormat('insertUnorderedList')} className="btn">Bullet List</button>
          <button type="button" onClick={() => applyFormat('insertOrderedList')} className="btn">Numbered List</button>
        </div>

        {/* Native Rich Text Editor */}
        <div>
          <label className="block text-lg font-medium mb-2">Description</label>
          <div
            contentEditable
            className="w-full min-h-[200px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onInput={(e) => setFormData(prev => ({ ...prev, description: e.currentTarget.innerHTML }))}
            dangerouslySetInnerHTML={{ __html: formData.description }}
          ></div>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-lg transition"
        >
          Publish Blog
        </button>
      </form>

      {/* Tailwind button style */}
      <style>{`
        .btn {
          padding: 6px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #f3f4f6;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .btn:hover {
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default BlogForm;
