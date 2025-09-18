import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import geoLocationService from './services/geoLocationService';

const TestLanguageDetection = () => {
  const { currentLanguage, changeLanguage, isAutoDetecting } = useLanguage();
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    setTestResults(null);

    try {
      console.log('=== 开始语言检测测试 ===');
      
      // 获取IP
      const ip = await geoLocationService.getUserIP();
      console.log('用户IP:', ip);
      
      // 获取地理位置
      const location = await geoLocationService.getLocationByIP(ip);
      console.log('地理位置:', location);
      
      // 推荐语言
      const recommendedLanguage = geoLocationService.getRecommendedLanguage(location);
      console.log('推荐语言:', recommendedLanguage);
      
      setTestResults({
        ip,
        location,
        recommendedLanguage,
        currentLanguage,
        isMatch: recommendedLanguage === currentLanguage,
        timestamp: new Date().toLocaleString()
      });
      
      console.log('=== 测试完成 ===');
    } catch (error) {
      console.error('测试失败:', error);
      setTestResults({
        error: error.message,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetLanguageSettings = () => {
    localStorage.removeItem('preferred-language');
    localStorage.removeItem('user-set-language');
    window.location.reload();
  };

  const forceAutoDetection = async () => {
    try {
      const recommendedLanguage = await geoLocationService.detectAndRecommendLanguage();
      if (recommendedLanguage) {
        changeLanguage(recommendedLanguage);
        alert(`已切换到推荐语言: ${recommendedLanguage}`);
      }
    } catch (error) {
      alert(`自动检测失败: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>语言自动检测测试</h2>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h3>当前状态</h3>
        <p><strong>当前语言:</strong> {currentLanguage}</p>
        <p><strong>自动检测状态:</strong> {isAutoDetecting ? '检测中...' : '未检测'}</p>
        <p><strong>用户是否手动设置过语言:</strong> {localStorage.getItem('user-set-language') === 'true' ? '是' : '否'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTest}
          disabled={isTesting}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: isTesting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? '测试中...' : '运行测试'}
        </button>
        
        <button 
          onClick={forceAutoDetection}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          强制自动检测
        </button>
        
        <button 
          onClick={resetLanguageSettings}
          style={{
            padding: '10px 20px',
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

      {testResults && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '5px',
          border: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          <h3>测试结果</h3>
          <p><strong>测试时间:</strong> {testResults.timestamp}</p>
          
          {testResults.error ? (
            <div style={{ color: 'red' }}>
              <strong>错误:</strong> {testResults.error}
            </div>
          ) : (
            <div>
              <p><strong>IP地址:</strong> {testResults.ip}</p>
              <p><strong>国家:</strong> {testResults.location?.country} ({testResults.location?.countryCode})</p>
              <p><strong>地区:</strong> {testResults.location?.region}</p>
              <p><strong>城市:</strong> {testResults.location?.city}</p>
              <p><strong>推荐语言:</strong> {testResults.recommendedLanguage}</p>
              <p><strong>当前语言:</strong> {testResults.currentLanguage}</p>
              <p style={{ 
                color: testResults.isMatch ? 'green' : 'orange',
                fontWeight: 'bold'
              }}>
                {testResults.isMatch ? '✓ 语言匹配' : '⚠ 语言不匹配'}
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ 
        backgroundColor: '#e7f3ff', 
        padding: '15px', 
        borderRadius: '5px',
        border: '1px solid #b3d9ff'
      }}>
        <h3>说明</h3>
        <ul>
          <li>如果你在中国大陆，应该推荐 <code>zh-CN</code> (简体中文)</li>
          <li>如果你在台湾、香港、澳门、新加坡、马来西亚，应该推荐 <code>zh-TW</code> (繁体中文)</li>
          <li>其他地区应该推荐 <code>en</code> (英文)</li>
          <li>如果测试结果不符合预期，请检查浏览器控制台的详细日志</li>
        </ul>
      </div>
    </div>
  );
};

export default TestLanguageDetection;
