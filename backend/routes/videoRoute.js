import express from "express";
import multer from "multer";
import {
  createVideo,
  getAllVideos,
  getVideoByIdOrSlug,
  updateVideo,
  deleteVideo,
} from '../controllers/trainingVideoController.js';

const videoRouter = express.Router();

// Multer memory storage for buffer upload (required for Cloudinary stream upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
}).fields([
  { name: "video", maxCount: 1 },
  
]);

// Routes

// Create video with video upload
videoRouter.post("/videos", upload, createVideo);

// Get all videos, optionally filtered by module
videoRouter.get("/videos", getAllVideos);

// Get single video by ID or slug
videoRouter.get("/videos/:idOrSlug", getVideoByIdOrSlug);

// Update video details, optionally replace video file
videoRouter.put("/videos/:id", upload, updateVideo);

// Delete video
videoRouter.delete("/videos:id", deleteVideo);

export default videoRouter;

