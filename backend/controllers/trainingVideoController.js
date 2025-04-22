import cloudinary from '../utils/cloudinary.js';
import Video from '../models/videoModel.js';
import Payment from '../models/paymentModel.js';

// POST /videos - Create a video
export const createVideo = async (req, res) => {
  try {
    // Upload video to Cloudinary
    const videoResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        (error, video) => {
          if (error) reject(error);
          resolve(video);
        }
      ).end(req.files.video[0].buffer); // Assuming video is uploaded via req.files.video
    });

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, thumbnail) => {
          if (error) reject(error);
          resolve(thumbnail);
        }
      ).end(req.files.thumbnail[0].buffer); // Assuming thumbnail is uploaded via req.files.thumbnail
    });

    // Create a new video record
    const newVideo = new Video({
      title: req.body.title,
      description: req.body.description,
      courseOutcome: req.body.courseOutcome,
      price: req.body.price,
      videoUrl: videoResult.url,
      videoPublicId: videoResult.public_id,
      thumbnailUrl: thumbnailResult.url,
      thumbnailPublicId: thumbnailResult.public_id,
    });

    await newVideo.save();
    return res.status(201).json(newVideo);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }); // newest first
    return res.json(videos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /videos/:id - Fetch a video by ID
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    return res.json(video);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /videos/:id - Update a video
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const updatedData = {};

    // Update title if provided
    if (req.body.title) {
      updatedData.title = req.body.title;
    }

    // Update price if provided
    if (req.body.price) {
      updatedData.price = req.body.price;
    }

    // Update description if provided
    if (req.body.description) {
      updatedData.description = req.body.description;
    }

    // Update courseOutcome if provided
    if (req.body.courseOutcome) {
      updatedData.courseOutcome = req.body.courseOutcome;
    }

    // Upload new video if present
    if (req.files && req.files.video) {
      const videoResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'video' },
          (error, video) => {
            if (error) reject(error);
            resolve(video);
          }
        ).end(req.files.video[0].buffer);
      });
      updatedData.videoUrl = videoResult.url;
      updatedData.videoPublicId = videoResult.public_id;
    }

    // Upload new thumbnail if present
    if (req.files && req.files.thumbnail) {
      const thumbnailResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, thumbnail) => {
            if (error) reject(error);
            resolve(thumbnail);
          }
        ).end(req.files.thumbnail[0].buffer);
      });
      updatedData.thumbnailUrl = thumbnailResult.url;
      updatedData.thumbnailPublicId = thumbnailResult.public_id;
    }

    // Update the video in the database with the new data
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    return res.json(updatedVideo);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// DELETE /videos/:id - Delete a video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    // Delete video and thumbnail from Cloudinary
    await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: 'video' });
    await cloudinary.uploader.destroy(video.thumbnailPublicId, { resource_type: 'image' });

    // Delete video record from MongoDB
    await Video.findByIdAndDelete(req.params.id);

    return res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getEnrolledVideos = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ userId, status: "success" }).populate("courseId");

    const courses = payments.map((payment) => payment.courseId);

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Fetching enrolled courses failed:", error);
    res.status(500).json({ message: "Server error while fetching courses" });
  }
};

export const postEnrolledVideo = async (req, res) => {
  try {
    const { courseId, method, status } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Video.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Prevent duplicate enrollments
    const alreadyEnrolled = await Payment.findOne({
      userId,
      courseId,
      status: "success",
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Save payment/enrollment
    const payment = new Payment({
      userId,
      courseId,
      method: method || "paypal", // default to paypal
      status: status || "success", // assume payment went through
    });

    await payment.save();

    res.status(201).json({ message: "Enrollment successful", payment });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Server error during enrollment" });
  }
};