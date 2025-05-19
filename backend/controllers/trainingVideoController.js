import Video from "../models/videoModel.js";

import mongoose from "mongoose";

import Module from "../models/Module.js";

// Create video with Cloudinary upload (using buffer stream)
export const createVideo = async (req, res) => {
  try {
    console.log("📥 Incoming create video request");

    const { title, module, videoUrl } = req.body;

    if (!title || !module || !videoUrl) {
      return res.status(400).json({ error: "Title, module, and videoUrl are required" });
    }

    const video = new Video({
      title,
      videoUrl,
      module: new mongoose.Types.ObjectId(module),
    });

    await video.save();

    // Push video to module's videos array
    await Module.findByIdAndUpdate(
      module,
      { $push: { videos: video._id } },
      { new: true }
    );

    console.log("🎉 Video created:", video._id);
    res.status(201).json(video);
  } catch (error) {
    console.error("❌ Create video error:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get all videos (optionally filtered by module)
export const getAllVideos = async (req, res) => {
  try {
    const filter = {};
    if (req.query.module) {
      filter.module = req.query.module;
    }
    const videos = await Video.find(filter)
      .populate("module")
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get single video by ID or slug
export const getVideoByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let video;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      video = await Video.findById(idOrSlug).populate("module");
    } else {
      video = await Video.findOne({ slug: idOrSlug }).populate("module");
    }

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    console.error("Get video error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update video details and optionally replace video file
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, module, videoUrl } = req.body;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (title) video.title = title;
    if (module) video.module = new mongoose.Types.ObjectId(module);
    if (videoUrl) video.videoUrl = videoUrl;

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete video from DB and Cloudinary
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    await Video.findByIdAndDelete(id);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};