import React from "react";
import { useNavigate } from "react-router-dom";
import './FeatureGrid.scss';
import png1 from './imgs/1.svg';
import png2 from './imgs/2.svg';
import png3 from './imgs/3.svg';
import png4 from './imgs/4.svg';
import p2 from '../asserts/2-white.svg';
import { useLanguage } from '../context/LanguageContext';

export default function OrthoPaletteGrid() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGridItemClick = (path) => {
    if (path === '/upload') {
      window.open('/upload', '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="feature-grid">
      <div className="grid-container">
        {/* 隐形牙套 */}
        <div 
          className="grid-item invisible-aligners" 
          onClick={() => handleGridItemClick('/invisible-braces')}
          style={{ cursor: 'pointer' }}
        >
          <div className="grid-container-title">
            {t('home.featureGrid.invisibleBraces.title')}
          </div>
          <div className="description description-large">
            {t('home.featureGrid.invisibleBraces.description').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('home.featureGrid.invisibleBraces.description').split('\n').length - 1 && <br/>}
              </span>
            ))}
          </div>
          <div className="icon">
            <img src={png1} alt="隐形牙套" />
          </div>
        </div>
        
        {/* 矯正與美 */}
        <div 
          className="grid-item orthodontics-beauty"
          onClick={() => handleGridItemClick('/correction')}
          style={{ cursor: 'pointer' }}
        >
          <div className="grid-container-title">
            {t('home.featureGrid.correctionBeauty.title')}
          </div>
          <div className="description description-medium">
            {t('home.featureGrid.correctionBeauty.description').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('home.featureGrid.correctionBeauty.description').split('\n').length - 1 && <br/>}
              </span>
            ))}
          </div>
          <div className="icon" style={{ top: '70%' }}>
            <img src={png2} alt="矯正与美" />
          </div>
        </div>
        
        {/* 維持器 */}
        <div 
          className="grid-item retainer"
          onClick={() => handleGridItemClick('/maintainer')}
          style={{ cursor: 'pointer' }}
        >
          <div className="grid-container-title">
            {t('home.featureGrid.retainer.title')}
          </div>
          <div className="description description-medium">
            {t('home.featureGrid.retainer.description').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('home.featureGrid.retainer.description').split('\n').length - 1 && <br/>}
              </span>
            ))}
          </div>
          <div className="icon">
            <img src={png4} alt="維持器" />
          </div>
        </div>
        
        <div 
          className="grid-item smile-test"
          onClick={() => handleGridItemClick('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src={p2} alt="主页" />
        </div>
        
        {/* 美白介紹 */}
        <div className="grid-item whitening-intro"
          onClick={() => handleGridItemClick('/upload')}
        >
          <div className="grid-container-title">
            {t('home.featureGrid.smileTest.title')}
          </div>
          <div className="description description-medium" style={{ width: '70%' }}>
            {t('home.featureGrid.smileTest.description').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('home.featureGrid.smileTest.description').split('\n').length - 1 && <br/>}
              </span>
            ))}
          </div>
          <div className="icon">
            <img src={png3} alt="美白介紹" />
          </div>
        </div>
      </div>
    </div>
  );
}
