import passport from "passport";
import sendEmail from "../utils/email.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://dubai-rea-lstate.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails?.[0]?.value,
        });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });
        await newUser.save();

        // ✅ Send admin notification email
        const adminEmail = "biratbudhathoki79@gmail.com"; // Replace with actual admin email
        const subject = "🚀 New User Registered via Google";
        const message = `Hello Admin,

A new user just signed up using Google:

👤 Name: ${newUser.name}
📧 Email: ${newUser.email}
`;

        await sendEmail(adminEmail, subject, message);

        done(null, newUser);
      } catch (error) {
        console.error("Google strategy error:", error);
        done(error, null);
      }
    }
  )
);
