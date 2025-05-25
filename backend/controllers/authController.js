import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customeError.js";
import sendEmail from "../utils/email.js";

// Register Function
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw new CustomError("User already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    // Send email to admin
    const adminEmail = "biratbudhathoki79@gmail.com"; // Replace with real admin email
    const subject = "New User Registration";
    const message = `A new user has registered:\n\nName: ${name}\nEmail: ${email}`;

    await sendEmail(adminEmail, subject, message);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};
// Login Function
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new CustomError("Invalid credentials", 401);

    const token = jwt.sign(
      { id: user._id, email: user.email }, // ✅ include email
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};



export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};  


export const getCurrentUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw new CustomError("User not found", 404);
    user.name = name;
    user.email = email;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Verify admin credentials
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = { email }; // Include relevant information in the token payload
    const token = jwt.sign(payload, process.env.ADMIN_JWT_SECRET, {
      expiresIn: '3d', // Token validity for 3 days
    });

    // Cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'strict', // Prevent CSRF
    };

    // Send response
    res
      .status(200)
      .cookie('token', token, options)
      .json({ message: 'Login successful', token }); // Optionally return the token for client-side use
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout admin", error: error.message });
  }
};
