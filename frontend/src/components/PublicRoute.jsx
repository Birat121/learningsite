// components/PublicOnlyRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { authToken } = useAuth();

  return authToken ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;
