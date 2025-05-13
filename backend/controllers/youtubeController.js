import youtube from "../models/youtube.js";

// Add a new video
export async function addVideo(req, res) {
  const { title, embeddedUrl } = req.body;
  try {
    const newVideo = new youtube({ title, embeddedUrl });
    const saved = await newVideo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save video', error: err });
  }
}

// Get all videos
export async function getVideos(req, res) {
  try {
    const videos = await youtube.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch videos', error: err });
  }
}

// Update a video
export async function updateVideo(req, res) {
  const { id } = req.params;
  const { title, embeddedUrl } = req.body;
  try {
    const updated = await youtube.findByIdAndUpdate(
      id,
      { title, embeddedUrl },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Video not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err });
  }
}

export default { addVideo, getVideos, updateVideo };
