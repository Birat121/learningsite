import Video from "../models/videoModel.js";
import Module from "../models/Module.js";
import mongoose from "mongoose";

// Helper to extract Vimeo ID from URL
const extractVimeoId = (url) => {
  const regex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Create Vimeo Video (by URL)
export const createVideo = async (req, res) => {
  try {
    const { title, module, videoUrl } = req.body;

    // Validate module existence
    const foundModule = await Module.findById(module);
    if (!foundModule) return res.status(404).json({ error: "Module not found" });

    // Validate Vimeo URL and extract ID
    const vimeoId = extractVimeoId(videoUrl);
    if (!vimeoId) return res.status(400).json({ error: "Invalid Vimeo URL" });

    const embedUrl = `https://player.vimeo.com/video/${vimeoId}`;

    // Create and save video
    const video = new Video({
      title,
      videoUrl: embedUrl,
      vimeoId,
      module: new mongoose.Types.ObjectId(module),
    });

    await video.save();

    // Link video to module
    await Module.findByIdAndUpdate(module, { $addToSet: { videos: video._id } });

    res.status(201).json(video);
  } catch (error) {
    console.error("Create video error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all videos (optionally filter by module)
export const getAllVideos = async (req, res) => {
  try {
    const filter = {};
    if (req.query.module) filter.module = req.query.module;

    const videos = await Video.find(filter).populate("module").sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Get videos error:", error);
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

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.json(video);
  } catch (error) {
    console.error("Get video error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update video by ID (title, module, or URL)
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, module, videoUrl } = req.body;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (title) video.title = title;

    if (module && module !== video.module.toString()) {
      const foundModule = await Module.findById(module);
      if (!foundModule) return res.status(404).json({ error: "Module not found" });

      // Remove from old module
      await Module.findByIdAndUpdate(video.module, { $pull: { videos: video._id } });
      // Add to new module
      await Module.findByIdAndUpdate(module, { $addToSet: { videos: video._id } });

      video.module = new mongoose.Types.ObjectId(module);
    }

    if (videoUrl) {
      const vimeoId = extractVimeoId(videoUrl);
      if (!vimeoId) return res.status(400).json({ error: "Invalid Vimeo URL" });

      video.vimeoId = vimeoId;
      video.videoUrl = `https://player.vimeo.com/video/${vimeoId}`;
    }

    await video.save();
    const updatedVideo = await Video.findById(id).populate("module");
    res.json(updatedVideo);
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete video by ID
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Remove video ref from module
    await Module.findByIdAndUpdate(video.module, { $pull: { videos: video._id } });

    // Delete video document
    await Video.findByIdAndDelete(id);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  createVideo,
  getAllVideos,
  getVideoByIdOrSlug,
  updateVideo,
  deleteVideo,
};