import React from 'react';
import { useResponsive } from '../responsive-hook';
import './index.scss';

export default function Sketch(props) {
  const { title, subtitle, direction = 'left' } = props;
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <div className={`sketch-bottom-text sketch-bottom-text-${direction}`}>
      <div className={`section-title section-title-${direction}`}>
        {title}
      </div>
      <div className={`section-subtitle section-subtitle-${direction}`}>
        {subtitle}
      </div>
    </div>
  );
}
