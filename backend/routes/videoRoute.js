import express from "express";
import {
  createVideo,
  getAllVideos,
  getVideoByIdOrSlug,
  updateVideo,
  deleteVideo,
} from '../controllers/trainingVideoController.js';

const videoRouter = express.Router();

// Create video with external video URL (no upload)
videoRouter.post("/videos", createVideo);

// Get all videos
videoRouter.get("/videos", getAllVideos);

// Get single video
videoRouter.get("/videos/:idOrSlug", getVideoByIdOrSlug);

// Update video details, including videoUrl (no upload)
videoRouter.put("/videos/:id", updateVideo);

// Delete video
videoRouter.delete("/videos/:id", deleteVideo);

export default videoRouter;
