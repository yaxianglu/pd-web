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
import { useLanguage } from '../context/LanguageContext';

export default function PageCom() {
  const { t } = useLanguage();
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<>{t('whitening.title')}</>}
          subtitle={t('whitening.subtitle')}
          button1={t('whitening.buttonText')}
          image={p1}
        />
        <Sketch
          title={<>{t('whitening.sketchTitle')}</>}
          subtitle={<>{t('whitening.sketchDescription')}</>}
        />
        <ProductFeatures />
        <ApplicableObjects />
        <FAQ />
      </PageWrapper>
      <Footer />
      </>
  );
} 