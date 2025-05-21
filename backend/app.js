import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import errorHandler from "./middleware/errorHandling.js";
import authRouter from "./routes/authRoute.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import videoRouter from "./routes/videoRoute.js";
import quizRouter from "./routes/quizRoute.js";
import blogRouter from "./routes/blogRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import heroRouter from "./routes/heroRoute.js";
import introRouter from "./routes/introRoute.js";
import youtubeRouter from "./routes/youtubeRoute.js";
import courseRouter from "./routes/courseRoute.js";
import moduleRouter from "./routes/moduleRoute.js";
import vimeoRouter from "./routes/vimeoRoute.js";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";

import "./controllers/googleAuthController.js"; // Passport Google Strategy

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS config
app.use(
  cors({
    origin: "https://koffeewithkirren.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Static uploads folder to serve videos/images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup — make sure SESSION_SECRET is strong and set in .env
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions", // Optional: default is "sessions"
      ttl: 14 * 24 * 60 * 60, // Optional: session expiry in seconds (14 days)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // send over HTTPS only in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

// Route registrations
app.use("/api/auth", authRouter);
app.use("/api/videos", videoRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/hero", heroRouter);
app.use("/api/intro", introRouter);
app.use("/api/youtube", youtubeRouter);
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/vimeo", vimeoRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
