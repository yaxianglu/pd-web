import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../context/LanguageContext';

export default function DetailButton({ text, style, size, disabled, onClick }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleClick = (text) => {
    if (onClick) {
      onClick();
      return;
    };
    switch (text) {
      case '微笑測試':
      case t('common.smileTest'):
        window.open('/upload', '_blank');
        break;
      case '關於珍舒美':
      case t('about.title'):
        navigate('/about');
        break;
      case '合作夥伴':
      case t('about.partners'):
        navigate('/join');
        break;
      case '成為合作夥伴':
      case t('about.becomePartner'):
        navigate('/join');
        break;
      case '開啟微笑旅程':
      case 'Start Your Smile Journey':
      case '開啟你的微笑旅程':
      case '开启你的微笑旅程':
        window.open('/upload', '_blank');
        break;
      case '我需要哪種治療？':
      case '我需要哪种治疗？':
      case 'Which Plan Suits Me?':
        window.open('/upload', '_blank');
        break;
      case '了解你的牙齒狀況':
      case '了解你的牙齿状况':
      case 'Learn about your dental condition':
        window.open('/upload', '_blank');
        break;
      default:
        break;
    }
  }
  return (
    <div className="detail-button-wrapper" style={{ ...style }}>
      <button 
        className={`detail-button detail-button-${size}`}
        disabled={disabled}
        onClick={() => handleClick(text)}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {text}
      </button>
    </div>
  );
}
