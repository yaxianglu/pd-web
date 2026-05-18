import React from 'react';
import './index.scss';

export default function Grid3(props) {
  const { children, style, className = '' } = props;
  return (
    <div className={`grid-3-container ${className}`.trim()} style={style}>{children}</div>
  );
}
