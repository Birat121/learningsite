import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createVideo,
  getAllVideos,
  getVideoByIdOrSlug,
  updateVideo,
  deleteVideo,
} from "../controllers/vimeoVideo.js";

const videoRouter = express.Router();

// Multer disk storage for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/videos";
    // Ensure directory exists
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to avoid weird characters
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${timestamp}-${baseName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5 GB
  },
}).fields([{ name: "video", maxCount: 1 }]);

// Routes
videoRouter.post("/videos", upload, createVideo);
videoRouter.get("/videos", getAllVideos);
videoRouter.get("/videos/:idOrSlug", getVideoByIdOrSlug);
videoRouter.put("/videos/:id", upload, updateVideo);
videoRouter.delete("/videos/:id", deleteVideo);

export default videoRouter;
