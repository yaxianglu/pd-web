import React, { useState } from "react";
import './ManufacturingSection.scss';
import CardWrapper from "../components/card-wrapper";
import p1 from './imgs/1.jpg';
import p2 from './imgs/2.jpg';

export default function ManufacturingSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [p1, p2];
  const labels = ['側視圖', '正視圖'];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <CardWrapper
      title="先進工藝 專業製造"
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
            珍舒美牙套亦可支援與傳統矯正療程結合，作為中後期的收尾階段、細節微調或美觀優化使用，適合期望從固定牙套順利<br/>
            過渡至透明牙套的使用者。
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
