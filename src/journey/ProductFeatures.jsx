import React from 'react';
import './ProductFeatures.scss';
import p8 from './imgs/8.svg';
import p9 from './imgs/9.svg';
import p10 from './imgs/10.svg';
import CardWrapper from '../components/card-wrapper';
import Grid from '../components/grid';
import useMobile from '../hooks/mobile.tsx';
import { useLanguage } from '../context/LanguageContext';
import { useResponsive } from '../components/responsive-hook';

export default function ProductFeatures() {
  const { t } = useLanguage();
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <CardWrapper title={t('journey.additionalCosts.title')}>
      <div className="product-features-content">
        <div className="product-features-item product-features-item-1">
          {t('journey.additionalCosts.description').split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t('journey.additionalCosts.description').split('\n').length - 1 && <br/>}
            </React.Fragment>
          ))}
        </div>
        <div className="product-features-item product-features-item-2">
          {t('journey.additionalCosts.subtitle')}
        </div>
        <Grid style={ isMobile ? { flexDirection: 'column', width: '60%', marginLeft: '20%' } : {}}>
          <div className="product-features-item-3-wrapper-item">
            <div className="product-features-item-3-wrapper-item-content">
              <div className="product-features-item-3-wrapper-item-content-title">
                {t('journey.additionalCosts.items.consultation.title')}
              </div>
              <div className="product-features-item-3-wrapper-item-content-price">
                {t('journey.additionalCosts.items.consultation.price')}
              </div>
              <div className="product-features-item-3-wrapper-item-content-description">
                {t('journey.additionalCosts.items.consultation.description').split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < t('journey.additionalCosts.items.consultation.description').split('\n').length - 1 && <br/>}
                  </span>
                ))}
              </div>
            </div>
            <div className="product-features-item-3-wrapper-item-image">
              <img src={p8} alt="p8" />
            </div>
          </div>
          <div className="product-features-item-3-wrapper-item">
            <div className="product-features-item-3-wrapper-item-content">
              <div className="product-features-item-3-wrapper-item-content-title">
                {t('journey.additionalCosts.items.fineTuning.title').split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < t('journey.additionalCosts.items.fineTuning.title').split('\n').length - 1 && <br/>}
                  </span>
                ))}
              </div>
              <div className="product-features-item-3-wrapper-item-content-price">
                {t('journey.additionalCosts.items.fineTuning.price')}
              </div>
              <div className="product-features-item-3-wrapper-item-content-description">
                {t('journey.additionalCosts.items.fineTuning.description')}
              </div>
            </div>
            <div className="product-features-item-3-wrapper-item-image">
              <img src={p9} alt="p8" />
            </div>
          </div>
          <div className="product-features-item-3-wrapper-item">
            <div className="product-features-item-3-wrapper-item-content">
              <div className="product-features-item-3-wrapper-item-content-title">
                {t('journey.additionalCosts.items.retainers.title')}
              </div>
              <div className="product-features-item-3-wrapper-item-content-description">
                {t('journey.additionalCosts.items.retainers.description').split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < t('journey.additionalCosts.items.retainers.description').split('\n').length - 1 && <br/>}
                  </span>
                ))}
              </div>
            </div>
            <div className="product-features-item-3-wrapper-item-image">
              <img src={p10} alt="p8" />
            </div>
          </div>
        </Grid>
        <div className="product-features-item product-features-item-3">
          {t('journey.additionalCosts.footnotes').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('journey.additionalCosts.footnotes').split('\n').length - 1 && <br/>}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
} 