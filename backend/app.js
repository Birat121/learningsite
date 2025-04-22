import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import errorHandler from "./middleware/errorHandling.js";
import authRouter from "./routes/authRoute.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import router from "./routes/videoRoute.js";
import quizRouter from "./routes/quizRoute.js";


// Load Google Strategy
import "./controllers/googleAuthController.js";  // <-- Make sure this sets up Passport

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://learningsite-58rssdnio-biratbudhathoki79-gmailcoms-projects.vercel.app/", // Frontend origin
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Required for Passport session handling
app.use(session({
  secret: process.env.SESSION_SECRET || "secretkey",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/videos", router);
app.use("/api/quiz", quizRouter);


// Default test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
