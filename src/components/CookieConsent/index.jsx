import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './index.scss';

const CookieConsent = ({ forceShow = false, onClose }) => {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(forceShow);
  const [preferences, setPreferences] = useState({
    necessary: true, // 必要Cookie始终为true
    functional: false,
    analytics: false,
    marketing: false
  });

  // 检查是否已经设置过Cookie偏好
  useEffect(() => {
    if (forceShow) {
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (cookieConsent) {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      }
    } else {
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (!cookieConsent) {
        setShowBanner(true);
      } else {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      }
    }
  }, [forceShow]);

  // 处理接受全部
  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
    setShowBanner(false);
    setShowModal(false);
    if (onClose) onClose();
  };

  // 处理拒绝全部
  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
    setShowBanner(false);
    setShowModal(false);
    if (onClose) onClose();
  };

  // 处理自定义设置
  const handleCustomize = () => {
    setShowModal(true);
  };

  // 保存偏好设置
  const savePreferences = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // 这里可以根据偏好设置来启用/禁用相应的Cookie
    // 例如：Google Analytics, Facebook Pixel等
    console.log('Cookie preferences saved:', prefs);
  };

  // 处理偏好设置变更
  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // 必要Cookie不能更改
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // 保存自定义偏好
  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowModal(false);
    setShowBanner(false);
    if (onClose) onClose();
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  // 渲染Cookie类型选项
  const renderCookieType = (type, config) => (
    <div key={type} className={`cookie-type ${config.required ? 'required' : ''}`}>
      <div className="cookie-type-header">
        <div className="cookie-type-info">
          <h4>{config.title}</h4>
          <p>{config.description}</p>
        </div>
        <div className="cookie-type-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences[type]}
              onChange={() => handlePreferenceChange(type)}
              disabled={config.required}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* Cookie同意横幅 */}
      {showBanner && (
        <div className="cookie-consent-banner">
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
              <h3>{t('cookieConsent.title')}</h3>
              <p>{t('cookieConsent.description')}</p>
            </div>
            <div className="cookie-banner-actions">
              <button 
                className="cookie-btn cookie-btn-secondary"
                onClick={handleRejectAll}
              >
                {t('cookieConsent.buttons.rejectAll')}
              </button>
              <button 
                className="cookie-btn cookie-btn-outline"
                onClick={handleCustomize}
              >
                {t('cookieConsent.buttons.customize')}
              </button>
              <button 
                className="cookie-btn cookie-btn-primary"
                onClick={handleAcceptAll}
              >
                {t('cookieConsent.buttons.acceptAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie设置模态框 */}
      {showModal && (
        <div className="cookie-consent-modal-overlay">
          <div className="cookie-consent-modal">
            <div className="cookie-modal-header">
              <h2>{t('cookieConsent.modal.title')}</h2>
              <p>{t('cookieConsent.modal.description')}</p>
            </div>
            
            <div className="cookie-modal-content">
              {renderCookieType('necessary', t('cookieConsent.necessary'))}
              {renderCookieType('functional', t('cookieConsent.functional'))}
              {renderCookieType('analytics', t('cookieConsent.analytics'))}
              {renderCookieType('marketing', t('cookieConsent.marketing'))}
            </div>

            <div className="cookie-modal-footer">
              <div className="cookie-modal-links">
                <span>{t('cookieConsent.footer.description')}</span>
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  {t('cookieConsent.footer.privacyPolicy')}
                </a>
                <span>{t('cookieConsent.footer.and')}</span>
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  {t('cookieConsent.footer.termsOfService')}
                </a>
              </div>
              <div className="cookie-modal-actions">
                <button 
                  className="cookie-btn cookie-btn-secondary"
                  onClick={handleCloseModal}
                >
                  {t('cookieConsent.modal.back')}
                </button>
                <button 
                  className="cookie-btn cookie-btn-primary"
                  onClick={handleSavePreferences}
                >
                  {t('cookieConsent.buttons.savePreferences')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
