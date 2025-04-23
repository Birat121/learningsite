import express from 'express';
import multer from 'multer';
import { createVideo, getVideoBySlug, updateVideo, deleteVideo, getAllVideos,getEnrolledVideos,postEnrolledVideo } from '../controllers/trainingVideoController.js';
import { adminAuth } from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage(); // Files are stored in memory
const upload = multer({ storage: storage }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

router.post('/videos',adminAuth, upload, createVideo);
router.get('/videos', getAllVideos);
router.get('/videos/slug/:slug', getVideoBySlug); // Prevents slug/id conflict
router.put('/videos/:id',adminAuth, upload, updateVideo);
router.delete('/videos/:id',adminAuth,  deleteVideo);

// Enrollment
router.get('/videos/enrolled', authMiddleware, getEnrolledVideos);
router.post('/videos/enrolled', authMiddleware, postEnrolledVideo);


export default router;
