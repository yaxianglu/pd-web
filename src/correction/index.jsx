import React from 'react';
import Header from '../components/header';
import ProductFeatures from './ProductFeatures';
import ManufacturingSection from './ManufacturingSection';
import WhichPlan from './PlanCard';
import BrandCompareTable from './BrandCompareTable';
import Footer from '../components/footer';
import FAQ from '../components/FAQ';
import p17 from './imgs/1.jpg';
import Early from './early';
import p7 from './imgs/7.jpg';
import p11 from './imgs/11.jpg';
import Upgrade from './upgrade';

import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import DetailButton from '../components/detail-button';

export default function PageCom() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<>矯正治療<br />長遠改變</>}
          subDescription={<>齒列整齊不只是為了外觀，更關乎咬<br />
            合、發育、說話、呼吸，甚至整體自信<br />
            與生活品質。正確的矯正治療，能帶來<br />
            健康與美感兼具的長遠改變。</>}
          button1="微笑測試"
          image={p17}
        />
        <Sketch
          title={<>亞洲人常見齒列問題與面型影響</>}
          subtitle={<>因亞洲人的基因表現與顱顏特徵，常有以下牙齒排列與<br />
            骨性咬合問題，進而影響整體臉型的外貌:</>}
        />
        <ProductFeatures />
        <ManufacturingSection />
        <WhichPlan image={p7} background="rgba(99, 147, 241, 0.8)"/>
        <BrandCompareTable />
        <Early />
        <WhichPlan
          image={p11}
          background="rgba(180,221,24, 0.8)"
          imgRight={false}
          title={"成人正畸"}
          description={<>
            成人也能擁有理想笑容與穩定咬合。矯正除了<br />
            改善外觀，更能降低牙周病與磨牙風險、改善<br />
            口腔清潔效果，甚至協助齒列與面部比例協<br />
            調，展現更自然的個人氣質。<br />
            無論年齡，微笑都值得被重新設計。
          </>}
        />
        <Upgrade />
        <DetailButton text="開啟微笑旅程"/>
        <FAQ />
      </PageWrapper>
      <Footer />
      </>
  );
} 