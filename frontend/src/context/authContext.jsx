import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      await fetchUser(); // call after successful login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/user", { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null); // Optional: reset user on error
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch on mount to check if user is logged in
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
