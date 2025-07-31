import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

export default function DetailButton({ text, style, size, disabled, onClick }) {
  const navigate = useNavigate();
  const handleClick = (text) => {
    if (onClick) {
      onClick();
      return;
    };
    switch (text) {
      case '微笑測試':
        navigate('/upload');
        break;
      case '關於珍舒美':
        navigate('/about');
        break;
      case '合作夥伴':
        navigate('/join');
        break;
      case '開啟微笑旅程':
        navigate('/upload');
        break;
      case '我需要哪種治療？':
        navigate('/upload');
        break;
      case '了解你的牙齒狀況':
        navigate('/upload');
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
