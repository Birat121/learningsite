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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="heading" value={form.heading} onChange={handleChange} placeholder="Heading" />
      <input name="subheading" value={form.subheading} onChange={handleChange} placeholder="Subheading" />
      <textarea name="paragraph1" value={form.paragraph1} onChange={handleChange} placeholder="Paragraph 1" />
      <textarea name="paragraph2" value={form.paragraph2} onChange={handleChange} placeholder="Paragraph 2" />
      <input type="file" name="image" onChange={handleFileChange} />
      <button type="submit">Update</button>
    </form>
  );
};

export default AdminIntroduction;
