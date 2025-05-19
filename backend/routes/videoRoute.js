import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createVideo,
  getAllVideos,
  getVideoByIdOrSlug,
  updateVideo,
  deleteVideo,
} from "../controllers/trainingVideoController.js";

const videoRouter = express.Router();

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

const upload = multer({ storage });

videoRouter.post("/videos", upload.single("video"), createVideo);
videoRouter.get("/videos", getAllVideos);
videoRouter.get("/videos/:idOrSlug", getVideoByIdOrSlug);
videoRouter.put("/videos/:id", upload.single("video"), updateVideo);
videoRouter.delete("/videos/:id", deleteVideo);

export default videoRouter;




