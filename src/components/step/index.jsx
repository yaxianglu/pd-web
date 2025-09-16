import React from 'react';
import './index.scss';
import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';
import p3 from './imgs/3.svg';
import p4 from './imgs/4.svg';
import p5 from './imgs/5.svg';
import { useLanguage } from '../../context/LanguageContext';

export default function Step(props) {
  const { title, description } = props;
  const { t } = useLanguage();
  
  const steps = [
    {
      image: p1,
      text: t('about.smileSteps.step1.title')
    },
    {
      image: p2,
      text: t('about.smileSteps.step2.title')
    },
    {
      image: p3,
      text: t('about.smileSteps.step3.title')
    },
    {
      image: p4,
      text: t('about.smileSteps.step4.title')
    },
    {
      image: p5,
      text: t('about.smileSteps.step5.title')
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