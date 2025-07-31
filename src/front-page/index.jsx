import React from 'react';
import FeatureGrid from './FeatureGrid';
import p5 from './imgs/5.svg';

import Header from '../components/header';
import Footer from '../components/footer';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';

export default function PageCom() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<span style={{ fontSize: 56 }}>SHINE BRIGHT<br />ALIGN RIGHT</span>}
          subtitle="笑容不只是整齊，更應自信發光。"
          button1="微笑測試"
          button2="關於珍舒美"
          image={p5}
          description={<>高透明度材質與口腔護理方案，讓你每個笑容自然明亮<br />AI技術輔助與臨床專業設計，實現客製化的科學矯正效果</>}
        />
        <Sketch
          title={<>從療程設計到治療完成，我們始終專注於每一個細節，<br />
            為你提供值得信賴的矯正體驗。<br />
            因為我們相信，擁有整齊笑容，光芒與自信就會自然綻放。</>}
        />
        <FeatureGrid />
      </PageWrapper>
      <Footer />
      </>
  );
} 