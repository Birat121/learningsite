import Enrollment from '../models/paymentModel.js';
import Video from '../models/videoModel.js';

export const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Populate video info for each enrollment
    const enrollments = await Enrollment.find({ user: userId })
      .populate("video");

    const videos = enrollments.map((enroll) => enroll.video);

    res.json({ enrolledCourses: videos });
  } catch (error) {
    console.error("Failed to fetch enrolled courses:", error);
    res.status(500).json({ error: "Server error" });
  }
};
