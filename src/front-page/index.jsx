import React from 'react';
import FeatureGrid from './FeatureGrid';
import p5 from './imgs/5.jpg';

import Header from '../components/header';
import Footer from '../components/footer';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import { useLanguage } from '../context/LanguageContext';
import { useResponsive } from '../components/responsive-hook';

export default function PageCom() {
  const { t } = useLanguage();
  const { isMobile, isTablet } = useResponsive();

  console.info('isMobile', isMobile);

  const S = isMobile ? 'div' : 'span';
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<span style={{ fontSize: 56 }}>{t('home.title')}<br />{t('home.subtitle')}</span>}
          subtitle={t('brand.tagline')}
          button1={<div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}><span>{t('home.button1')}</span><span>{t('home.button11')}</span></div>}
          button2={<div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}><span>{t('home.button2')}</span><span>{t('home.button21')}</span></div>}
          image={p5}
          description={<>{t('home.description')}<br />{t('home.description2')}</>}
        />
        <Sketch
          title={<>{t('home.sketchTitle')}</>}
        />
        <FeatureGrid />
      </PageWrapper>
      <Footer />
      </>
  );
} 