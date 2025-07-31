import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedUserTypes = ['patient', 'staff'] }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    // 如果未登录，重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    // 如果用户类型不在允许列表中，重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 