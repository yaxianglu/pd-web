
import React, { useState } from "react";
import { useResponsive } from '../responsive-hook';
import { useLanguage } from '../../context/LanguageContext';
import "./index.scss";
import Table from "../table";
import apiService from "../../services/api";

// FAQ列表将在组件内部动态生成

export default function FaqsSection() {
  const { t } = useLanguage();
  const [openIdxes, setOpenIdxes] = useState([0]);
  const [apiStatus, setApiStatus] = useState('');
  const { isMobile, isTablet } = useResponsive();

  // 动态生成FAQ列表
  const faqList = [
    {
      q: t('faq.questions.process.question'),
      a: (
        <>
          {t('faq.questions.process.answer').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('faq.questions.process.answer').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      )
    },
    {
      q: t('faq.questions.duration.question'),
      a: t('faq.questions.duration.answer')
    },
    {
      q: t('faq.questions.results.question'),
      a: t('faq.questions.results.answer')
    },
    {
      q: t('faq.questions.age.question'),
      a: (
        <>
          {t('faq.questions.age.answer').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('faq.questions.age.answer').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      )
    },
    {
      q: t('faq.questions.safety.question'),
      a: (
        <>
          {t('faq.questions.safety.answer').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('faq.questions.safety.answer').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      )
    },
    {
      q: t('faq.questions.pricing.question'),
      a: (
        <>
          {t('faq.questions.pricing.answer').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('faq.questions.pricing.answer').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      )
    },
    {
      q: t('faq.questions.payment.question'),
      a: (
        <>
          {t('faq.questions.payment.answer').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('faq.questions.payment.answer').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      )
    },
    {
      q: t('faq.questions.satisfaction.question'),
      a: (
        <>
          {t('faq.questions.satisfaction.answer').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('faq.questions.satisfaction.answer').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      )
    },
    {
      q: t('faq.questions.extraction.question'),
      a: (
        <>
          {t('faq.questions.extraction.answer').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('faq.questions.extraction.answer').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      )
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIdxes(prev => {
      if (prev.includes(idx)) {
        return prev.filter(item => item !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  const testApiConnection = async () => {
    setApiStatus('Testing...');
    try {
      const result = await apiService.get('/health');
      setApiStatus(`API Status: ${result.status} - ${result.message}`);
      console.log('API Test Result:', result);
    } catch (error) {
      setApiStatus('API Test Failed');
      console.error('API Test Error:', error);
    }
  };

  return (
    <div className="faqs-section">
      {/* 左侧标题 */}
      <div className="faqs-title-container">
        <div className="faqs-title">
          {t('faq.title')}
        </div>
      </div>
      {/* 右侧列表 */}
      <div className="faqs-list-container">
        {faqList.map((item, idx) => (
          <div key={idx} className="faq-item">
            <div className="faq-content">
              <div
                onClick={() => toggleFaq(idx)}
                className="faq-question"
              >
                <span>{item.q}</span>
                <span className="faq-toggle-icon">
                  {openIdxes.includes(idx) ? "−" : "+"}
                </span>
              </div>
              {/* 展开内容 */}
              {openIdxes.includes(idx) && item.a && (
                <div className="faq-answer">
                  {item.a}
                </div>
              )}
            </div>
          </div>
        ))}

      <div className="faq-bottom-text">
        {t('faq.bottomText').split('\n').map((line, index) => (
          <span key={index}>
            {line}
            {index < t('faq.bottomText').split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
      
      {/* <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h3>API 连接測試</h3>
        <button 
          onClick={testApiConnection}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          測試后端连接
        </button>
        {apiStatus && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: apiStatus.includes('ok') ? '#d4edda' : '#f8d7da',
            borderRadius: '4px',
            color: apiStatus.includes('ok') ? '#155724' : '#721c24'
          }}>
            {apiStatus}
          </div>
        )}
      </div> */}
      </div>
    </div>
  );
}
