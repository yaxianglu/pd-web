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
import p4 from './imgs/4.png';
import Creater from './creater';
import CardWrapper from '../components/card-wrapper';
import { useLanguage } from '../context/LanguageContext';

export default function PageCom() {
  const { t } = useLanguage();
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
            <SmileSteps showDetails={false} />
          ) : (
            <Step />
          )
        }
        <ManufacturingSection />
        <Sketch
          title={<>{t('about.whyChooseTitle')}</>}
          subtitle={(
            <CardWrapper title={t('about.medicalSoftware')} style={{ marginTop: 0 }}>
              <div className="about-manufacturing-section-content">
                {t('about.medicalSoftwareDescription')}<br/><br/>
                {t('about.medicalSoftwareDescription2')}
              </div>
            </CardWrapper>
          )}
        />
        <VideoList />
        <Sketch
          direction='right'
          title={<>{t('about.qualityTitle')}</>}
          subtitle={<>{t('about.qualityDescription')}</>}
        />
        <div style={{ width: '100%', height: 'auto', marginTop: '40px', display: 'flex', justifyContent: 'end' }}>
        <img src={p3} alt="#" style={{ width: '70%' }}/>
        </div>
        <Sketch
          title={<>{t('about.materialTitle')}</>}
          subtitle={<>{t('about.materialDescription')}</>}
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