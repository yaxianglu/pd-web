import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useResponsive } from '../components/responsive-hook';
import img from './imgs/1.jpg';
import img2 from './imgs/2.svg';
import './index.scss';

const randomCredentials = {
  username: "pearl_admin_2025",
  password: "P@rlD1g1t@l2024!"
}

export default function PearlLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const [patientAccount, setPatientAccount] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

  // 患者登录处理
  const handlePatientLogin = () => {
    if (patientAccount.trim()) {
      // 患者登录成功，保存登录状态并跳转到partners页面
      login('patient', { account: patientAccount });
      navigate('/partners');
    } else {
      alert('請輸入帳號');
    }
  };

  // 员工登录处理
  const handleStaffLogin = () => {
    if (staffUsername === randomCredentials.username && staffPassword === randomCredentials.password) {
      // 登录成功，保存登录状态并跳转到partners页面
      login('staff', { username: staffUsername });
      navigate('/partners');
    } else {
      alert('帳號或密碼錯誤');
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
          SHINE BRIGHT<br/>
          ALIGN RIGHT.
        </div>
      </div>

      {/* 右侧登录表单区域 */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="login-welcome">WELCOME TO PEARL DIGITAL</div>

          {/* 患者登录 */}
          <div className="login-section">
            <div className="section-divider">
              <div className="divider-line" />
              <div className="section-title">患者登入</div>
              <div className="divider-line" />
            </div>
            <div className="input-label">
              帳號
              <span className="info-icon" title="帳號說明">ⓘ</span>
            </div>
            <input
              placeholder=""
              value={patientAccount}
              onChange={(e) => setPatientAccount(e.target.value)}
              className="form-input"
            />

            <button 
              onClick={handlePatientLogin}
              className="login-button"
            >
              登入
            </button>
          </div>

          {/* 员工登录 */}
          <div className="login-section">
            <div className="section-divider">
              <div className="divider-line" />
              <div className="section-title">工作人員登入</div>
              <div className="divider-line" />
            </div>
            <input
              placeholder="Username or Email"
              value={staffUsername}
              onChange={(e) => setStaffUsername(e.target.value)}
              className="form-input"
            />
            <input
              placeholder="Password"
              type="password"
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              className="form-input"
            />
            <button 
              onClick={handleStaffLogin}
              className="login-button"
            >
              登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
