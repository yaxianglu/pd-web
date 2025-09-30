import React from 'react';
import './top.scss';
import p1 from './imgs/1.png';
import DetailButton from '../components/detail-button';
import { useLanguage } from '../context/LanguageContext';

export default function Top() {
  const { t } = useLanguage();
  
  const handleJoinClick = () => {
    console.log('Button clicked! Scrolling to bottom...');
    console.log('Document body scrollHeight:', document.body.scrollHeight);
    console.log('Window scrollY:', window.scrollY);
    console.log('Document documentElement scrollHeight:', document.documentElement.scrollHeight);
    console.log('Window innerHeight:', window.innerHeight);
    
    // 尝试滚动到JoinInfo组件
    const joinInfoElement = document.getElementById('join-info');
    if (joinInfoElement) {
      console.log('Found join-info element, scrolling to it...');
      joinInfoElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('join-info element not found, trying alternative scroll...');
      // 尝试滚动到页面底部
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="join-join-description-section">
      <div className="join-join-description-section-text" style={{ backgroundImage: `url(${p1})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }}>
      {/* <img src={p1} alt="#" style={{ width: '100%' }} /> */}
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
    </div>
  );
}