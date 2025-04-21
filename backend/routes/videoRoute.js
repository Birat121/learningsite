import express from 'express';
import multer from 'multer';
import { createVideo, getVideo, updateVideo, deleteVideo, getAllVideos,getEnrolledVideos } from '../controllers/trainingVideoController.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage(); // Files are stored in memory
const upload = multer({ storage: storage }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// Routes for video operations
router.post('/videos', upload, createVideo); // Create video
router.get('/videos', getAllVideos); // Get all videos
router.get('/videos/:id', getVideo); // Get video by ID
router.put('/videos/:id', upload, updateVideo); // Update video
router.delete('/videos/:id', deleteVideo); // Delete video

router.get('/videos/enrolled', getEnrolledVideos);

export default router;
