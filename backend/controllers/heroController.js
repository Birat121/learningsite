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
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

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



