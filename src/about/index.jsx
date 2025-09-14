import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import ManufacturingSection from './ManufacturingSection';
import Footer from '../components/footer';
import Innovation from './innovation';
import Top from './top-new';
import Header2 from './header';
import SmileSteps from '../components/step1/process';

import PageWrapper from '../components/page-wrapper';
import Sketch from '../components/sketch';
import Step from '../components/step';
import VideoList from '../components/video-list';
import Description from './description';
import p3 from './imgs/3.jpg';
import p4 from './imgs/4.svg';
import Creater from './creater';
import CardWrapper from '../components/card-wrapper';

export default function PageCom() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1125);
    };

    window.addEventListener('resize', handleResize);
    
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <Header />
      <Header2 />
      <PageWrapper>
        <Top />
        <Creater />
        <Innovation />
        {
          isMobile ? (
            <SmileSteps />
          ) : (
            <Step />
          )
        }
        <ManufacturingSection />
        <Sketch
          title={<>為什麼選擇珍舒美隱形牙套？</>}
          subtitle={(
            <CardWrapper title="醫療級軟體" style={{ marginTop: 0 }}>
              <div className="about-manufacturing-section-content">
                珍舒美結合最新人工智慧設計演算法與超過30年矯治規劃經驗的專業團隊，為每位患者量身打造個人定制治療方案。治療設計以AI智慧系統為輔助可整合牙根CBCT掃描與側位頭影X光片等三維影像資料，提升矯正的科學性與全面性。<br/><br/>
                珍舒美透過與台灣醫療器材工廠協作，建立龐大的亞洲齒顎資料庫，針對亞洲人常見的齒列問題與臉部輪廓進行優化，包括上顎突出、下巴後縮等狀況，矯正後的成果能更完美，打造符合亞洲人臉部輪廓的微笑曲線。
              </div>
            </CardWrapper>
          )}
        />
        <VideoList />
        <Sketch
          direction='right'
          title={<>品質穩定、交期可靠</>}
          subtitle={<>我們的每一副牙套，皆於通過ISO 13485與GMP認證的台灣牙科工廠製作，<br />
            從原料到製程皆嚴格控管，確保品質穩定、交期可靠。</>}
        />
        <div style={{ width: '100%', height: 'auto', marginTop: '40px', display: 'flex', justifyContent: 'end' }}>
        <img src={p3} alt="#" style={{ width: '70%' }}/>
        </div>
        <Sketch
          title={<>醫療級材料</>}
          subtitle={<>產品採用無BPA高透明度醫療級材料，具有極高透明度，兼具隱形美觀與舒適貼合<br />
            特性，不易染色，易於清潔，讓患者在治療過程中也能自在微笑。</>}
        />
        <div style={{ width: '100%', height: 'auto', marginTop: '40px', display: 'flex', justifyContent: 'start' }}>
            <img src={p4} alt="#" style={{ width: '50%' }}/>
        </div>
      </PageWrapper>
      <Description />
      <Footer style={{ borderTop: 'none' }}/>
      </>
  );
} 