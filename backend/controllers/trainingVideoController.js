import Video from "../models/videoModel.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import Module from "../models/Module.js";
import fs from "fs";

// Helper function to upload large video using stream + Promise
export const uploadVideo = async (filePath) => {
  const { size } = fs.statSync(filePath); // size in bytes

  if (size <= 100 * 1024 * 1024) {
    // Small video (<=100MB)
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "course_videos",
    });
  } else {
    // Large video (>100MB)
    return await cloudinary.uploader.upload_large(filePath, {
      resource_type: "video",
      chunk_size: 20 * 1024 * 1024, // 20MB chunks
      folder: "course_videos",
    });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, module } = req.body;
    const videoFile = req.files?.video?.[0];

    if (!videoFile) {
      return res.status(400).json({ error: "Video file is required" });
    }

    const filePath = videoFile.path;

    // Upload large video with stream helper
    const result = await uploadVideo(filePath);

    // Delete local file after upload
    fs.unlinkSync(filePath);

    const video = new Video({
      title,
      videoUrl: result.secure_url,
      videoPublicId: result.public_id,
      module: new mongoose.Types.ObjectId(module),
    });

    await video.save();

    await Module.findByIdAndUpdate(module, {
      $push: { videos: video._id },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error("❌ Video upload failed:", error);
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
    const { title, module } = req.body;
    const videoFile = req.files?.video?.[0];

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (videoFile) {
      // Delete previous video from Cloudinary
      await cloudinary.uploader.destroy(video.videoPublicId, {
        resource_type: "video",
      });

      // Upload new video file stream to Cloudinary
      const filePath = videoFile.path;
      // const result = await uploadLargeVideo(filePath);
      const result = await uploadVideo(filePath);

      // Delete local temp file after upload
      fs.unlinkSync(filePath);

      video.videoUrl = result.secure_url;
      video.videoPublicId = result.public_id;
    }

    if (title) video.title = title;
    if (module) video.module = mongoose.Types.ObjectId(module);

    await video.save();
    res.json(video);
  } catch (error) {
    console.error("❌ Video update failed:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete video from DB and Cloudinary
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    await cloudinary.uploader.destroy(video.videoPublicId, {
      resource_type: "video",
    });
    await Video.findByIdAndDelete(id);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
