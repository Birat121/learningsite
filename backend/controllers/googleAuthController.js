import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import sendEmail from "../utils/email.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://dubai-rea-lstate.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          console.log("✅ Existing user found:", existingUser.email);
          return done(null, existingUser);
        }

        const newUser = new User({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
        });

        await newUser.save();
        console.log("🎉 New Google user saved:", newUser.email);

        // Send admin notification email
        const adminEmail = "biratbudhathoki79@gmail.com"; // Replace with actual admin email
        const subject = "🚀 New User Registered via Google";
        const message = `Hello Admin,

A new user just signed up using Google:

👤 Name: ${newUser.name}
📧 Email: ${newUser.email}
🕒 Time: ${new Date().toLocaleString()}
`;

        await sendEmail(adminEmail, subject, message);
        console.log("📧 Admin notified of new Google registration");

        done(null, newUser);
      } catch (error) {
        console.error("❌ Error in Google strategy:", error);
        done(error, null);
      }
    }
  )
);

// ✅ Required for session handling
passport.serializeUser((user, done) => {
  console.log("🔐 serializeUser -> ID:", user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error("❌ deserializeUser -> User not found");
      return done(null, false);
    }
    console.log("🔓 deserializeUser -> User:", user.email);
    done(null, user);
  } catch (err) {
    console.error("❌ deserializeUser error:", err);
    done(err, null);
  }
});
