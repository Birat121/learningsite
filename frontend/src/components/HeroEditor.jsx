import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

const AdminHeroEditor = () => {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: null,
    preview: ''
  });

  useEffect(() => {
    axiosInstance.get('/hero').then((res) => {
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

    await axiosInstance.put('/hero', data);
    alert('Hero updated!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Hero Title"
        className="w-full p-2 border"
      />
      <input
        name="subtitle"
        value={form.subtitle}
        onChange={handleChange}
        placeholder="Hero Subtitle"
        className="w-full p-2 border"
      />
      <input type="file" name="image" accept="image/*" onChange={handleChange} />

      {form.preview && (
        <img src={form.preview} alt="Preview" className="w-64 h-auto rounded shadow" />
      )}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2">
        Save Hero Section
      </button>
    </form>
  );
};

export default AdminHeroEditor;
