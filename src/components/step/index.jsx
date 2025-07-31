import React from 'react';
import './index.scss';
import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';
import p3 from './imgs/3.svg';
import p4 from './imgs/4.svg';
import p5 from './imgs/5.svg';

export default function Step(props) {
  const { title, description } = props;
  
  const steps = [
    {
      image: p1,
      text: '預約'
    },
    {
      image: p2,
      text: '評估'
    },
    {
      image: p3,
      text: '計畫'
    },
    {
      image: p4,
      text: '旅程'
    },
    {
      image: p5,
      text: '開懷'
    }
  ];

  return (
    <div className="step-section">
      {steps.map((step, index) => (
        <div key={index} className="step-item">
          <div className="step-img-wrapper">
            <img src={step.image} alt={`Step ${index + 1}`} />
          </div>
          <div className="step-line">
            <div className={`step-line-dot step-line-dot-${index === 0 ? 'first' : index === steps.length - 1 ? 'last' : ''}`}></div>
          </div>
          <div className="step-text">
            {step.text}
          </div>
        </div>
      ))}
    </div>
  );
}