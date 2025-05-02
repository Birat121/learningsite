import express from 'express';
import multer from 'multer';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';

const blogRouter = express.Router();

// Multer setup (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
blogRouter.post('/blogs', upload.single('image'), createBlog);
blogRouter.get('/blogs', getAllBlogs);
blogRouter.get('/blogs/:id', getBlogById);
blogRouter.put('/blogs/:id', upload.single('image'), updateBlog);
blogRouter.delete('/blogs/:id', deleteBlog);

export default blogRouter;
