import React from 'react';
import './index.scss';

export default function Sketch(props) {
  const { title, subtitle, direction = 'left', children, variant = 'default' } = props;
  
  return (
    <div className={`sketch-bottom-text sketch-bottom-text-${direction} sketch-bottom-text-${variant}`}>
      <div className={`section-title section-title-${direction}`}>
        {title}
      </div>
      {subtitle ? (
        <div className={`section-subtitle section-subtitle-${direction}`}>
          {subtitle}
        </div>
      ) : null}
      {children}
    </div>
  );
}
