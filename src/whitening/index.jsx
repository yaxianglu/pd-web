import React from 'react';
import Header from '../components/header';
import ProductFeatures from './ProductFeatures';
import Footer from '../components/footer';
import ApplicableObjects from './ApplicableObjects';
import FAQ from '../components/FAQ';
import p1 from './imgs/1.svg';

import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';

export default function PageCom() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<>自信，<br />從齒開始</>}
          subtitle="亮白不只外表，自信從齒開始"
          button1="微笑測試"
          image={p1}
        />
        <Sketch
          title={<>日常笑容中的光彩，來自潔白健康的牙齒。</>}
          subtitle={<>珍舒美白系列推出專為矯正療程期間與日常口腔護理設計的牙齒美白筆，<br />
            不僅追求亮白效果，更重視牙齒健康與使用體驗。</>}
        />
        <ProductFeatures />
        <ApplicableObjects />
        <FAQ />
      </PageWrapper>
      <Footer />
      </>
  );
} 