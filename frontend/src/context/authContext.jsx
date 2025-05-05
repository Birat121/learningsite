import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

// Create a context
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthContext provider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(userData);
  };
  

  const logout = async() => {
    setAuthToken(null);
    localStorage.removeItem("token");
    setUser(null);
    await axiosInstance.post("/auth/logout", { withCredentials: true });
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/user", { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If the status code is 401 (unauthorized), logout the user
        logout();
      }
      console.error("Error fetching user:", error);
    }
  };
  

  useEffect(() => {
    if (authToken) {
      fetchUser();
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
