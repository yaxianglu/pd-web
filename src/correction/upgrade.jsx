import React from "react";
import { useResponsive } from '../components/responsive-hook';
import './BrandCompareTable.scss';
import GrayCard from "../components/gray-card";
import ContentTextImg from "../components/content-text-img";
import p12 from './imgs/12.svg';
import p13 from './imgs/13.svg';

export default function Upgrade() {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <GrayCard
      title="矯正不只是變美，更是生活的升級"
      description="對成年人而言，正畸往往兼具審美需求與功能改善。整齊的牙齒不僅帶來自然對稱的笑容與臉部比例，也有以下實質幫助："
    >
      <ContentTextImg
        image={p12}
        title="對美容的影響："
        description={
          <>
            調整齒列後，唇形自然飽滿、臉型線條更流暢<br />
            有助改善下巴後縮、嘴突等亞洲常見外觀問題<br />
            讓笑容與眼神更有自信與親和力，提升整體氣質
          </>
        }
      />
      <ContentTextImg
        image={p13}
        imgRight={false}
        title="配合成人節奏與需求："
        description={
          <>
            珍舒美的隱形牙套療程設計靈活彈性、可拆卸配戴，讓你在<br />
            工作會議、社交活動、出差旅程中都能自在應對。
          </>
        }
      />
    </GrayCard>
  );
}
