import express from "express";
import { getAbout, updateAbout } from "../controllers/AboutController.js";
import { upload } from "../middleware/upload.js";

const AboutRouter = express.Router();

AboutRouter.get("/get", getAbout);
AboutRouter.put("/update", upload.single("image"), updateAbout);

export default AboutRouter;
