import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Props:
// - requiredUserType: legacy check for 'patient' or 'staff'
// - requiredRole: strict business role check (e.g., 'admin', 'hospital', 'doctor', ...)
// - allowedRoles: allow-list of roles
const ProtectedRoute = ({ children, requiredUserType = null, requiredRole = null, allowedRoles = null }) => {
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

  // 旧的 'patient' / 'staff' 类型验证
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 角色精确验证（admin/hospital/doctor/market/...）
  const role = userInfo?.role;
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果用户信息不完整，可能需要重新登录
  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 