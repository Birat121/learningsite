import About from '../models/About.js';

export const getAbout = async (req, res) => {
  const about = await About.findOne(); // assume only one doc
  res.json(about);
};

export const updateAbout = async (req, res) => {
  const { title, description, sections } = req.body;
  const about = await About.findOneAndUpdate({}, { title, description, sections }, { new: true, upsert: true });
  res.json(about);
};
