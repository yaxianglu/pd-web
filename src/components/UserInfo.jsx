import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserInfo.scss';

const UserInfo = () => {
  const { userInfo, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!userInfo) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <div className="user-info">
      <div 
        className="user-avatar"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {userInfo.avatar ? (
          <img src={userInfo.avatar} alt="Avatar" />
        ) : (
          <div className="avatar-placeholder">
            {userInfo.full_name ? userInfo.full_name.charAt(0).toUpperCase() : userInfo.username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="username">{userInfo.full_name || userInfo.username}</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {showDropdown && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="user-details">
              <div className="user-name">{userInfo.full_name || userInfo.username}</div>
              <div className="user-role">{userInfo.role}</div>
              <div className="user-department">{userInfo.department} - {userInfo.position}</div>
            </div>
          </div>
          
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={() => setShowDropdown(false)}>
              個人資料
            </button>
            <button className="dropdown-item" onClick={() => setShowDropdown(false)}>
              設定
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout" onClick={handleLogout}>
              登出
            </button>
          </div>
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {showDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserInfo; 