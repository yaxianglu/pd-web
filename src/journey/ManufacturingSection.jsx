import React from "react";
import { useResponsive } from '../components/responsive-hook';
import './ManufacturingSection.scss';
import DetailButton from "../components/detail-button";
import CardWrapper from "../components/card-wrapper";
import p12 from '../asserts/12.svg';

export default function ManufacturingSection() {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <CardWrapper title="珍舒美旅程隱形牙套價格特點">
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
            價格公開透明
            </div>
            <div className="card-content-title-price">
              療程費用會根據個人牙齒狀況與選擇的方案（輕度／中度／重度）進行評估。我們提供詳細報<br/>
              價與階段性說明，無額外加價、不含糊，讓您清楚每一筆支出。
            </div>
          </div>
          <div className="card-content-title">
            <div className="card-content-title-title">
            價格親民，<br/>
            專業不妥協
            </div>
            <div className="card-content-title-price">
            珍舒美致力於提供高品質矯正體驗的同時，維持合理價格，讓更多人有機會改善牙齒排列與笑<br/>
            容自信。療效、舒適與價格三者兼顧，是我們一貫的堅持。
            </div>
          </div>
          <div className="card-content-title">
            <div className="card-content-title-title">
            彈性付款方式
            </div>
            <div className="card-content-title-price">
              一次付清享有優惠<br/>
              提供分期付款選項，依需求量身安排<br/>
              支援信用卡、轉帳、行動支付等多種方式<br/>
              我們的目標是讓療程不影響您生活節奏，彈性規畫預算、變美更輕鬆。
            </div>
          </div>
          <div className="card-content-price">
            <div className="pricing-table">
              {/* 左侧复杂度列 */}
              <div className="complexity-column">
                <div className="complexity-header"></div>
                <div className="complexity-item">輕度<span>/複雜程度</span></div>
                <div className="complexity-item">中度<span>/複雜程度</span></div>
                <div className="complexity-item">重度<span>/複雜程度</span></div>
              </div>
              
              {/* 一次性付款列 */}
              <div className="payment-column">
                <div className="payment-header">
                  <div className="payment-title">一次付款</div>
                  <div className="payment-subtitle">一次拿到所有牙套</div>
                  <div className="limited-badge">
                    <img src={p12} alt="#" />
                  </div>
                </div>
                <div className="price-item">$ 48,000</div>
                <div className="price-item">$ 98,000</div>
                <div className="price-item">$ 118,000</div>
              </div>
              
              {/* 分期付款列 */}
              <div className="payment-column installment">
                <div className="payment-header">
                  <div className="payment-title">分期付款</div>
                  <div className="payment-subtitle">12個月零利率</div>
                </div>
                <div className="price-item">$ 48,00</div>
                <div className="price-item">$ 98,00</div>
                <div className="price-item">$ 118,00</div>
              </div>
            </div>
          </div>

          <DetailButton text="我需要哪種治療？" />
        </div>
      </div>
      </CardWrapper>
  );
}
