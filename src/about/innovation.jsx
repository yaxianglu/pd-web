import React from 'react';
import './innovation.scss';
import CardWrapper from '../components/card-wrapper';

export default function Innovation() {
  return (
    <CardWrapper title="聯合矯正的創新理念">
      <div className="innovation-section-content">
        <div className="innovation-section-content-title">
        目前珍舒美專注提供完整隱形牙套療程，我們的產品亦可彈性支援作為部分患者的收尾使用或與固定式矯正的轉接應
        用。未來，我們也將持續與臨床醫師合作，拓展聯合矯正的完整解決方案。<br/><br/>
          珍舒美是業界少數專注於聯合矯正（Combo Treatment）的品牌之一。
        </div>
        <div className="innovation-section-content-description">
        我們觀察到許多傳統固定矯正器（牙套）患者在治療後期，期望能以隱形矯正器完成細節微調或收尾階段，因此，我們發展出一套完整支援從固定<br />
        矯正過渡至隱形矯正的治療流程。
        </div>
      </div>
    </CardWrapper>
  );
}