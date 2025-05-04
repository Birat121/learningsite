import Blog from '../models/blogModel.js';
import cloudinary from '../utils/cloudinary.js';
import slugify from 'slugify';


// CREATE
export const createBlog = async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const imageBuffer = req.file?.buffer;

    let imageUrl = '';
    let publicId = '';
    const slug = slugify(title, { lower: true, strict: true });

    const finalizeCreate = async () => {
      const blog = await Blog.create({
        title,
        slug,
        description,
        author,
        image: imageUrl,
        imagePublicId: publicId,
      });
      res.status(201).json(blog);
    };

    if (imageBuffer) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'blogs' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(imageBuffer);
      });

      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    await finalizeCreate();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create blog.' });
  }
};


// GET ALL
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs.' });
  }
};

// GET ONE (by slug)
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

// UPDATE (by slug)
export const updateBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, author } = req.body;

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: 'Not found' });

    // Handle image replacement
    if (req.file) {
      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'blogs' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      blog.image = result.secure_url;
      blog.imagePublicId = result.public_id;
    }

    blog.title = title;
    blog.slug = slugify(title, { lower: true, strict: true }); // Update slug
    blog.description = description;
    blog.author = author;

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog.' });
  }
};


// DELETE (by slug)
export const deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: 'Not found' });

    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog.' });
  }
};
