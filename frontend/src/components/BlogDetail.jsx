import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // assuming you're using react-router
import axiosInstance from '../api/axiosInstance';

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const res = await axiosInstance.get(`/blogs/blogs/${blogId}`); // Update with your actual endpoint
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading blog...</p>;
  if (!blog) return <p className="text-center py-10 text-red-500">Blog not found.</p>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-[rgb(0,104,80)] mb-6">{blog.title}</h1>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full max-h-[400px] object-cover rounded-xl mb-6"
        />
      )}

      <div className="flex items-center mb-6">
        {blog.authorImage && (
          <img
            src={blog.authorImage}
            alt={blog.author}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        )}
        <div>
          <p className="font-semibold text-gray-800">{blog.author}</p>
          <p className="text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="prose max-w-none prose-lg text-gray-700">
        {/* Supports HTML descriptions; if plain text, use <p>{blog.description}</p> */}
        <div dangerouslySetInnerHTML={{ __html: blog.description }} />
      </div>
    </section>
  );
};

export default BlogDetail;
