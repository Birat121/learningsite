import Video from "../models/videoModel.js";
import cloudinary from "../utils/cloudinary.js"; // your cloudinary config import
import mongoose from "mongoose";
import streamifier from "streamifier";

// Create video with Cloudinary upload (using buffer stream)
export const createVideo = async (req, res) => {
  try {
    const { title, module } = req.body;
    const videoFile = req.files?.video?.[0];

    if (!videoFile) {
      return res.status(400).json({ error: "Video file is required" });
    }

    // Upload video buffer stream to Cloudinary
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "course_videos" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(videoFile.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    const video = new Video({
      title,
      videoUrl: result.secure_url,
      videoPublicId: result.public_id,
      module: mongoose.Types.ObjectId(module),
    });

    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error("Create video error:", error);
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
    const videos = await Video.find(filter).populate("module").sort({ createdAt: -1 });
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

    // If new video file provided, delete old one and upload new one
    if (videoFile) {
      await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: "video" });

      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "video", folder: "course_videos" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(videoFile.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      video.videoUrl = result.secure_url;
      video.videoPublicId = result.public_id;
    }

    if (title) video.title = title;
    if (module) video.module = mongoose.Types.ObjectId(module);

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

    await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: "video" });
    await Video.findByIdAndDelete(id);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
