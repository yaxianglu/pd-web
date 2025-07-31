import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'patient' or 'staff'
  const [userInfo, setUserInfo] = useState(null);

  const login = (type, info) => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserInfo(info);
    // 可选：将登录状态保存到localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', type);
    localStorage.setItem('userInfo', JSON.stringify(info));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserInfo(null);
    // 清除localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userInfo');
  };

  // 初始化时检查localStorage中的登录状态
  React.useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUserType = localStorage.getItem('userType');
    const savedUserInfo = localStorage.getItem('userInfo');
    
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setUserType(savedUserType);
      setUserInfo(savedUserInfo ? JSON.parse(savedUserInfo) : null);
    }
  }, []);

  const value = {
    isAuthenticated,
    userType,
    userInfo,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 