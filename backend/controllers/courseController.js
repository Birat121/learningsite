import Course from "../models/course.js";
import Module from "../models/Module.js";
import Video from "../models/videoModel.js";
import cloudinary from "../utils/cloudinary.js";
import Enrollment from "../models/paymentModel.js";
import mongoose from "mongoose";
import slugify from "slugify";
import User from "../models/userModel.js";

const { Types } = mongoose;

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, published, modules } = req.body;

    // Slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Upload thumbnail to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (err, image) => {
          if (err) reject(err);
          else resolve(image);
        })
        .end(req.files.thumbnail[0].buffer);
    });

    // 1. Create course without modules yet
    const course = new Course({
      title,
      slug,
      description,
      price,
      published: published ?? false,
      thumbnailUrl: result.secure_url,
      thumbnailPublicId: result.public_id,
    });

    await course.save();

    // 2. Save modules with course._id reference
    let savedModules = [];
    if (modules && Array.isArray(modules)) {
      savedModules = await Promise.all(
        modules.map(async (mod) => {
          const newModule = new Module({
            title: mod.title,
            course: course._id,
            videos: mod.videos || [],
          });
          return await newModule.save();
        })
      );
    }

    // 3. Update course with module IDs
    course.modules = savedModules.map((m) => m._id);
    await course.save();

    res.status(201).json({ course, modules: savedModules });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create course: " + error.message });
  }
};

// Get all courses with optional search
export const getAllCourses = async (req, res) => {
  try {
    const search = req.query.search || "";

    const courses = await Course.find({
      title: { $regex: search, $options: "i" },
    })
      .populate({
        path: "modules",
        populate: {
          path: "videos",
        },
      })
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch courses: " + error.message });
  }
};

// Get single course by slug
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate({
      path: "modules",
      populate: {
        path: "videos",
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Error fetching course: " + error.message });
  }
};

// Update course by slug
export const updateCourse = async (req, res) => {
  try {
    const { title, description, price, published } = req.body;
    const file = req.file;
    const slug = req.params.slug;

    const course = await Course.findOne({ slug });
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price ?? course.price;
    course.published = published ?? course.published;

    if (title) {
      course.slug = slugify(title, { lower: true, strict: true });
    }

    if (file) {
      await cloudinary.uploader.destroy(course.thumbnailPublicId);

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "course_thumbnails",
      });

      course.thumbnailUrl = result.secure_url;
      course.thumbnailPublicId = result.public_id;
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Error updating course: " + error.message });
  }
};

// Delete course by ID (and cleanup modules/videos)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Delete thumbnail from Cloudinary
    await cloudinary.uploader.destroy(course.thumbnailPublicId);

    // Delete modules and videos
    if (course.modules?.length) {
      for (const moduleId of course.modules) {
        const module = await Module.findById(moduleId);
        if (module?.videos?.length) {
          for (const videoId of module.videos) {
            await Video.findByIdAndDelete(videoId);
          }
        }
        await Module.findByIdAndDelete(moduleId);
      }
    }

    // Remove course from users' enrolledCourses (or any other user field)
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );

    // ✅ Delete enrollments related to this course
    await Enrollment.deleteMany({ course: course._id });

    await course.deleteOne();

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting course: " + error.message });
  }
};

export const getModulesByCourseId = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: "modules",
      populate: {
        path: "videos",
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course.modules);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch modules: " + error.message });
  }
};

// Get enrolled courses for a user
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({
      user: userId,
      status: { $in: ["completed", "pending"] }, // Temporarily allow pending
    }).populate("course");

    const courses = enrollments
      .map((enrollment) => enrollment.course)
      .filter((course) => course !== null);

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Fetching enrolled courses failed:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching enrolled courses" });
  }
};

// Check if a user is enrolled in a course

export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    if (!slug || !userId) {
      return res
        .status(400)
        .json({ enrolled: false, error: "Missing slug or user ID" });
    }

    const course = Types.ObjectId.isValid(slug)
      ? await Course.findById(slug)
      : await Course.findOne({ slug });

    if (!course) {
      return res
        .status(404)
        .json({ enrolled: false, error: "Course not found" });
    }

    const isEnrolled = await Enrollment.exists({
      user: userId,
      course: course._id,
      status: "completed", // Only allow access if payment was completed
    });

    return res.status(200).json({ enrolled: Boolean(isEnrolled) });
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return res
      .status(500)
      .json({ enrolled: false, error: "Internal server error" });
  }
};
