import React from 'react';
import FeatureWithImage from './FeatureWithImage';
import ManufacturingSection from './ManufacturingSection';
import WhichPlan from './PlanCard';
import BrandCompareTable from './BrandCompareTable';
import FAQ from '../components/FAQ';

import Header from '../components/header';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import Footer from '../components/footer';
import p5 from '../asserts/5.jpg';

export default function PageCom() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail
          title={<>美國品牌，<br />FDA認證</>}
          subtitle={<>矯正方案由專業團隊規劃，<br /><b>AI</b> 精準模擬牙齒移動，<br />提升預測性與效率。</>}
          button1="微笑測試"
          image={p5}
        />
        <Sketch
          title="為什麼選擇珍舒美隱形牙套?"
          subtitle={<>
            珍舒美為美國 Pearl Digital Inc. 旗下品牌，結合人工智慧技術與亞洲臉型設<br />計經驗，專為東方人打造的智慧隱形矯正系統。產品已通過美國 FDA 認證，<br />品質與安全皆達到國際醫材標準。<br />我們相信，矯正療程不只是為了排列整齊，更是邁向健康與自信的改變歷程。</>}
        />
        <FeatureWithImage />
        <ManufacturingSection />
        <WhichPlan />
        <BrandCompareTable />
        <FAQ />
      </PageWrapper>
      <Footer />
      </>
  )
} 