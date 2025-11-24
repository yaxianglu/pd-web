import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './PersonalSettings.scss';

export default function PersonalSettings() {
  const { userInfo, setUserInfo } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    email: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // 当 userInfo 更新时，同步更新 profileForm
  useEffect(() => {
    if (userInfo && !isEditingProfile) {
      setProfileForm({
        full_name: userInfo.full_name || '',
        username: userInfo.username || '',
        phone: userInfo.phone || '',
        email: userInfo.email || ''
      });
    }
  }, [userInfo, isEditingProfile]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswordForm = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: '請填寫所有密碼欄位' });
      return false;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密碼至少需要6個字符' });
      return false;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: '新密碼與確認密碼不一致' });
      return false;
    }
    
    return true;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 使用 Web Crypto API 對密碼進行 SHA-256 加密
      const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      const hashedCurrentPassword = await hashPassword(passwordForm.currentPassword);
      const hashedNewPassword = await hashPassword(passwordForm.newPassword);

      const response = await apiService.changePassword({
        currentPassword: hashedCurrentPassword,
        newPassword: hashedNewPassword
      });

      if (response.success) {
        setMessage({ type: 'success', text: '密碼修改成功！' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: response.message || '密碼修改失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || '密碼修改失敗' });
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  const clearProfileMessage = () => {
    setProfileMessage({ type: '', text: '' });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileForm({
      full_name: userInfo?.full_name || '',
      username: userInfo?.username || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || ''
    });
    setProfileMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileForm({
      full_name: userInfo?.full_name || '',
      username: userInfo?.username || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || ''
    });
    setProfileMessage({ type: '', text: '' });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // 验证用户名
    if (profileForm.username && profileForm.username !== '') {
      if (profileForm.username.length < 3) {
        setProfileMessage({ type: 'error', text: '帳戶名至少需要3個字符' });
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(profileForm.username)) {
        setProfileMessage({ type: 'error', text: '帳戶名只能包含字母、數字和下劃線' });
        return;
      }
    }

    // 验证邮箱格式
    if (profileForm.email && profileForm.email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileForm.email)) {
        setProfileMessage({ type: 'error', text: '郵箱格式不正確' });
        return;
      }
    }

    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      const response = await apiService.updateProfile({
        full_name: profileForm.full_name || null,
        username: profileForm.username || null,
        phone: profileForm.phone || null,
        email: profileForm.email || null
      });

      if (response.success) {
        setProfileMessage({ type: 'success', text: '個人信息更新成功！' });
        setIsEditingProfile(false);
        
        // 更新 userInfo
        if (response.data) {
          // 合并更新后的数据，保留原有字段（如 clinic 等）
          const updatedUserInfo = {
            ...(userInfo || {}),
            ...response.data
          };
          setUserInfo(updatedUserInfo);
          
          // 同时更新 localStorage，确保完整保存
          const storedUserInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
          const updatedStoredInfo = {
            ...storedUserInfo,
            ...response.data
          };
          localStorage.setItem('user_info', JSON.stringify(updatedStoredInfo));
          
          console.log('✅ 用户信息已更新:', {
            full_name: updatedUserInfo.full_name,
            username: updatedUserInfo.username,
            phone: updatedUserInfo.phone,
            email: updatedUserInfo.email
          });
        }
      } else {
        setProfileMessage({ type: 'error', text: response.message || '個人信息更新失敗' });
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: error.message || '個人信息更新失敗' });
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="personal-settings">
      {/* 用戶信息展示 */}
      <div className="card user-info-section">
        <div className="card-title">個人信息</div>
        {!isEditingProfile ? (
          <>
            <div className="info-grid">
              <div className="info-item">
                <label>姓名：</label>
                <span>{userInfo?.full_name || userInfo?.username || '—'}</span>
              </div>
              <div className="info-item">
                <label>帳戶：</label>
                <span>{userInfo?.username || '—'}</span>
              </div>
              <div className="info-item">
                <label>聯繫方式：</label>
                <span>{userInfo?.phone || '—'}</span>
              </div>
              <div className="info-item">
                <label>信箱：</label>
                <span>{userInfo?.email || '—'}</span>
              </div>
              <div className="info-item">
                <label>角色：</label>
                <span>{userInfo?.role === 'doctor' ? '醫師' : userInfo?.role || '—'}</span>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn primary" 
                onClick={handleEditProfile}
              >
                編輯個人信息
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="info-grid">
              <div className="info-item">
                <label htmlFor="full_name">姓名：</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleProfileChange}
                  placeholder="請輸入姓名"
                />
              </div>
              <div className="info-item">
                <label htmlFor="username">帳戶：</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  placeholder="請輸入帳戶名"
                />
              </div>
              <div className="info-item">
                <label htmlFor="phone">聯繫方式：</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="請輸入聯繫方式"
                />
              </div>
              <div className="info-item">
                <label htmlFor="email">信箱：</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  placeholder="請輸入信箱"
                />
              </div>
              <div className="info-item">
                <label>角色：</label>
                <span>{userInfo?.role === 'doctor' ? '醫師' : userInfo?.role || '—'}</span>
              </div>
            </div>

            {profileMessage.text && (
              <div className={`message ${profileMessage.type}`} onClick={clearProfileMessage}>
                {profileMessage.text}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn secondary" 
                onClick={handleCancelEdit}
                disabled={profileLoading}
              >
                取消
              </button>
              <button 
                type="submit" 
                className="btn primary" 
                disabled={profileLoading}
              >
                {profileLoading ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 診所信息展示 */}
      {userInfo?.clinic && (
        <div className="card clinic-info-section">
          <div className="card-title">診所信息</div>
          <div className="info-grid">
            <div className="info-item">
              <label>診所名稱：</label>
              <span>{userInfo.clinic.name || '—'}</span>
            </div>
            <div className="info-item">
              <label>診所地址：</label>
              <span>{userInfo.clinic.address || '—'}</span>
            </div>
            <div className="info-item">
              <label>診所電話：</label>
              <span>{userInfo.clinic.phone || '—'}</span>
            </div>
            <div className="info-item">
              <label>診所信箱：</label>
              <span>{userInfo.clinic.email || '—'}</span>
            </div>
            <div className="info-item">
              <label>診所狀態：</label>
              <span className={`status-badge ${userInfo.clinic.status === 'active' ? 'active' : 'inactive'}`}>
                {userInfo.clinic.status === 'active' ? '啟用' : '停用'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 密碼修改 */}
      <div className="card password-section">
        <div className="card-title">修改密碼</div>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">當前密碼：</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="請輸入當前密碼"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">新密碼：</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="請輸入新密碼（至少6位）"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">確認新密碼：</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="請再次輸入新密碼"
              required
            />
          </div>

          {message.text && (
            <div className={`message ${message.type}`} onClick={clearMessage}>
              {message.text}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn primary" 
              disabled={loading}
            >
              {loading ? '修改中...' : '修改密碼'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
