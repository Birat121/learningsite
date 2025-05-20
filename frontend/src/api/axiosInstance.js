// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dubai-rea-lstate.onrender.com/api", // Your backend URL
  withCredentials: true, // Needed for cookies/session-based auth
});

export default axiosInstance;
