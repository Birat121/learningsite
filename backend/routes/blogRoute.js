import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';



import multer from 'multer';
const storage = multer.memoryStorage(); // Store file in memory for Cloudinary streaming
const upload = multer({ storage });

const router = express.Router();

router.post('/blogs',upload.single('image'), createBlog); // Create blog
router.get('/blogs', getAllBlogs); // Get all blogs
router.get('/blogs/:slug', getBlogBySlug); // Get a single blog by slug
router.put('/blogs/:slug', updateBlog); // Update blog by slug
router.delete('/blogs/:slug', deleteBlog); // Delete blog by slug

export default router;

