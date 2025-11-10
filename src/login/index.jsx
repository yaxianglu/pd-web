import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import apiService from '../services/api';
import { getRouteByRole } from '../contants/roleRoutes';
import CryptoJS from 'crypto-js';
import img from './imgs/1.jpg';
import img2 from './imgs/2.svg';
import './index.scss';


export default function PearlLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [patientAccount, setPatientAccount] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 1125);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1125);
    };

    window.addEventListener('resize', handleResize);
  }, []);

  // 患者登录处理
  const handlePatientLogin = async () => {
    if (!patientAccount.trim()) {
      setErrorMessage(t('login.errorMessages.enterUuid'));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // 验证UUID
      const responseData = await apiService.validatePatientUuid(patientAccount.trim());
      
      if (responseData.success) {
        // 登录成功，保存患者信息到sessionStorage
        login('patient', { 
          uuid: responseData.data.uuid,
          test_id: responseData.data.test_id,
          full_name: responseData.data.full_name,
          test_status: responseData.data.test_status
        }, responseData);
        
        // 将UUID存储到sessionStorage
        sessionStorage.setItem('patient_uuid', responseData.data.uuid);
        
        // 使用角色路由配置跳转到患者页面
        const route = getRouteByRole('patient');
        navigate(route);
      } else {
        setErrorMessage(responseData.message || t('login.errorMessages.uuidValidationFailed'));
      }
    } catch (error) {
      console.error('Patient login error:', error);
      setErrorMessage(error.message || t('login.errorMessages.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  // 员工登录处理
  const handleStaffLogin = async () => {
    const username = staffUsername.trim();
    const password = staffPassword.trim();

    if (!username || !password) {
      setErrorMessage(t('login.errorMessages.enterCredentials'));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // 使用 crypto-js 进行 SHA-256 加密，避免对 Web Crypto API 的依赖
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      
      const responseData = await apiService.post('/api/auth/login', {
        username,
        password: hashedPassword,
      }, false); // 登录不需要认证

      if (responseData.success) {
        // 登录成功，保存用户信息和token（同时保存原始响应）
        login('staff', {
          ...responseData.data.user,
          token: responseData.data.token,
          refresh_token: responseData.data.refresh_token,
          expires_in: responseData.data.expires_in,
          clinic: responseData.data.clinic || null,
        }, responseData);
        
        // 根据角色跳转到对应页面
        const userRole = responseData.data.user.role;
        const username = responseData.data.user.username;
        const route = getRouteByRole(userRole, username);
        navigate(route);
      } else {
        setErrorMessage(responseData.message || t('login.errorMessages.loginFailed'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || t('login.errorMessages.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pearl-login">
      {/* 左侧图片区域 */}
      <div 
        className="login-image-section"
        style={{ backgroundImage: `url(${img})` }}
      >
        <img src={img2} alt="" className="login-logo"/>
        <div className="login-slogan">
          {t('login.slogan').split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t('login.slogan').split('\n').length - 1 && <br/>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 右侧登录表单区域 */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="login-welcome">{t('login.welcome')}</div>

          {/* 患者登录 */}
          <div className="login-section">
            <div className="section-divider">
              <div className="divider-line" />
              <div className="section-title">{t('login.patientLogin')}</div>
              <div className="divider-line" />
            </div>
            <div className="input-label">
              {t('login.account')}
              <span className="info-icon" title={t('login.accountTooltip')}>ⓘ</span>
            </div>
            <input
              value={patientAccount}
              onChange={(e) => setPatientAccount(e.target.value)}
              className="form-input"
            />

            <button 
              onClick={handlePatientLogin}
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? t('login.verifying') : t('login.loginButton')}
            </button>
          </div>

          {/* 员工登录 */}
          {isMobile ? null : (
          <div className="login-section">
            <div className="section-divider">
              <div className="divider-line" />
              <div className="section-title">{t('login.staffLogin')}</div>
              <div className="divider-line" />
            </div>
            <input
              placeholder={t('login.username')}
              value={staffUsername}
              onChange={(e) => setStaffUsername(e.target.value)}
              className="form-input"
            />
            <div className="password-input-container">
              <input
                placeholder={t('login.password')}
                type={showPassword ? "text" : "password"}
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                className="form-input password-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <button 
              onClick={handleStaffLogin}
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? t('login.loggingIn') : t('login.loginButton')}
            </button>
            
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
