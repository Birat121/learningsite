import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Login function (async)
  const login = async (token, userData = null) => {
    localStorage.setItem("token", token);
    setAuthToken(token);

    if (userData) {
      setUser(userData);
    } else {
      // fetch user info if not passed
      try {
        const res = await axiosInstance.get("/auth/user");

        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user after login:", error);
        setUser(null);
      }
    }

    // fetch enrolled courses after login
    await fetchEnrolledCourses();
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
      const response = await axiosInstance.get("/auth/user", {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    if (!authToken) {
      setEnrolledCourses([]);
      return;
    }

    try {
      const res = await axiosInstance.get("/courses/enrolled", {
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
    const initializeAuth = async () => {
      setLoading(true);
      if (authToken) {
        await fetchUser();
        await fetchEnrolledCourses();
      } else {
        setUser(null);
        setEnrolledCourses([]);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [authToken]);

  const isAuthenticated = !!authToken && !!user;

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
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
