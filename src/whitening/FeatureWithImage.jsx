import React from "react";
import png6 from '../asserts/6.png';
import png7 from '../asserts/7.png';
import png8 from '../asserts/8.png';
import png9 from '../asserts/9.png';
import png10 from '../asserts/10.png';
import png11 from '../asserts/11.png';
import './FeatureWithImage.scss';

export default function FeatureWithImage() {
  return (
    <div className="feature-with-image">
      <div className="content-container">
        {/* 左侧内容 */}
        <div className="left-content">
          <div className="feature-grid-2">
            {/* 第一行 */}
            <div className="feature-item">
              <div className="icon-section">
                {/* FDA盾牌icon */}
                <img src={png6} alt="FDA" className="feature-icon" />
                <span className="feature-title">FDA</span>
              </div>
              <div className="feature-subtitle">美國品牌 FDA認證</div>
              <div className="feature-description">
                源自美國矽谷，產品通過美國食品藥品管理局（FDA）認證，符合國際醫療器材安全與效能標準。
              </div>
            </div>

            <div className="feature-item">
              <div className="icon-section">
                {/* AI人群icon */}
                <img src={png7} alt="AI" className="feature-icon" />
              </div>
              <div className="feature-subtitle">科技輔助 專業主導</div>
              <div className="feature-description">
                矯正方案由專業團隊規劃，搭配AI 精準模擬牙齒移動，提升預測性與效率。
              </div>
            </div>

            <div className="feature-item">
              <div className="icon-section">
                {/* 透明度icon */}
                <img src={png8} alt="透明度" className="feature-icon" />
              </div>
              <div className="feature-subtitle">高透明度 幾乎無感</div>
              <div className="feature-description">
                採用 BPA 醫療級高透明材質，避光黃、配戴舒適，幾乎隱形，不影響日常生活與社交。
              </div>
            </div>

            {/* 横线 */}
            <div className="divider" />

            {/* 第二行 */}
            <div className="feature-item">
              <div className="icon-section">
                {/* 個人化icon */}
                <img src={png9} alt="個人化" className="feature-icon" />
              </div>
              <div className="feature-subtitle">個人化療程分級</div>
              <div className="feature-description">
                提供 Bright, Brighter, Brightest 三種矯正難度選項，依照牙齒排列與咬合需求精準規劃。
              </div>
            </div>

            <div className="feature-item">
              <div className="icon-section">
                {/* 3D設計icon */}
                <img src={png10} alt="3D" className="feature-icon" />
              </div>
              <div className="feature-subtitle">三維影像整合設計</div>
              <div className="feature-description">
                支援整合 CBCT 與側顱 X 光影像資料，提升診斷深度與咬合設計的全面性。
              </div>
            </div>

            <div className="feature-item">
              <div className="icon-section">
                {/* 台灣製造icon */}
                <img src={png11} alt="台灣製造" className="feature-icon" />
              </div>
              <div className="feature-subtitle">台灣製造 品質穩定</div>
              <div className="feature-description">
                牙套製作於通過 ISO 13485與 GMP/QMS認證的台灣醫療器材廠，確保每一副產品品質穩定、交期明確。
              </div>
            </div>
          </div>
        </div>
        {/* 右侧图片 */}
        <div className="right-image">
          {/* 半圆色块 */}
          <div className="background-circle" />
          {/* 牙套图片（替换src为你的资源） */}
          {/* <img
            src={logo}
            alt="牙套"
            className="product-image"
          /> */}
        </div>
      </div>
    </div>
  );
}
