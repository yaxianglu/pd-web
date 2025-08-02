import React from 'react';
import ManufacturingSection from './ManufacturingSection';
import FAQ from '../components/FAQ';
import SmileSteps from './process';
import ProductFeatures from './ProductFeatures';

import Header from '../components/header';
import Footer from '../components/footer';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import p1 from './imgs/1.jpg';

export default function PageCom() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<>自信笑容<br />量身訂製</>}
          button1="微笑測試"
          image={p1}
        />
        <Sketch
          title={<>珍舒美隱形牙套矯正如何運作？</>}
          subtitle={<>
          珍舒美隱形牙套專為改變你的笑容而設計。其運作原理是利用更換透明牙套，將牙齒逐漸移動到理想位置，提供一種方便且可靠的方式，幫助笑容變得更加整齊而自信！而且只需要透過上傳照片來進行線上初步微笑預約，來確定隱形牙套適用性，就能開啟你的微笑
升級旅程。通過預約後，我們的專業合作醫師，將會為你進行諮詢與全面檢查，並根據需求和牙齒狀況，來打造最合適你的隱形牙套
方案。當你與醫師都同意進行療程後，珍舒美就會量身為你打造專屬的隱形牙套。以下為珍舒美隱形牙套運作流程：
          </>}
        />
        <SmileSteps />
        <ManufacturingSection />
        <ProductFeatures />
        <FAQ />
      </PageWrapper>
      <Footer />
      </>
  );
} 