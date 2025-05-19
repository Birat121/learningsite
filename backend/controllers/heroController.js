import Hero from "../models/hero.js";

export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hero', error: err.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    let image;

    if (req.file) {
      // Upload the image file buffer to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'hero_images', // optional: folder name in Cloudinary
      });
      image = result.secure_url;
    }

    let hero = await Hero.findOne();

    if (hero) {
      hero.title = title;
      hero.subtitle = subtitle;
      if (image) hero.image = image;
    } else {
      hero = new Hero({ title, subtitle, image });
    }

    await hero.save();
    res.json({ message: 'Hero updated', hero });

  } catch (err) {
    res.status(500).json({ message: 'Failed to update hero', error: err.message });
  }
};



