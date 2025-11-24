import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Logout({ children, className = '', style = {} }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // 如果没有传入 children，使用翻译
  const displayText = children || t('common.logout');

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
      {displayText}
    </button>
  );
}
