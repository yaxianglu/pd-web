import React from "react";
import './ManufacturingSection.scss';
import CardWrapper from '../components/card-wrapper';
import DetailButton from '../components/detail-button';
import { useLanguage } from '../context/LanguageContext';

export default function ManufacturingSection() {
  const { t } = useLanguage();
  
  return (
    <CardWrapper>
      <div className="correction-manufacturing-section">
        <DetailButton text={t('correction.manufacturingSection.buttonText')} style={{ marginTop: 0 }} size="small" />
        <div className="correction-manufacturing-section-description">
          {t('correction.manufacturingSection.description').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('correction.manufacturingSection.description').split('\n').length - 1 && <br/>}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}
