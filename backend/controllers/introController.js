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
    let image;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    let intro = await Introduction.findOne();
    if (!intro) {
      intro = new Introduction({ heading, subheading, paragraph1, paragraph2, image });
    } else {
      intro.heading = heading;
      intro.subheading = subheading;
      intro.paragraph1 = paragraph1;
      intro.paragraph2 = paragraph2;
      if (image) intro.image = image;
    }

    await intro.save();
    res.json(intro);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update introduction' });
  }
};
