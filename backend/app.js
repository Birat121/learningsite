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
import path from 'path';
import { fileURLToPath } from 'url';



// Load Google Strategy
import "./controllers/googleAuthController.js";  // <-- Make sure this sets up Passport

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(cors({
  origin: 'https://realstatelearning3.netlify.app',  // Your frontend URL
  credentials: true,  // Enable sending cookies/credentials if required
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Common methods used in your frontend
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow headers like Authorization
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use(express.urlencoded({ extended: true }));

// Required for Passport session handling
app.use(session({
  secret: process.env.SESSION_SECRET || "secretkey",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
// Routes
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
