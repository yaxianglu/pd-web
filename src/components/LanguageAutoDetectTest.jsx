import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import geoLocationService from '../services/geoLocationService';

// 测试组件，用于验证自动语言检测功能
const LanguageAutoDetectTest = () => {
  const { currentLanguage, isAutoDetecting, autoDetectLanguage } = useLanguage();
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const testAutoDetection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const ip = await geoLocationService.getUserIP();
      const location = await geoLocationService.getLocationByIP(ip);
      const recommendedLanguage = geoLocationService.getRecommendedLanguage(location);
      
      setTestResult({
        ip,
        location,
        recommendedLanguage,
        currentLanguage,
        isMatch: recommendedLanguage === currentLanguage
      });
    } catch (error) {
      setTestResult({
        error: error.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetUserLanguage = () => {
    localStorage.removeItem('user-set-language');
    localStorage.removeItem('preferred-language');
    window.location.reload();
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>语言自动检测测试</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>当前语言:</strong> {currentLanguage}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>自动检测状态:</strong> {isAutoDetecting ? '检测中...' : '未检测'}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAutoDetection} 
          disabled={isTesting}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? '测试中...' : '测试自动检测'}
        </button>
        
        <button 
          onClick={resetUserLanguage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          重置语言设置
        </button>
      </div>

      {testResult && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4>测试结果:</h4>
          {testResult.error ? (
            <div style={{ color: 'red' }}>错误: {testResult.error}</div>
          ) : (
            <div>
              <div><strong>IP地址:</strong> {testResult.ip}</div>
              <div><strong>地理位置:</strong> {testResult.location?.country} ({testResult.location?.countryCode})</div>
              <div><strong>地区:</strong> {testResult.location?.region}</div>
              <div><strong>城市:</strong> {testResult.location?.city}</div>
              <div><strong>推荐语言:</strong> {testResult.recommendedLanguage}</div>
              <div><strong>当前语言:</strong> {testResult.currentLanguage}</div>
              <div style={{ 
                color: testResult.isMatch ? 'green' : 'orange',
                fontWeight: 'bold'
              }}>
                {testResult.isMatch ? '✓ 语言匹配' : '⚠ 语言不匹配'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageAutoDetectTest;
