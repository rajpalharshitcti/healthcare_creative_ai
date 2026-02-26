import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, role: allowedRole }) => {
  const { isAuthenticated, role, authInitialized } = useAuth();

  if (!authInitialized) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "patient" ? "/patient/dashboard" : "/doctor/dashboard"} replace />;
  }
  return children;
};

export default ProtectedRoute;
