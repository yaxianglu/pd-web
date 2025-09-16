import React from 'react';
import './top.scss';
import p1 from './imgs/1.png';
import DetailButton from '../components/detail-button';
import { useLanguage } from '../context/LanguageContext';

export default function Top() {
  const { t } = useLanguage();
  
  const handleJoinClick = () => {
    const joinInfoElement = document.getElementById('join-info');
    if (joinInfoElement) {
      const offset = 80; // 为固定header留出空间
      const elementPosition = joinInfoElement.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="join-join-description-section">
      <div className="join-join-description-section-text">
        <div className="join-join-description-section-text-title">
          {t('join.hero.title').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('join.hero.title').split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
        <div className="join-join-description-section-text-content">
          {t('join.hero.description').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('join.hero.description').split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
        <DetailButton 
          text={t('join.hero.buttonText')} 
          size="small" 
          onClick={handleJoinClick}
        />
      </div>
      <img src={p1} alt="#" style={{ width: '100%' }} />
    </div>
  );
}