import Video from "../models/videoModel.js";
import { uploadToVimeo, deleteFromVimeo } from "../utils/vimeoUpload.js";

// Create a video
export const createVideo = async (req, res) => {
  try {
    const { title, description, module } = req.body;
    const filePath = req.file.path;

    const vimeoId = await uploadToVimeo(filePath, title, description);
    const videoUrl = `https://player.vimeo.com/video/${vimeoId}`;

    // Delete local file
    fs.unlinkSync(filePath);

    const newVideo = await Video.create({
      title,
      videoUrl,
      videoPublicId: vimeoId,
      module,
    });

    res.status(201).json(newVideo);
  } catch (err) {
    console.error("Create Video Error:", err);
    res.status(500).json({ message: "Failed to upload and save video." });
  }
};

// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("module");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos" });
  }
};

// Get single video by ID or slug
export const getVideoByIdOrSlug = async (req, res) => {
  const { idOrSlug } = req.params;
  try {
    const video = await Video.findOne(
      mongoose.Types.ObjectId.isValid(idOrSlug)
        ? { _id: idOrSlug }
        : { slug: idOrSlug }
    ).populate("module");

    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving video" });
  }
};

// Update a video
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, module } = req.body;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (req.file) {
      // Delete old Vimeo video
      await deleteFromVimeo(video.videoPublicId);

      // Upload new video
      const vimeoId = await uploadToVimeo(req.file.path, title, description);
      const videoUrl = `https://player.vimeo.com/video/${vimeoId}`;

      // Delete local file
      fs.unlinkSync(req.file.path);

      video.videoPublicId = vimeoId;
      video.videoUrl = videoUrl;
    }

    video.title = title || video.title;
    video.module = module || video.module;

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Failed to update video" });
  }
};

// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    await deleteFromVimeo(video.videoPublicId);
    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete video" });
  }
};
