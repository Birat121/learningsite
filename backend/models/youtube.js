import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
  title: { type: String, required: true },
  embeddedUrl: { type: String, required: true },
});

const youtube = model('Video1', videoSchema);
export default youtube;
