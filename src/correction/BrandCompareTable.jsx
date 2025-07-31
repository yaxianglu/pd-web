import React from "react";
import './BrandCompareTable.scss';
import p8 from './imgs/8.svg';
import p9 from './imgs/9.svg';
import p10 from './imgs/10.svg';
import GrayCard from "../components/gray-card";

export default function ManufacturingSection() {
  return (
    <GrayCard
      title="關鍵發育期的最佳介入時機"
      description="青少年階段,牙齒與顎骨尚在發育,矯正治療的穩定性與適應性最佳。根據不同年齡與齒列階段,可大致分為以下三期:"
    >
      <div className="timing-sections">
        {/* 换牙期 */}
        <div className="timing-section">
          <div className="timing-image">
            <img src={p8} alt="换牙期儿童" />
          </div>
          <div className="timing-content">
            <div className="timing-title">換牙期 (約6-12歲)</div>
            <div className="timing-description">
              乳牙與恆牙交替階段，<br/>
              可早期發現咬合異常，<br/>
              如反咬、深咬、開咬等
            </div>
          </div>
        </div>

        {/* 恒牙初期 */}
        <div className="timing-section">
          <div className="timing-image">
            <img src={p9} alt="恒牙初期青少年" />
          </div>
          <div className="timing-content">
            <div className="timing-title">恆牙初期 (約12-15歲)</div>
            <div className="timing-description">
              齒列逐步穩定，是矯正<br/>
              介入的黃金時機
            </div>
          </div>
        </div>

        {/* 颚骨调整期 */}
        <div className="timing-section">
          <div className="timing-image">
            <img src={p10} alt="颚骨调整期青少年" />
          </div>
          <div className="timing-content">
            <div className="timing-title">顎骨調整期 (青春成長高峰)</div>
            <div className="timing-description">
              此時面型發展仍具引導空間，<br/>
              可透過牙套與專業矯正裝置，<br/>
              促進或抑制顎側的生長。
            </div>
          </div>
        </div>
      </div>
    </GrayCard>
  );
}
