import React, { useState } from "react";
import './ManufacturingSection.scss';
import CardWrapper from "../components/card-wrapper";
import p1 from './imgs/1.jpg';
import p2 from './imgs/2.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function ManufacturingSection() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [p1, p2];
  const labels = [t('invisibleBraces.manufacturing.sideView'), t('invisibleBraces.manufacturing.frontView')];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <CardWrapper
      title={t('invisibleBraces.manufacturing.title')}
    >
      <div className="invisible-braces-browser-card">
        {/* 卡片头部 */}
        <div className="card-header">
          <div className="browser-dots">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          <div className="view-label">
            {labels[currentImageIndex]}
          </div>
        </div>

        {/* 内容区块 */}
        <div className="card-content">
          <div className="card-content-top">
            {t('invisibleBraces.manufacturing.description')}
          </div>
          <div className="image-container">
            <div className="image-slider">
              <img
                src={images[currentImageIndex]}
                alt="牙套"
                className="product-image"
              />
            </div>
            {/* 示意标注 */}
            <div className="annotation">
            </div>
          </div>
          {/* 下方翻页按钮 */}
          <div className="navigation-buttons">
            <button 
              className="nav-button"
              onClick={handlePrevious}
            >
              ‹
            </button>
            <button 
              className="nav-button"
              onClick={handleNext}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
