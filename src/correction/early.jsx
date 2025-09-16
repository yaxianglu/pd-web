import React from 'react';
import './early.scss';
import CardWrapper from '../components/card-wrapper';
import { useLanguage } from '../context/LanguageContext';

export default function Early() {
  const { t } = useLanguage();
  
  return (
    <CardWrapper title={t('correction.earlyCorrection.title')}>
      <div className="early-content">
        <div className="early-content-benefits">
          {t('correction.earlyCorrection.benefits').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('correction.earlyCorrection.benefits').split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
};
