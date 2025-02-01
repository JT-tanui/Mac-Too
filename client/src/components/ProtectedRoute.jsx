import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, superAdminOnly = false }) => {
  const { authState } = useContext(AuthContext);

  if (!authState.token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (superAdminOnly && !authState.isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;