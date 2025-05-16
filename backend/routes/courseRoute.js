import express from 'express';
import multer from 'multer';
import {
  createCourse,
  getAllCourses,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  getEnrolledCourses,
  checkEnrollmentStatus
} from "../controllers/courseController.js";

import  authMiddleware  from '../middleware/authMiddleware.js';

const courseRouter = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage(); // Files are stored in memory
const upload = multer({ storage: storage }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

courseRouter.post('/course', upload, createCourse);
courseRouter.get('/course', getAllCourses);
courseRouter.get('/course/slug/:slug', getCourseBySlug); // Prevents slug/id conflict
courseRouter.put('/course/:id', upload, updateCourse);
courseRouter.delete('/course/:id',  deleteCourse);

// Enrollment
courseRouter.get('/enrolled', authMiddleware, getEnrolledCourses);
courseRouter.get('/enrolled/:slug', authMiddleware, checkEnrollmentStatus);





export default courseRouter;
