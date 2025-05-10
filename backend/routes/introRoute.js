// routes/introductionRoutes.js
import express from 'express';
import multer from 'multer';
import { getIntroduction, updateIntroduction } from '../controllers/introController.js';

const introRouter = express.Router();

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
introRouter.get('/intro', getIntroduction);
introRouter.put('/intro', upload.single('image'), updateIntroduction);

export default introRouter;
