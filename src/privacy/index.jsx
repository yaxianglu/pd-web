import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-header">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
          >
            ← 返回
          </button>
          <h1>隱私條款</h1>
        </div>
        
        <div className="privacy-content">
          <div className="privacy-section">
            <p>隱私條款內容將在此處顯示。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
