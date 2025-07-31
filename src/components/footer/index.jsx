import React from "react";
import { useNavigate } from "react-router-dom";
import { useResponsive } from '../responsive-hook';
import logo from '../../asserts/2.svg';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import './index.scss';

export default function Footer({ style }) {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer-wrapper" style={style}>
      <div className="footer-content">
        <div className="footer-main">
          {/* Logo and language */}
          <div className="footer-left">
            {/* Logo */}
            <div className="logo-section">
              <img src={logo} alt="logo" className="header-logo" style={{ width: 30 }} />
              <span className="logo-text">
                PEARL DIGITAL
              </span>
            </div>
            {/* Language select */}
            <Select
              defaultValue="台灣(繁中)"
              size="small"
              style={{ 
                width: isMobile ? 120 : 140, 
                height: 36, 
                marginBottom: 16 
              }}
              className="language-select"
              options={[
                { value: '台灣(繁中)', label: '台灣(繁中)' },
                { value: '香港(繁中)', label: '香港(繁中)' },
                { value: '中國(简中)', label: '中國(简中)' },
                { value: 'English', label: 'English' }
              ]}
            />
            {/* Privacy/Cookie Message */}
            <div className="privacy-message">
              請不要出售或分享我的個人信息<br />
              Cookie設置
            </div>
          </div>

          {/* 分组列表 */}
          <div className="footer-right">
            {/* 產品 */}
            <div className="footer-column">
              <div className="column-title">產品</div>
              <div 
                className="column-item" 
                onClick={() => handleItemClick('/invisible-braces')}
                style={{ cursor: 'pointer' }}
              >
                隱形牙套
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/maintainer')}
                style={{ cursor: 'pointer' }}
              >
                維持器
              </div>
              {/* <div 
                className="column-item"
                onClick={() => handleItemClick('/whitening')}
                style={{ cursor: 'pointer' }}
              >
                珍舒美白
              </div> */}
            </div>
            {/* 服務 */}
            <div className="footer-column">
              <div className="column-title">服務</div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/journey')}
                style={{ cursor: 'pointer' }}
              >
                珍舒美旅程
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/correction')}
                style={{ cursor: 'pointer' }}
              >
                正畸與美
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/upload')}
                style={{ cursor: 'pointer' }}
              >
                笑容升級
              </div>
            </div>
            {/* 關於 */}
            <div className="footer-column">
              <div className="column-title">關於</div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/about')}
                style={{ cursor: 'pointer' }}
              >
                關於我們
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/faq')}
                style={{ cursor: 'pointer' }}
              >
                常見問題
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/join')}
                style={{ cursor: 'pointer' }}
              >
                合作夥伴
              </div>
            </div>
            {/* 探索更多 */}
            {/* <div className="footer-column">
              <div className="explore-more">
                探索更多
                <span className="arrow">{'→'}</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* 底部版权和信息 */}
      <div className="footer-bottom">
        <div className="bottom-content">
          <div className="copyright">
            Pearl Digitalinc.<br />
            All Rights Reserved. ©2025
          </div>
          <div className="address">2975 Scott Blvd,  Ste 110,  Santa Clara,  CA 95054</div>
          <div className="contact">customer@pearl-digital.com +1-408-667-5811</div>
        </div>
      </div>
    </footer>
  );
}
