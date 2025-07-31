import React from 'react';
import './index.scss';

export default function SubCard(props) {
  const { img, description, title } = props;
  return (
    <div className="sub-card-item">
      <div className="icon-section">
        <img src={img} alt="FDA" className="sub-card-icon" />
      </div>
      <div className="sub-card-subtitle">{title}</div>
      <div className="sub-card-description">
        {description}
      </div>
    </div>
  );
}