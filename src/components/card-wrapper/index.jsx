import React from "react";
import './index.scss';

export default function CardWrapper({ title, subtitle, children }) {
  return (
    <div className="card-wrapper">
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
