import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import cookieManager from '../utils/cookieManager';
import CookieConsent from '../components/CookieConsent';
import './index.scss';

const CookieDemo = () => {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState(cookieManager.getAllPreferences());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 监听Cookie偏好变化
    const handleStorageChange = (e) => {
      if (e.key === 'cookieConsent') {
        setPreferences(cookieManager.getAllPreferences());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleOpenSettings = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPreferences(cookieManager.getAllPreferences());
  };

  const testCookie = (type) => {
    const success = cookieManager.setCookie(`test_${type}`, 'test_value', { 
      type,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
    });
    
    if (success) {
      alert(`成功设置${type}类型的Cookie！`);
    } else {
      alert(`无法设置${type}类型的Cookie，请检查您的偏好设置。`);
    }
  };

  const clearTestCookies = () => {
    ['necessary', 'functional', 'analytics', 'marketing'].forEach(type => {
      cookieManager.deleteCookie(`test_${type}`);
    });
    alert('已清除所有测试Cookie！');
  };

  return (
    <div className="cookie-demo">
      <div className="cookie-demo-container">
        <h1>Cookie设置演示</h1>
        
        <div className="demo-section">
          <h2>当前Cookie偏好设置</h2>
          <div className="preferences-grid">
            {Object.entries(preferences).map(([type, enabled]) => (
              <div key={type} className={`preference-item ${enabled ? 'enabled' : 'disabled'}`}>
                <span className="preference-type">{t(`common.${type}`)}</span>
                <span className="preference-status">
                  {enabled ? '✓ 已启用' : '✗ 已禁用'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-section">
          <h2>测试Cookie功能</h2>
          <p>点击下面的按钮测试不同类型的Cookie设置：</p>
          <div className="test-buttons">
            <button 
              className="test-btn necessary"
              onClick={() => testCookie('necessary')}
            >
              测试必要Cookie
            </button>
            <button 
              className="test-btn functional"
              onClick={() => testCookie('functional')}
              disabled={!preferences.functional}
            >
              测试功能Cookie
            </button>
            <button 
              className="test-btn analytics"
              onClick={() => testCookie('analytics')}
              disabled={!preferences.analytics}
            >
              测试分析Cookie
            </button>
            <button 
              className="test-btn marketing"
              onClick={() => testCookie('marketing')}
              disabled={!preferences.marketing}
            >
              测试营销Cookie
            </button>
          </div>
          <button className="clear-btn" onClick={clearTestCookies}>
            清除所有测试Cookie
          </button>
        </div>

        <div className="demo-section">
          <h2>Cookie管理功能</h2>
          <div className="management-buttons">
            <button className="settings-btn" onClick={handleOpenSettings}>
              打开Cookie设置
            </button>
            <button 
              className="reset-btn"
              onClick={() => {
                cookieManager.resetPreferences();
                setPreferences(cookieManager.getAllPreferences());
                alert('已重置Cookie偏好设置！');
              }}
            >
              重置所有设置
            </button>
          </div>
        </div>

        <div className="demo-section">
          <h2>Cookie信息</h2>
          <div className="cookie-info">
            <p><strong>设置日期：</strong> {cookieManager.getConsentDate() || '未设置'}</p>
            <p><strong>是否已同意：</strong> {cookieManager.hasConsent() ? '是' : '否'}</p>
            <p><strong>当前页面Cookie：</strong></p>
            <pre className="cookie-list">
              {document.cookie || '无Cookie'}
            </pre>
          </div>
        </div>
      </div>

      {showModal && (
        <CookieConsent 
          forceShow={true}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CookieDemo;
