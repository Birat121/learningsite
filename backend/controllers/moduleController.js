import Module from "../models/Module.js";
import Course from "../models/course.js";
import mongoose from "mongoose";

// controllers/moduleController.js
export const createModule = async (req, res) => {
  try {
    const { title, course } = req.body;

    // Validate inputs
    if (!title || !course) {
      return res
        .status(400)
        .json({ message: "Module title and course ID are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({ message: "Invalid course ID format." });
    }
    // Check if course ID is valid
    const existingCourse = await Course.findById(course);
    if (!existingCourse) {
      return res
        .status(404)
        .json({ message: "Course not found with the provided ID." });
    }

    // Create and save module
    const newModule = new Module({ title, course });
    const savedModule = await newModule.save();

    // Add reference to course
    existingCourse.modules.push(savedModule._id);
    await existingCourse.save();

    res.status(201).json(savedModule);
  } catch (error) {
    console.error("Error creating module:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getModules = async (req, res) => {
  try {
    const { courseId } = req.query;

    const filter = courseId ? { course: courseId } : {};
    const modules = await Module.find(filter).populate("course", "title");

    res.status(200).json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate("course", "title")
      .populate("videos"); // 👈 Add this line

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json(module);
  } catch (error) {
    console.error("Error fetching module:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateModule = async (req, res) => {
  try {
    const { title, course } = req.body;

    // Update the module
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { title, course },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    // If course changed, update the course modules array
    if (course) {
      // Remove from old course modules array
      await Course.updateMany(
        { modules: updatedModule._id, _id: { $ne: course } },
        { $pull: { modules: updatedModule._id } }
      );

      // Add to new course modules array
      await Course.findByIdAndUpdate(course, {
        $addToSet: { modules: updatedModule._id },
      });
    }

    res.status(200).json(updatedModule);
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);

    if (!deletedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Remove module from the course's modules array
    await Course.findByIdAndUpdate(deletedModule.course, {
      $pull: { modules: deletedModule._id },
    });

    res.status(200).json({ message: "Module deleted" });
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ message: "Server error" });
  }
};
