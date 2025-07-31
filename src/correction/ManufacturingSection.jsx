import React from "react";
import './ManufacturingSection.scss';
import CardWrapper from '../components/card-wrapper';
import DetailButton from '../components/detail-button';

export default function ManufacturingSection() {
  return (
    <CardWrapper>
      <div className="correction-manufacturing-section">
        <DetailButton text="了解你的牙齒狀況" style={{ marginTop: 0 }} size="small" />
        <div className="correction-manufacturing-section-description">
          透過結合三維影像（CBCT、側顱X光），深入了解每位患者的獨特面部結構和需求，<br/>
          珍舒美能針對骨架與牙列同時進行分析與調整，讓面部輪廓與咬合功能一併優化，從<br/>
          「牙」開始，打造更自然協調的美。
        </div>
      </div>
    </CardWrapper>
  );
}
