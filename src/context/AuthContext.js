import React, { createContext, useContext, useState, useEffect } from 'react';

// API基础URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://18.232.58.243:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';


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
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const login = (type, info) => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserInfo(info);
    
    // 保存token信息
    if (info.token) {
      setToken(info.token);
      setRefreshToken(info.refresh_token);
      localStorage.setItem('auth_token', info.token);
      localStorage.setItem('refresh_token', info.refresh_token);
    }
    
    // 保存登录状态到localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', type);
    localStorage.setItem('user_info', JSON.stringify(info));
  };

  const logout = async () => {
    // 如果有token，调用后端登出接口
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    setIsAuthenticated(false);
    setUserType(null);
    setUserInfo(null);
    setToken(null);
    setRefreshToken(null);
    
    // 清除localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    // 清除sessionStorage中的患者UUID
    sessionStorage.removeItem('patient_uuid');
  };

  // 患者专用登出函数
  const patientLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserInfo(null);
    
    // 清除localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_info');
    
    // 清除sessionStorage中的患者UUID
    sessionStorage.removeItem('patient_uuid');
  };

  // 刷新token
  const refreshAuthToken = async () => {
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.data.token);
        setRefreshToken(data.data.refresh_token);
        setUserInfo(data.data.user);
        
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }

    return false;
  };

  // 验证token有效性
  const verifyToken = async () => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }

    return false;
  };

  // 初始化时检查localStorage中的登录状态
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUserType = localStorage.getItem('userType');
    const savedUserInfo = localStorage.getItem('user_info');
    const savedToken = localStorage.getItem('auth_token');
    const savedRefreshToken = localStorage.getItem('refresh_token');
    
    if (savedAuth === 'true' && savedToken) {
      setIsAuthenticated(true);
      setUserType(savedUserType);
      setUserInfo(savedUserInfo ? JSON.parse(savedUserInfo) : null);
      setToken(savedToken);
      setRefreshToken(savedRefreshToken);
      
      // 验证token有效性
      verifyToken().then(isValid => {
        if (!isValid) {
          // 如果token无效，尝试刷新
          refreshAuthToken().then(refreshSuccess => {
            if (!refreshSuccess) {
              // 如果刷新也失败，清除登录状态
              logout();
            }
          });
        }
      });
    }
  }, []);

  const value = {
    isAuthenticated,
    userType,
    userInfo,
    token,
    login,
    logout,
    patientLogout,
    refreshAuthToken,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 