import { Router } from 'express';
const YoutubeRouter = Router();
import { addVideo, getVideos, updateVideo } from '../controllers/youtubeController.js';

YoutubeRouter.post('/add', addVideo);
YoutubeRouter.get('/get', getVideos);
YoutubeRouter.put('/update/:id', updateVideo);

export default YoutubeRouter;
