import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.scss';

export default function ImageCompareSlider({ image1, image2 }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const updateSliderPosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    // 使用 requestAnimationFrame 确保平滑更新
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setSliderPosition(percentage);
      // 更新CSS变量
      if (containerRef.current) {
        containerRef.current.style.setProperty('--slider-position', `${percentage}%`);
      }
    });
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    updateSliderPosition(touch.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleContainerClick = useCallback((e) => {
    if (e.target.closest('.slider-handle')) return;
    updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);

  // 初始化CSS变量
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--slider-position', '50%');
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="image-compare-slider">
      <div className="slider-container">
        <div 
          className="compare-container" 
          ref={containerRef}
          onClick={handleContainerClick}
          onTouchStart={handleTouchStart}
        >
          {/* 背景图片（第二张图片） */}
          <div className="background-image">
            <img src={image2} alt="对比图片2" />
          </div>
          
          {/* 前景图片（第一张图片） */}
          <div className="foreground-image">
            <img src={image1} alt="对比图片1" />
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
        </div>
      </div>
    </div>
  );
} 