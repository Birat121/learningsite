import Module from "../models/Module.js"; // Adjust the path as needed

// Create a new module
export const createModule = async (req, res) => {
  try {
    const { title, course } = req.body;

    if (!title || !course) {
      return res.status(400).json({ message: "Title and course are required" });
    }

    const newModule = new Module({ title, course });
    const savedModule = await newModule.save();

    res.status(201).json(savedModule);
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all modules (optionally filter by course)
export const getModules = async (req, res) => {
  try {
    const { courseId } = req.query; // optional filter

    const filter = courseId ? { course: courseId } : {};
    const modules = await Module.find(filter).populate("course", "title");

    res.status(200).json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get module by ID
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate("course", "title");
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.status(200).json(module);
  } catch (error) {
    console.error("Error fetching module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a module
export const updateModule = async (req, res) => {
  try {
    const { title, course } = req.body;
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { title, course },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json(updatedModule);
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a module
export const deleteModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.status(200).json({ message: "Module deleted" });
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ message: "Server error" });
  }
};
