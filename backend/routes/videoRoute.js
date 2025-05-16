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
  // Add other fields like thumbnail if needed:
  // { name: "thumbnail", maxCount: 1 },
]);

// Routes

// Create video with video upload
videoRouter.post("/", upload, createVideo);

// Get all videos, optionally filtered by module
videoRouter.get("/", getAllVideos);

// Get single video by ID or slug
videoRouter.get("/:idOrSlug", getVideoByIdOrSlug);

// Update video details, optionally replace video file
videoRouter.put("/:id", upload, updateVideo);

// Delete video
videoRouter.delete("/:id", deleteVideo);

export default videoRouter;

