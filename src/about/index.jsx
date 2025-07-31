import React from 'react';
import Header from '../components/header';
import ManufacturingSection from './ManufacturingSection';
import Footer from '../components/footer';
import Innovation from './innovation';
import Top from './top';

import PageWrapper from '../components/page-wrapper';
import Sketch from '../components/sketch';
import Step from '../components/step';
import VideoList from '../components/video-list';
import Description from './description';
import p3 from './imgs/3.svg';
import p4 from './imgs/4.svg';

export default function PageCom() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Top />
        <Innovation />
        <Step />
        <ManufacturingSection />
        <Sketch
          title={<>為什麼選擇珍舒美隱形牙套？</>}
          subtitle={<>珍舒美結合最新人工智慧設計演算法與超過30年矯治規劃經驗的專業團隊，<br />
            為每位患者量身打造個人定制治療方案。治療設計可整合牙根CBCT掃描與側<br />
            位頭影X光片等三維影像資料，提升矯正的科學性與全面性。</>}
        />
        <VideoList />
        <Sketch
          title={<>品質穩定、交期可靠</>}
          subtitle={<>我們的每一副牙套，皆於通過ISO 13485與GMP認證的台灣醫療器材工廠製作，<br />
            從原料到製程皆嚴格控管，確保品質穩定、交期可靠。</>}
        />
        <div style={{ width: '100%', height: 'auto', marginTop: '40px', display: 'flex', justifyContent: 'start' }}>
            <img src={p3} alt="#" style={{ width: '70%' }}/>
        </div>
        <Sketch
          direction='right'
          title={<>醫療級軟體</>}
          subtitle={<>產品採用無BPA高透明度醫療級材料，具有極高透明度，兼具隱形美觀與舒適貼合<br />
            特性，不易染色，易於清潔，讓患者在治療過程中也能自在微笑。</>}
        />
        <div style={{ width: '100%', height: 'auto', marginTop: '40px', display: 'flex', justifyContent: 'end' }}>
            <img src={p4} alt="#" style={{ width: '50%' }}/>
        </div>
      </PageWrapper>
      <Description />
      <Footer style={{ borderTop: 'none' }}/>
      </>
  );
} 