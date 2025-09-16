import React from "react";
import './ManufacturingSection.scss';
import { useLanguage } from '../context/LanguageContext';

export default function ManufacturingSection() {
  const { t } = useLanguage();
  
  return (
    <div className="about-manufacturing-section">
      <div className="about-manufacturing-section-title">{t('about.preciseControl')}</div>
      <div className="about-manufacturing-section-description">
        {t('about.preciseControlDescription')}
      </div>
    </div>
  );
}
