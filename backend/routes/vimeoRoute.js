import express from "express";
import {
  createVideo,
  getAllVideos,
  getVideoByIdOrSlug,
  updateVideo,
  deleteVideo,
} from "../controllers/vimeoVideo.js";

const vimeoRouter = express.Router();

vimeoRouter.post("/create", createVideo);
vimeoRouter.get("/get", getAllVideos);
vimeoRouter.get("/get:idOrSlug", getVideoByIdOrSlug);
vimeoRouter.put("/update/:id", updateVideo);
vimeoRouter.delete("/delete/:id", deleteVideo);

export default vimeoRouter;
