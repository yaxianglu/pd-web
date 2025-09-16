import React from 'react';
import FeatureGrid from './FeatureGrid';
import p5 from './imgs/5.jpg';

import Header from '../components/header';
import Footer from '../components/footer';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import { useLanguage } from '../context/LanguageContext';

export default function PageCom() {
  const { t } = useLanguage();
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<span style={{ fontSize: 56 }}>{t('home.title')}<br />{t('home.subtitle')}</span>}
          subtitle={t('brand.tagline')}
          button1={t('home.button1')}
          button2={t('home.button2')}
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