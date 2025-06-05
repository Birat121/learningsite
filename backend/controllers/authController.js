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
    const adminEmail = "sales@koffeewithkirren.com";
    const subject = "🚀 New User Registration Notification";
    const message = `
Hello Kirren,

A new user has just registered on the platform. Here are the details:

👤 Name: ${name}
📧 Email: ${email}


`;

    await sendEmail(adminEmail, subject, message, "Registration Bot");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

import crypto from "crypto";

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new CustomError("User not found with this email", 404);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; text-align: left;">

  <h2 style="color: #734F22; margin-top: 0;">Hello ${user.name},</h2>

  <p>We received a request to reset your password. Click the button below to set a new one:</p>

  <p style="margin: 30px 0; text-align: left;">
    <a href="${resetUrl}" style="padding: 12px 24px; background-color: #734F22; color: #fff; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
  </p>

  <p>If you didn’t request this, please ignore this email.</p>
  <p>Thanks</p>

  <!-- Footer Columns -->
  <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px;">

    <!-- Column 1: Customer Care -->
    <div style="flex: 1 1 160px; min-width: 150px; margin-right: 16px;">
      <p style="font-weight: bold; font-size: 15px; margin: 0 0 10px;">Customer Care</p>
      <p style="color: #2E7D32; font-size: 15px; font-weight: bold; margin: 0 0 10px;">Koffee with Kirren</p>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="https://www.facebook.com/share/18c2MMRyJR/" target="_blank">
          <img src="https://res.cloudinary.com/dbxtn22gi/image/upload/v1749135767/icons8-facebook-32_ynhpmi.png" alt="Facebook" style="filter: grayscale(100%) brightness(70%);" />
        </a>
        <a href="https://www.youtube.com/@KoffeewithKirren" target="_blank">
          <img src="https://res.cloudinary.com/dbxtn22gi/image/upload/v1749135767/icons8-youtube-32_ffqpco.png" alt="YouTube" style="filter: grayscale(100%) brightness(70%);" />
        </a>
        <a href="https://www.instagram.com/koffeewithkirren" target="_blank">
          <img src="https://res.cloudinary.com/dbxtn22gi/image/upload/v1749135766/icons8-insta-32_lbxm7c.png" alt="Instagram" style="filter: grayscale(100%) brightness(70%);" />
        </a>
        <a href="https://wa.me/971555547963" target="_blank">
          <img src="https://res.cloudinary.com/dbxtn22gi/image/upload/v1749135766/icons8-whatsapp-32_hhb1y5.png" alt="WhatsApp" style="filter: grayscale(100%) brightness(70%);" />
        </a>
        <a href="https://www.linkedin.com/company/koffee-with-kirren/" target="_blank">
          <img src="https://res.cloudinary.com/dbxtn22gi/image/upload/v1749135767/icons8-linkedin-32_lild0i.png" alt="LinkedIn" style="filter: grayscale(100%) brightness(70%);" />
        </a>
        <a href="https://www.tiktok.com/@koffeewithkirren?_t=ZN-8vagd7GohCp&_r=1" target="_blank">
          <img src="https://res.cloudinary.com/dbxtn22gi/image/upload/v1749135767/icons8-tiktok-32_bzqj5b.png" alt="TikTok" style="filter: grayscale(100%) brightness(70%);" />
        </a>
      </div>
    </div>

    <!-- Column 2: Logo -->
<div style="flex: 1 1 100px; min-width: 90px; text-align: center; padding: 0 16px;">
  <img src="https://res.cloudinary.com/dbxtn22gi/image/upload/v1748255737/logo3_hkfpws.png" alt="Koffee with Kirren Logo" style="max-width: 80px;" />
</div>

<!-- Column 3: Contact Info -->
<div style="flex: 1 1 160px; min-width: 150px; color: #2E7D32; font-size: 12px; padding-left: 16px;">
<p style="margin: 4px 0;">T: +971555547963</p>
 <p style="margin: 4px 0;">E: <a href="mailto:kirren@koffeewithkirren.com" style="color: #2E7D32; text-decoration: none;">kirren@koffeewithkirren.com</a></p>
  <p style="margin: 4px 0;"> <a href="https://www.koffeewithkirren.com" target="_blank" style="color: #2E7D32; text-decoration: none;">www.koffeewithkirren.com</a></p>
  <p style="margin: 4px 0;">Koffee with Kirren,DSO-</p>
  <p style="margin: 4px 0;">IFZA,Dubai Silicon Oasis,Dubai</p>
 
</div>

  </div>

  <p style="font-size: 14px; color: #777; margin-top: 20px;">
    This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the system manager. This message contains confidential information and is intended only for the individual named. If you are not the named addressee you should not disseminate, distribute or copy this e-mail.
  </p>

</div>



    `;

    await sendEmail(
      user.email,
      "Reset Your Password",
      htmlMessage,
      "Koffee With Kirren",
      true
    );

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw new CustomError("Token is invalid or has expired", 400);

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
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
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Verify admin credentials
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const payload = { email }; // Include relevant information in the token payload
    const token = jwt.sign(payload, process.env.ADMIN_JWT_SECRET, {
      expiresIn: "3d", // Token validity for 3 days
    });

    // Cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict", // Prevent CSRF
    };

    // Send response
    res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "Login successful", token }); // Optionally return the token for client-side use
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    res
      .status(500)
      .json({ message: "Failed to logout admin", error: error.message });
  }
};
