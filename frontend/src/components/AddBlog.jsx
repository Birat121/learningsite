import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
  });
  const [image, setImage] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData(prev => ({ ...prev, description: html }));
    },
  });

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
      payload.append('description', formData.description);
      payload.append('author', formData.author);
      if (image) payload.append('image', image);

      await axiosInstance.post('/blogs/blogs', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Blog created successfully');
      setFormData({ title: '', author: '', description: '' });
      setImage(null);
      editor.commands.clearContent();
    } catch (err) {
      console.error('Error creating blog:', err.response?.data || err.message);
      toast.error('Failed to create blog');
    }
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
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Description</label>
          <div className="border rounded-lg p-3 min-h-[200px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
            className="w-full px-4 py-3 border rounded-lg"
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
    </div>
  );
};

export default BlogForm;
