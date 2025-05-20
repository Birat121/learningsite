import Video from "../models/videoModel.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import Module from "../models/Module.js";
import fs from "fs";

// Upload video to Cloudinary (small or large)
export const uploadVideo = async (filePath) => {
  const { size } = fs.statSync(filePath);

  const uploadOptions = {
    resource_type: "video",
    folder: "course_videos",
  };

  if (size > 100 * 1024 * 1024) {
    uploadOptions.chunk_size = 20 * 1024 * 1024;
  }

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      if (size <= 100 * 1024 * 1024) {
        return await cloudinary.uploader.upload(filePath, uploadOptions);
      } else {
        return await cloudinary.uploader.upload_large(filePath, uploadOptions);
      }
    } catch (err) {
      attempt++;
      console.error(`Upload attempt ${attempt} failed:`, err.message);
      if (attempt === maxRetries) {
        throw err;
      }
      // Optional: wait some time before retrying
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, module } = req.body;
    const videoFile = req.files?.video?.[0];

    if (!videoFile) {
      console.error("❌ createVideo: No video file provided");
      return res.status(400).json({ error: "Video file is required" });
    }

    const foundModule = await Module.findById(module);
    if (!foundModule) {
      console.error(`❌ createVideo: Module not found with id: ${module}`);
      return res.status(404).json({ error: "Module not found" });
    }

    const filePath = videoFile.path;

    // Upload to Cloudinary
    const result = await uploadVideo(filePath);

    // Delete local file safely
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const video = new Video({
      title,
      videoUrl: result.secure_url,
      videoPublicId: result.public_id,
      module: new mongoose.Types.ObjectId(module),
    });

    await video.save();

    await Module.findByIdAndUpdate(module, {
      $addToSet: { videos: video._id },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error("❌ Video upload failed:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
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
    console.error("❌ getAllVideos failed:", error);
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
      console.error(
        `❌ getVideoByIdOrSlug: Video not found with idOrSlug: ${idOrSlug}`
      );
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    console.error("❌ Get video error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update video details (title, module, or file)
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, module } = req.body;
    const videoFile = req.files?.video?.[0];

    const video = await Video.findById(id);
    if (!video) {
      console.error(`❌ updateVideo: Video not found with id: ${id}`);
      return res.status(404).json({ error: "Video not found" });
    }

    if (videoFile) {
      // Delete old Cloudinary video
      await cloudinary.uploader.destroy(video.videoPublicId, {
        resource_type: "video",
      });

      const filePath = videoFile.path;
      const result = await uploadVideo(filePath);

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      video.videoUrl = result.secure_url;
      video.videoPublicId = result.public_id;
    }

    if (title) video.title = title;

    if (module && video.module.toString() !== module) {
      const foundModule = await Module.findById(module);
      if (!foundModule) {
        console.error(
          `❌ updateVideo: New module not found with id: ${module}`
        );
        return res.status(404).json({ error: "New module not found" });
      }

      // Remove from old module, add to new
      await Module.findByIdAndUpdate(video.module, {
        $pull: { videos: video._id },
      });

      await Module.findByIdAndUpdate(module, {
        $addToSet: { videos: video._id },
      });

      video.module = new mongoose.Types.ObjectId(module);
    }

    await video.save();

    const updated = await Video.findById(video._id).populate("module");
    res.json(updated);
  } catch (error) {
    console.error("❌ Video update failed:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete video from DB and Cloudinary
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      console.error(`❌ deleteVideo: Video not found with id: ${id}`);
      return res.status(404).json({ error: "Video not found" });
    }

    await cloudinary.uploader.destroy(video.videoPublicId, {
      resource_type: "video",
    });

    await Module.findByIdAndUpdate(video.module, {
      $pull: { videos: video._id },
    });

    await Video.findByIdAndDelete(id);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("❌ Video deletion failed:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    res.status(500).json({ error: error.message });
  }
};
