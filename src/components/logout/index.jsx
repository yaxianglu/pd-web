import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Logout({ children = '退出', className = '', style = {} }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}
    navigate('/login', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      style={{
        background: '#48d2ce',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
