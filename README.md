# Real Estate Training Platform

A full-featured online learning platform built for real estate training. This MERN stack project allows users to enroll in premium real estate courses, watch HD/4K video lessons, take quizzes, and manage their learning dashboard. Admins can manage content, upload videos, and monitor user enrollments.

## 🚀 Features

### 🎓 User Side
- Secure **JWT-based Authentication** (Form & Google Login)
- Browse and **enroll in real estate courses**
- Stream **4K videos hosted on Vimeo**
- Take **quizzes** after course modules
- View and track **enrolled courses** in the dashboard
- **Secure payment integration** using Ziina (with metadata storage and webhooks)

### 🛠️ Admin Panel
- Upload and manage **courses, modules, and videos**
- Upload video in **chunked format** with resumable support
- Add **quizzes after videos**
- Monitor users and enrollment status

## 🧰 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Redux Toolkit, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, Google OAuth
- **Video Storage**: Vimeo
- **Payment Gateway**: Ziina API with webhook integration
- **Others**: Multer, FFmpeg (optional), React Hook Form

## 🌐 Deployment

- **Frontend**: Vercel or Netlify  
- **Backend**: Render / DigitalOcean App Platform  
- **Database**: MongoDB Atlas  
- **Video Storage**: Vimeo

## Deployed link with custom domain
https://koffeewithkirren.com/
