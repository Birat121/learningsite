import express from 'express';
import { getHero, updateHero } from '../controllers/heroController.js';
import { upload } from '../middleware/upload.js';

const heroRouter = express.Router();

heroRouter.get('/', getHero);
heroRouter.put('/', upload.single('image'), updateHero);

export default heroRouter;
