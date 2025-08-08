import React from "react";
import './index.scss';

export default function CardWrapper({ title, subtitle, children, style }) {
  return (
    <div className="card-wrapper" style={style}>
      {title && <div className="card-wrapper-title">
        {title}
      </div>}
      {subtitle && <div className="card-wrapper-subtitle">
        {subtitle}
      </div>}
      <div className="card-wrapper-content">
        {children}
      </div>
    </div>
  );
}
