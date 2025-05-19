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
} from "../controllers/trainingVideoController.js";

const videoRouter = express.Router();

// Disk storage for large video files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/videos";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage }).fields([
  { name: "video", maxCount: 1 },
]);

videoRouter.post("/videos", upload, createVideo);
videoRouter.get("/videos", getAllVideos);
videoRouter.get("/videos/:idOrSlug", getVideoByIdOrSlug);
videoRouter.put("/videos/:id", upload, updateVideo);
videoRouter.delete("/videos/:id", deleteVideo);

export default videoRouter;



