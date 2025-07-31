import React from 'react';
import './ApplicableObjects.scss';
import CardWrapper from '../components/card-wrapper';

export default function ApplicableObjects() {
  return (
    <CardWrapper
      title="適用對象"
      subtitle={<>
        珍舒美白,不只是讓牙齒變白,更讓笑容自然綻放、健康加乘。<br />
        搭配矯正療程,成就全面自信笑容。</>}
    >
      <div className="content-wrapper">
        {/* 左侧蓝色框 */}
        <div className="treatment-phase">
          <div className="phase-box">
            <div className="phase-number">01</div>
            <div className="phase-content">
              <span className="phase-title">治療階段</span>
              <p className="phase-description">
                隱形牙套或維持器配戴中的使用者
              </p>
            </div>
          </div>
        </div>
        
        {/* 右侧列表 */}
        <div className="condition-item">
          <div className="condition-number">02</div>
          <div className="condition-content">
            <span className="condition-title">日常生活</span>
            <p className="condition-description">
              想在日常中輕鬆提高牙齒亮度者
            </p>
          </div>
        </div>
        
        <div className="condition-item">
          <div className="condition-number">03</div>
          <div className="condition-content">
            <span className="condition-title">牙齒敏感患者</span>
            <p className="condition-description">
              曾使用美白產品感到敏感不適者
            </p>
          </div>
        </div>
        
        <div className="condition-item">
          <div className="condition-number">04</div>
          <div className="condition-content">
            <span className="condition-title">美白需求</span>
            <p className="condition-description">
              希望在矯正期間兼顧外觀與牙齒健康者
            </p>
          </div>
        </div>
      </div>
    </CardWrapper>
    // <div className="applicable-objects">
    //   <div className="objects-container">
    //     <div className="header-section">
    //       <h2 className="objects-title">適用對象</h2>
    //       <p className="intro-description">
    //       </p>
    //     </div>

        
    //     <div className="cta-section">
    //       <button className="diagnosis-button">
    //         免費診斷是否適合我？
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
} 