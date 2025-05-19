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

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).fields([
  { name: "video", maxCount: 1 },  // <-- key changed here to "video"
]);


// Create video with video upload
videoRouter.post("/videos", upload, createVideo);

// Get all videos
videoRouter.get("/videos", getAllVideos);

// Get single video
videoRouter.get("/videos/:idOrSlug", getVideoByIdOrSlug);

// Update video with optional file
videoRouter.put("/videos/:id", upload, updateVideo);

// Delete video (fixed route)
videoRouter.delete("/videos/:id", deleteVideo);

export default videoRouter;


