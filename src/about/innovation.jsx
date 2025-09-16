import React from 'react';
import './innovation.scss';
import CardWrapper from '../components/card-wrapper';
import { useLanguage } from '../context/LanguageContext';

export default function Innovation() {
  const { t } = useLanguage();
  
  return (
    <CardWrapper title={t('about.innovationTitle')}>
      <div className="innovation-section-content">
        <div className="innovation-section-content-title">
        {t('about.innovationDescription')}<br/><br/>
        {t('about.innovationSubtitle')}
        </div>
        <div className="innovation-section-content-description">
        {t('about.innovationDetail')}
        </div>
      </div>
    </CardWrapper>
  );
}