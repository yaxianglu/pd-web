import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { isAuthenticated, userType, userInfo, isInitializing } = useAuth();
  const location = useLocation();

  // 初始化未完成，先不跳转，避免误判
  if (isInitializing) {
    return <div />;
  }

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要特定用户类型但当前用户类型不匹配
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 如果用户信息不完整，可能需要重新登录
  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 