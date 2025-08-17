import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './PersonalSettings.scss';

export default function PersonalSettings() {
  const { userInfo } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  return (
    <div className="personal-settings">
      {/* 用戶信息展示 */}
      <div className="card user-info-section">
        <div className="card-title">個人信息</div>
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
