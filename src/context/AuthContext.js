import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../contants';

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
  const [clinicInfo, setClinicInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // raw 为后端接口原始响应对象（不改结构直接保存）
  const login = (type, info, raw = null) => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserInfo(info);
    
    if (info.token) {
      setToken(info.token);
      setRefreshToken(info.refresh_token);
      localStorage.setItem('auth_token', info.token);
      localStorage.setItem('refresh_token', info.refresh_token);
    }

    if (info.clinic) {
      setClinicInfo(info.clinic);
      localStorage.setItem('clinic_info', JSON.stringify(info.clinic));
    }

    if (typeof info.expires_in !== 'undefined') {
      localStorage.setItem('auth_expires_in', String(info.expires_in));
    }
    
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', type);
    localStorage.setItem('user_info', JSON.stringify(info));

    // 保存原始响应（结构不变）
    if (raw) {
      localStorage.setItem('auth_login_response', JSON.stringify(raw));
    }
  };

  const logout = async () => {
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
    setClinicInfo(null);
    setToken(null);
    setRefreshToken(null);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_info');
    localStorage.removeItem('clinic_info');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_expires_in');
    localStorage.removeItem('auth_login_response');
    localStorage.removeItem('auth_refresh_response');
    
    sessionStorage.removeItem('patient_uuid');
  };

  const patientLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserInfo(null);
    setClinicInfo(null);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_info');
    localStorage.removeItem('clinic_info');
    localStorage.removeItem('auth_expires_in');
    localStorage.removeItem('auth_login_response');
    localStorage.removeItem('auth_refresh_response');
    
    sessionStorage.removeItem('patient_uuid');
  };

  const refreshAuthToken = async () => {
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.data.token);
        setRefreshToken(data.data.refresh_token);
        setUserInfo(data.data.user);
        if (data.data.clinic) {
          setClinicInfo(data.data.clinic);
          localStorage.setItem('clinic_info', JSON.stringify(data.data.clinic));
        }
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        if (typeof data.data.expires_in !== 'undefined') {
          localStorage.setItem('auth_expires_in', String(data.data.expires_in));
        }
        // 保存原始刷新响应
        localStorage.setItem('auth_refresh_response', JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }

    return false;
  };

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
      if (response.ok) return true;
    } catch (error) {
      console.error('Token verification error:', error);
    }
    return false;
  };

  useEffect(() => {
    const init = async () => {
      const savedAuth = localStorage.getItem('isAuthenticated');
      const savedUserType = localStorage.getItem('userType');
      const savedUserInfo = localStorage.getItem('user_info');
      const savedClinicInfo = localStorage.getItem('clinic_info');
      const savedToken = localStorage.getItem('auth_token');
      const savedRefreshToken = localStorage.getItem('refresh_token');
      
      if (savedAuth === 'true') {
        if (savedUserType === 'patient') {
          setIsAuthenticated(true);
          setUserType('patient');
          setUserInfo(savedUserInfo ? JSON.parse(savedUserInfo) : null);
          setClinicInfo(null);
          setToken(null);
          setRefreshToken(null);
          setIsInitializing(false);
          return;
        }
        setIsAuthenticated(true);
        setUserType(savedUserType);
        setUserInfo(savedUserInfo ? JSON.parse(savedUserInfo) : null);
        setClinicInfo(savedClinicInfo ? JSON.parse(savedClinicInfo) : null);
        if (savedToken) setToken(savedToken);
        if (savedRefreshToken) setRefreshToken(savedRefreshToken);
        try { await refreshAuthToken(); } catch {}
      }
      setIsInitializing(false);
    };

    init();
  }, []);

  const value = {
    isAuthenticated,
    userType,
    userInfo,
    clinicInfo,
    token,
    login,
    logout,
    patientLogout,
    refreshAuthToken,
    verifyToken,
    isInitializing
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 