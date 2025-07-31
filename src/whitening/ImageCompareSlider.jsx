import React, { useState, useRef, useEffect } from 'react';
import p1 from '../components/compare/1.png';
import p2 from '../components/compare/2.png';
import './ImageCompareSlider.scss';

export default function ImageCompareSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="image-compare-slider">
      <div className="slider-container">
        <h2 className="slider-title">產品對比</h2>
        <div 
          className="compare-container" 
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 背景图片（第二张图片） */}
          <div className="background-image">
            <img src={p2} alt="对比图片2" />
          </div>
          
          {/* 前景图片（第一张图片） */}
          <div 
            className="foreground-image"
            style={{ width: `${sliderPosition}%` }}
          >
            <img src={p1} alt="对比图片1" />
          </div>
          
          {/* 滑块 */}
          <div 
            className="slider-handle"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
          >
            <div className="slider-button">
              <div className="slider-arrow left">◀</div>
              <div className="slider-arrow right">▶</div>
            </div>
            <div className="slider-line"></div>
          </div>
          
          {/* 标签 */}
          <div className="image-labels">
            <div className="label left">Before</div>
            <div className="label right">After</div>
          </div>
        </div>
      </div>
    </div>
  );
} 