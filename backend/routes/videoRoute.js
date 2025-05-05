import express from 'express';
import multer from 'multer';
import { createVideo, getVideoBySlug, updateVideo, deleteVideo, getAllVideos,getEnrolledVideos,checkEnrollmentStatus} from '../controllers/trainingVideoController.js';

import  authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage(); // Files are stored in memory
const upload = multer({ storage: storage }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

router.post('/videos', upload, createVideo);
router.get('/videos', getAllVideos);
router.get('/videos/slug/:slug', getVideoBySlug); // Prevents slug/id conflict
router.put('/videos/:id', upload, updateVideo);
router.delete('/videos/:id',  deleteVideo);

// Enrollment
router.get('/enrolled', authMiddleware, getEnrolledVideos);
router.get('/enrolled/:slug', authMiddleware, checkEnrollmentStatus);




export default router;
