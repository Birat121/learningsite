import Course from "../models/course.js";
import cloudinary from "../utils/cloudinary.js";
import Enrollment from "../models/paymentModel.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, courseOutcome, price } = req.body;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "image" }, (err, image) => {
        if (err) reject(err);
        else resolve(image);
      }).end(req.files.thumbnail[0].buffer);
    });

    const course = new Course({
      title,
      description,
      courseOutcome,
      price,
      thumbnailUrl: result.secure_url,
      thumbnailPublicId: result.public_id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, courseOutcome, price } = req.body;
    const file = req.file;
    const slug = req.params.slug;

    const course = await Course.findOne({ slug });
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.courseOutcome = courseOutcome ? JSON.parse(courseOutcome) : course.courseOutcome;
    course.price = price || course.price;

    // Replace thumbnail if a new one is provided
    if (file) {
      // Delete old thumbnail
      await cloudinary.uploader.destroy(course.thumbnailPublicId);

      // Upload new thumbnail
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "course_thumbnails"
      });

      course.thumbnailUrl = result.secure_url;
      course.thumbnailPublicId = result.public_id;
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    await cloudinary.uploader.destroy(course.thumbnailPublicId);
    await course.deleteOne();

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ user: userId }).populate("course");

    const courses = enrollments
      .map((enrollment) => enrollment.course)
      .filter((course) => course !== null); // Remove if course was deleted

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Fetching enrolled courses failed:", error);
    res.status(500).json({ message: "Server error while fetching enrolled courses" });
  }
};



import mongoose from "mongoose";
const { Types } = mongoose;

export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    if (!slug || !userId) {
      return res.status(400).json({ enrolled: false, error: "Missing slug or user ID" });
    }

    const course = Types.ObjectId.isValid(slug)
      ? await Course.findById(slug)
      : await Course.findOne({ slug });

    if (!course) {
      return res.status(404).json({ enrolled: false, error: "Course not found" });
    }

    const isEnrolled = await Enrollment.exists({ user: userId, course: course._id });

    return res.status(200).json({ enrolled: Boolean(isEnrolled) });
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return res.status(500).json({ enrolled: false, error: "Internal server error" });
  }
};


