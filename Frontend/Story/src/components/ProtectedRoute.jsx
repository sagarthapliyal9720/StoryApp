import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");

  // if user not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // if logged in
  return children;
}