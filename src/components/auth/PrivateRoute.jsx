// components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Add your authentication logic here
  const isAuthenticated = localStorage.getItem("token"); // This is a simple example

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
