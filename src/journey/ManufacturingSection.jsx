import React from "react";
import { useResponsive } from '../components/responsive-hook';
import './ManufacturingSection.scss';
import DetailButton from "../components/detail-button";
import CardWrapper from "../components/card-wrapper";
import p12 from '../asserts/12.svg';
import { useLanguage } from '../context/LanguageContext';

export default function ManufacturingSection() {
  const { isMobile, isTablet } = useResponsive();
  const { t, currentLanguage } = useLanguage();
  
  return (
    <CardWrapper title={t('journey.pricingFeatures.title')}>
      <div className="browser-card">
        {/* 卡片头部 */}
        <div className="card-header">
          <div className="browser-dots">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
        </div>

        {/* 内容区块 */}
        <div className="card-content">
          <div className="card-content-title">
            <div className="card-content-title-title">
              {t('journey.pricingFeatures.transparentPricing.title')}
            </div>
            <div className="card-content-title-price">
              {t('journey.pricingFeatures.transparentPricing.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('journey.pricingFeatures.transparentPricing.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
          <div className="card-content-title">
            <div className="card-content-title-title">
              {t('journey.pricingFeatures.affordablePricing.title').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('journey.pricingFeatures.affordablePricing.title').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
            <div className="card-content-title-price">
              {t('journey.pricingFeatures.affordablePricing.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('journey.pricingFeatures.affordablePricing.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
          {/* <div className="card-content-title">
            <div className="card-content-title-title">
            彈性付款方式
            </div>
            <div className="card-content-title-price">
              一次付清享有優惠<br/>
              提供分期付款選項，依需求量身安排<br/>
              支援信用卡、轉帳、行動支付等多種方式<br/>
              我們的目標是讓療程不影響您生活節奏，彈性規畫預算、變美更輕鬆。
            </div>
          </div> */}
          {currentLanguage !== 'en' && (
            <div className="card-content-price">
              <div className="pricing-table">
                {/* 左侧复杂度列 */}
                <div className="complexity-column">
                  {/* <div className="complexity-header"></div> */}
                  <div className="complexity-item">{t('journey.pricingFeatures.pricingTable.mild')}</div>
                  <div className="complexity-item">{t('journey.pricingFeatures.pricingTable.moderate')}</div>
                  <div className="complexity-item">{t('journey.pricingFeatures.pricingTable.severe')}</div>
                </div>
                
                {/* 一次性付款列 */}
                <div className="payment-column">
                  {/* <div className="payment-header">
                    <div className="payment-title">一次付款</div>
                    <div className="payment-subtitle">一次拿到所有牙套</div>
                    <div className="limited-badge">
                      <img src={p12} alt="#" />
                    </div>
                  </div> */}
                  <div className="price-item">$ 48,000</div>
                  <div className="price-item">$ 98,000</div>
                  <div className="price-item">$ 118,000</div>
                </div>
                
                {/* 分期付款列 */}
                {/* <div className="payment-column installment">
                  <div className="payment-header">
                    <div className="payment-title">分期付款</div>
                    <div className="payment-subtitle">12個月零利率</div>
                  </div>
                  <div className="price-item">$ 40,00</div>
                  <div className="price-item">$ 81,67</div>
                  <div className="price-item">$ 98,33</div>
                </div> */}
              </div>
            </div>
          )}

          <DetailButton text={t('journey.pricingFeatures.buttonText')} />
        </div>
      </div>
      </CardWrapper>
  );
}
