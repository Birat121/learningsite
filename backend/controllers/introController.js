// controllers/introductionController.js
import Introduction from "../models/intro.js";


export const getIntroduction = async (req, res) => {
  try {
    const intro = await Introduction.findOne();
    res.json(intro);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get introduction' });
  }
};

export const updateIntroduction = async (req, res) => {
  try {
    const { heading, subheading, paragraph1, paragraph2 } = req.body;

    let imageUrl;

    if (req.file) {
      // Upload the file buffer or local path to Cloudinary
      // If multer stores locally, use req.file.path
      // If multer stores in memory, use req.file.buffer with upload_stream (more advanced)
      
      // Assuming multer saves file locally and path is in req.file.path:
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "your_folder_name", // optional: to organize in Cloudinary
      });
      imageUrl = result.secure_url; // this is the Cloudinary image URL
    }

    let intro = await Introduction.findOne();
    if (!intro) {
      intro = new Introduction({
        heading,
        subheading,
        paragraph1,
        paragraph2,
        image: imageUrl,
      });
    } else {
      intro.heading = heading;
      intro.subheading = subheading;
      intro.paragraph1 = paragraph1;
      intro.paragraph2 = paragraph2;
      if (imageUrl) intro.image = imageUrl;
    }

    await intro.save();
    res.json(intro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update introduction" });
  }
};
