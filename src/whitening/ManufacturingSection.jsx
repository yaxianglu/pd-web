import React from "react";
import logo from '../asserts/4.svg';
import './ManufacturingSection.scss';

export default function ManufacturingSection() {
  return (
    <div className="manufacturing-section">
      {/* 标题 */}
      <div className="manufacturing-section-title">
        先進工藝 專業製造
      </div>

      {/* 浏览器样式卡片 */}
      <div className="browser-card">
        {/* 卡片头部 */}
        <div className="card-header">
          <div className="browser-dots">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          <div className="view-label">
            側視圖
          </div>
        </div>

        {/* 内容区块 */}
        <div className="card-content">
          <div className="image-container">
            {/* 牙套示意图片和标注（可自定义图片与内容） */}
            <img
              src={logo}
              alt="牙套"
              className="product-image"
            />
            {/* 示意标注 */}
            <div className="annotation">
            </div>
          </div>
          {/* 下方翻页按钮 */}
          <div className="navigation-buttons">
            <button className="nav-button">
              {"<"}
            </button>
            <button className="nav-button">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
