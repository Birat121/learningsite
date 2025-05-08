import { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';  // import Draft.js components
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // initial empty editor state

  // Handle input changes for title and author
  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle changes in the Draft.js editor
  const handleEditorChange = (state) => {
    setEditorState(state);
    const description = state.getCurrentContent().getPlainText(); // convert content to plain text
    setFormData(prev => ({
      ...prev,
      description: description, // store plain text description
    }));
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setEditorState(EditorState.createEmpty());  // Reset editor
    } catch (err) {
      toast.error('Failed to create blog');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6">
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
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={(command) => RichUtils.handleKeyCommand(editorState, command)} // optional for command handling
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
      >
        Publish Blog
      </button>
    </form>
  );
};

export default BlogForm;
