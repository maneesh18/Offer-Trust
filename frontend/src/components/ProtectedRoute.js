import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('recruiterToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/recruiter" replace />;
  }
  
  return children;
};

export default ProtectedRoute;