import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';

const router = express.Router();

router.post('/blogs', createBlog); // Create blog
router.get('/blogs', getAllBlogs); // Get all blogs
router.get('/blogs/:slug', getBlogBySlug); // Get a single blog by slug
router.put('/blogs/:slug', updateBlog); // Update blog by slug
router.delete('/blogs/:slug', deleteBlog); // Delete blog by slug

export default router;

