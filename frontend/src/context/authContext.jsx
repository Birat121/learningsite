import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

// Create context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Login function
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(userData);
  };

  // Logout function
  const logout = async () => {
    setAuthToken(null);
    localStorage.removeItem("token");
    setUser(null);
    setEnrolledCourses([]);
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fetch current logged-in user
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/user", { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      console.error("Error fetching user:", error);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const res = await axiosInstance.get("/videos/enrolled", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (Array.isArray(res.data.courses)) {
        setEnrolledCourses(res.data.courses);
      } else {
        setEnrolledCourses([]);
      }
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
      setEnrolledCourses([]);
    }
  };

  // Check access to a specific course
  const hasCourseAccess = (slug) => {
    return enrolledCourses.some((course) => course.slug === slug);
  };

  // On mount or token change
  useEffect(() => {
    if (authToken) {
      fetchUser();
      fetchEnrolledCourses();
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        login,
        logout,
        user,
        enrolledCourses,
        fetchEnrolledCourses,
        hasCourseAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
