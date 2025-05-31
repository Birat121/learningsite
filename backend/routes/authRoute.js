import { register, login, logout, getCurrentUser,adminLogin,adminLogout,forgotPassword,resetPassword} from "../controllers/authController.js";
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import validateRequest from "../middleware/validatorRequest.js";
import { registerValidation, loginValidation } from "../utils/authValidator.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, validateRequest, register);
authRouter.post("/login", loginValidation, validateRequest, login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.post("/logout", logout);
authRouter.get("/user", getCurrentUser);
authRouter.post("/admin",adminLogin);
authRouter.post("/admin/logout",adminLogout);




// Google OAuth
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // You can redirect to frontend with token if needed
    res.redirect(`https://koffeewithkirren.com/oauth-success?token=${token}`);

  }
);


export default authRouter;