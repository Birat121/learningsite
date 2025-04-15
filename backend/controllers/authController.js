import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customeError";

export const register = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw new CustomError("User already exists", 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new CustomError("Invalid credentials", 401);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};