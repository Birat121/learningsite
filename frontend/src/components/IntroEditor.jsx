import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AdminIntroduction = () => {
  const [form, setForm] = useState({
    heading: '',
    subheading: '',
    paragraph1: '',
    paragraph2: '',
    image: null,
  });

  useEffect(() => {
    axiosInstance.get('/intro/intro').then(res => {
      setForm(prev => ({ ...prev, ...res.data }));
    });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    await axiosInstance.put('/intro/intro', formData);
    toast.success('Introduction updated successfully');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Introduction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Heading</label>
          <input
            name="heading"
            value={form.heading}
            onChange={handleChange}
            placeholder="Heading"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Subheading</label>
          <input
            name="subheading"
            value={form.subheading}
            onChange={handleChange}
            placeholder="Subheading"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Paragraph 1</label>
          <textarea
            name="paragraph1"
            value={form.paragraph1}
            onChange={handleChange}
            placeholder="Paragraph 1"
            rows={4}
            className="w-full px-4 py-2 border rounded-md shadow-sm resize-y focus:outline-none focus:ring focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Paragraph 2</label>
          <textarea
            name="paragraph2"
            value={form.paragraph2}
            onChange={handleChange}
            placeholder="Paragraph 2"
            rows={4}
            className="w-full px-4 py-2 border rounded-md shadow-sm resize-y focus:outline-none focus:ring focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default AdminIntroduction;

