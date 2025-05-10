import hero from "../models/hero";

export const getHero = async (req, res) => {
  const hero = await hero.findOne();
  res.json(hero);
};

export const updateHero = async (req, res) => {
  const { title, subtitle } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  let hero1 = await hero.findOne();

  if (hero1) {
    hero.title = title;
    hero.subtitle = subtitle;
    if (image) hero.image = image;
  } else {
    hero = new hero({ title, subtitle, image });
  }

  await hero.save();
  res.json({ message: 'Hero updated', hero });
};
