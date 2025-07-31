import React from "react";
import png6 from './imgs/1.svg';
import png7 from './imgs/2.svg';
import png8 from './imgs/3.svg';
import png9 from './imgs/4.svg';
import png10 from './imgs/5.svg';
import png11 from './imgs/6.svg';
import './FeatureWithImage.scss';
import SubCard from "../components/sub-card";
import Grid3 from "../components/grid";
import CardWrapper from "../components/card-wrapper";

export default function FeatureWithImage() {
  return (
    <CardWrapper>
      <Grid3>
        <SubCard img={png6} title="美國品牌 FDA認證" description={<>源自美國矽谷，產品通過美國食品藥<br/>品管理局（FDA）認證，符合國際醫療<br/>器材安全與效能標準。</>} />
        <SubCard img={png7} title="科技輔助 專業主導" description={<>矯正方案由專業團隊規劃，搭配 AI 精準<br/>模擬牙齒移動，提升預測性與效率。</>} />
        <SubCard img={png8} title="高透明度 幾乎無感" description={<>採用無 BPA 醫療級高透明材質，邊緣<br/>光滑、配戴舒適，幾乎隱形，不影響<br/>日常生活與社交。</>} />
      </Grid3>
      <div className="divider" />
      <Grid3>
        <SubCard img={png9} title="個人化療程分級" description={<>提供三種矯正強度選項，依照牙齒排列<br/>與咬合需求精準規劃。</>} />
        <SubCard img={png10} title="三維影像整合設計" description={<>支援整合 CBCT 與側顱 X 光影像資料，<br/>提升診斷深度與咬合設計的全面性。</>} />
        <SubCard img={png11} title="台灣製造 品質穩定" description={<>牙套製作於通過 ISO 13485 與 GMP/QMS<br/>認證的台灣醫療器材廠，確保每一副產品<br/>品質穩定、交期明確。</>} />
      </Grid3>
    </CardWrapper>
  );
}
