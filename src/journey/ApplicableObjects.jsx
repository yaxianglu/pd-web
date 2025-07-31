import React from 'react';
import './ApplicableObjects.scss';

export default function ApplicableObjects() {
  return (
    <div className="applicable-objects">
      <div className="objects-container">
        <h2 className="objects-title">適用對象</h2>
        
        <div className="cards-wrapper">
          <div className="object-card blue">
            <h3 className="card-title">傳統矯正</h3>
            <p className="card-description">
              完成傳統矯正療程<br />
              後的固定期
            </p>
          </div>
          
          <div className="object-card green">
            <h3 className="card-title">隱形矯正</h3>
            <p className="card-description">
              完成隱形矯正療<br />
              程後的穩定階段
            </p>
          </div>
          
          <div className="object-card orange">
            <h3 className="card-title">回彈復發</h3>
            <p className="card-description">
              有輕微牙齒位移傾向<br />
              希望維持齒列整齊者
            </p>
          </div>
        </div>
        
        <div className="cta-section">
          <button className="diagnosis-button">
            免費診斷是否適合我？
          </button>
        </div>
      </div>
    </div>
  );
} 