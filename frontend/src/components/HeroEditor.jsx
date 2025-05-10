import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const AdminHeroEditor = () => {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: null,
    preview: ''
  });

  useEffect(() => {
    axiosInstance.get('/hero/get').then((res) => {
      if (res.data) {
        setForm({
          title: res.data.title,
          subtitle: res.data.subtitle,
          image: null,
          preview: res.data.image
        });
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0], preview: URL.createObjectURL(files[0]) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append('title', form.title);
  data.append('subtitle', form.subtitle);
  if (form.image) data.append('image', form.image);

  try {
    await axiosInstance.put('/hero/update', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Hero section updated successfully');
  } catch (err) {
    toast.error('Failed to update hero section');
    console.error(err);
  }
};


  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Edit Hero Section
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Hero Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter the hero section title"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Hero Subtitle
          </label>
          <input
            id="subtitle"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Enter the hero section subtitle"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Hero Image
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:border-0 file:rounded-md file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>

        {form.preview && (
          <div className="space-y-2 text-center">
            <h4 className="text-sm font-medium text-gray-700">Image Preview</h4>
            <img
              src={form.preview}
              alt="Preview"
              className="mx-auto w-64 h-auto object-cover rounded-md shadow-md"
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Save Hero Section
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHeroEditor;

