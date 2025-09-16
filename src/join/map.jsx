import React from 'react';
import './map.scss';
import CardWrapper from '../components/card-wrapper';
import p2 from './imgs/2.svg';
import { useLanguage } from '../context/LanguageContext';

export default function Map() {
  const { t } = useLanguage();
  
  return (
    <CardWrapper title={t('join.map.title')}>
      <div className="map-section">
       <div className="map-section-title-wrapper">
        <div className="map-section-title">
            <div className="map-section-title-text">
              {t('join.map.locations.taiwan.name')}
            </div>
            <div className="map-section-title-description">
              {t('join.map.locations.taiwan.description')}
            </div>
          </div>
          <div className="map-section-title">
            <div className="map-section-title-text">
              {t('join.map.locations.usa.name')}
            </div>
            <div className="map-section-title-description">
              {t('join.map.locations.usa.description')}
            </div>
          </div>
          <div className="map-section-title">
            <div className="map-section-title-text">
              {t('join.map.locations.other.name')}
            </div>
            <div className="map-section-title-description">
              {t('join.map.locations.other.description')}
            </div>
          </div>
       </div>
       <div className="map-section-content">
        <img src={p2} alt="#" />
       </div>
      </div>
    </CardWrapper>
  );
}