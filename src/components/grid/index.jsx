import React from 'react';
import './index.scss';

export default function Grid3(props) {
  const { children, style } = props;
  return (
    <div className="grid-3-container" style={style}>{children}</div>
  );
}