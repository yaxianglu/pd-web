import React from "react";
import { useNavigate } from "react-router-dom";
import { useResponsive } from '../responsive-hook';
import logo from '../../asserts/2.svg';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import './index.scss';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../language-selector';
import CookieSettingsTrigger from '../CookieSettingsTrigger';
import fbIcon from './img/facebook.svg';
import igIcon from './img/ins.svg';
import ytIcon from './img/youtube.svg';
import threadsIcon from './img/threads.svg';
import lineIcon from './img/line.svg';

export default function Footer({ style }) {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const { t } = useLanguage();

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
                {t('brand.pearlDigital')}
              </span>
            </div>
            {/* Language select */}
            <LanguageSelector
              size="small"
              style={{ 
                width: isMobile ? 120 : 140, 
                height: 36, 
                marginBottom: 16 
              }}
              className="language-select"
            />
            {/* Privacy/Cookie Message */}
            <div className="privacy-message">
              <span 
                className="privacy-link"
                onClick={() => handleItemClick('/privacy')}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('footer.privacyPolicy')}
              </span>
              <span style={{ margin: '0 8px' }}>|</span>
              <span 
                className="terms-link"
                onClick={() => handleItemClick('/terms')}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('footer.termsOfService')}
              </span>
              <span style={{ margin: '0 8px' }}>|</span>
              <CookieSettingsTrigger className="cookie-link">
                {t('footer.cookieSettings')}
              </CookieSettingsTrigger>
            </div>
          </div>

          {/* 分组列表 */}
          <div className="footer-right">
            {/* 產品 */}
            <div className="footer-column">
              <div className="column-title">{t('footer.products')}</div>
              <div 
                className="column-item" 
                onClick={() => handleItemClick('/invisible-braces')}
                style={{ cursor: 'pointer' }}
              >
                {t('products.invisibleBraces')}
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/maintainer')}
                style={{ cursor: 'pointer' }}
              >
                {t('products.maintainer')}
              </div>
              {/* <div 
                className="column-item"
                onClick={() => handleItemClick('/whitening')}
                style={{ cursor: 'pointer' }}
              >
                {t('products.whitening')}
              </div> */}
            </div>
            {/* 服務 */}
            <div className="footer-column">
              <div className="column-title">{t('footer.services')}</div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/journey')}
                style={{ cursor: 'pointer' }}
              >
                {t('services.journey')}
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/correction')}
                style={{ cursor: 'pointer' }}
              >
                {t('services.correction')}
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/upload')}
                style={{ cursor: 'pointer' }}
              >
                {t('services.smileUpgrade')}
              </div>
            </div>
            {/* 關於 */}
            <div className="footer-column">
              <div className="column-title">{t('footer.about')}</div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/about')}
                style={{ cursor: 'pointer' }}
              >
                {t('about.title')}
              </div>
              <div 
                className="column-item"
                onClick={() => handleItemClick('/join')}
                style={{ cursor: 'pointer' }}
              >
                {t('about.partners')}
              </div>
              <div 
                className="column-item"
                onClick={() => window.open('https://lin.ee/mw8yJ6q', '_blank', 'noopener')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.joinLine')}
                </div>
            </div>
            <div className="footer-column hotline-column">
              <div className="column-title">{t('footer.hotlineTitle')}</div>
                <a 
                  className="column-item"
                  href="tel:0809090338"
                  aria-label="Call 0809-090-338"
                  style={{ cursor: 'pointer' }}
                >
                  0809-090-338
                </a>
                <a 
                  className="column-item"
                  href="tel:0277021343"
                  aria-label="Call 02-7702-1343"
                  style={{ cursor: 'pointer' }}
                >
                  02-7702-1343
                </a>
              <div className="social-icons">
                <img src={fbIcon} alt="facebook" onClick={() => window.open('https://www.facebook.com/share/17PGwwxt1N/?mibextid=wwXIfr', '_blank', 'noopener')} />
                <img src={igIcon} alt="instagram" onClick={() => window.open('https://www.instagram.com/pearl.digital_?igsh=Ym5lYmIwOXF3OWM0&utm_source=qr', '_blank', 'noopener')} />
                <img src={threadsIcon} alt="threads" onClick={() => window.open('https://www.threads.com/@pearl.digital_?invite=0', '_blank', 'noopener')} />
                <img src={lineIcon} alt="line" onClick={() => window.open('https://lin.ee/mw8yJ6q', '_blank', 'noopener')} />
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
            {t('footer.copyright')}
          </div>
          <div className="address">{t('footer.address')}</div>
          <div className="contact">{t('footer.contact')}</div>
        </div>
      </div>
    </footer>
  );
}
