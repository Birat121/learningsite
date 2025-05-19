// components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();

  return authToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
