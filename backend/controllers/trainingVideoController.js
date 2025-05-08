import cloudinary from '../utils/cloudinary.js';
import Video from '../models/videoModel.js';
import Enrollment from '../models/paymentModel.js';
import slugify from 'slugify';

// POST /videos - Create a video
// POST /videos - Create a video
export const createVideo = async (req, res) => {
  try {
    // Automatically generate a slug from the title
    const slug = slugify(req.body.title, { lower: true, strict: true });

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
       videoPublicId: videoResult.public_id,
      videoUrl: videoResult.secure_url,
thumbnailUrl: thumbnailResult.secure_url,

      thumbnailPublicId: thumbnailResult.public_id,
      slug: slug,  // Add the generated slug to the video
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
export const getVideoBySlug = async (req, res) => {
  try {
    const video = await Video.findOne({ slug: req.params.slug });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    // Add structured data for SEO if needed
    const jsonLd = {
      "@context": "http://schema.org",
      "@type": "VideoObject",
      "name": video.title,
      "description": video.description,
      "thumbnailUrl": video.thumbnailUrl,
      "uploadDate": video.createdAt,
      "contentUrl": video.videoUrl,
      "publisher": {
        "@type": "Organization",
        "name": "Your Platform Name",
        "logo": "https://yourdomain.com/logo.png"
      }
    };
    return res.json(video, jsonLd);
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

    // Update title if provided and generate a new slug
    if (req.body.title) {
      updatedData.title = req.body.title;
      updatedData.slug = slugify(req.body.title, { lower: true, strict: true }); // Generate new slug
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
  updatedData.videoUrl = videoResult.secure_url;
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
  updatedData.thumbnailUrl = thumbnailResult.secure_url;
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

    // Delete related enrollments from MongoDB
    await Enrollment.deleteMany({ video: video._id });

    return res.json({ message: 'Video and related enrollments deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



export const getEnrolledVideos = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate("video")
      .exec();

    const courses = enrollments
      .map((enrollment) => enrollment.video)
      .filter((video) => video !== null);  // Filter out deleted videos

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Fetching enrolled courses failed:", error);
    res.status(500).json({ message: "Server error while fetching courses" });
  }
};



import mongoose from 'mongoose';
const { Types } = mongoose;



export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    if (!slug || !userId) {
      console.warn("Missing slug or user ID", {
        slug,
        userId,
        cookies: req.cookies,
        headers: req.headers,
      });
      return res.status(400).json({ enrolled: false, error: "Missing slug or user ID" });
    }

    const course = Types.ObjectId.isValid(slug)
      ? await Video.findById(slug)
      : await Video.findOne({ slug });

    if (!course) {
      console.warn("Course not found for slug:", slug);
      return res.status(404).json({ enrolled: false, error: "Course not found" });
    }

    const isEnrolled = await Enrollment.exists({ user: userId, course: course._id });

    return res.status(200).json({ enrolled: Boolean(isEnrolled) });
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return res.status(500).json({ enrolled: false, error: "Internal server error" });
  }
};
