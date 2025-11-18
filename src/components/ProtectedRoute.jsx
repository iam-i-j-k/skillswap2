import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  // ❗ token is undefined for 1–2 renders after refresh
  if (token === undefined) {
    return null; // or loading spinner
  }

  // now safe to check
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
