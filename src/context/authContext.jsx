import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

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

  const login = async(token) => {
    setAuthToken(token);
    localStorage.setItem("token", token);
    await fetch();
    
  };

  const logout = async() => {
    setAuthToken(null);
    localStorage.removeItem("token");
    setUser(null);
    await axios.post("http://localhost:5000/api/auth/logout", { withCredentials: true });
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/user", { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
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
