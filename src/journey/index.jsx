import React from 'react';
import ManufacturingSection from './ManufacturingSection';
import FAQ from '../components/FAQ';
import SmileSteps from '../components/step1/process';
import ProductFeatures from './ProductFeatures';

import Header from '../components/header';
import Footer from '../components/footer';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import p1 from './imgs/1.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function PageCom() {
  const { t } = useLanguage();
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<>{t('journey.title').split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t('journey.title').split('\n').length - 1 && <br/>}
            </React.Fragment>
          ))}</>}
          button1={t('journey.buttonText')}
          image={p1}
        />
        <Sketch
          title={<>{t('journey.sketchTitle')}</>}
          subtitle={<>{t('journey.sketchDescription')}</>}
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