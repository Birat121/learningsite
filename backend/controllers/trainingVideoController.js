import Video from "../models/videoModel";

export const getTrainingVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};  

export const createTrainingVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl } = req.body;
    const video = new Video({ title, description, videoUrl, thumbnailUrl });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};  

export const updateTrainingVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl, thumbnailUrl } = req.body;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    video.title = title;
    video.description = description;
    video.videoUrl = videoUrl;
    video.thumbnailUrl = thumbnailUrl;
    await video.save();
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTrainingVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};  

export const getTrainingVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}