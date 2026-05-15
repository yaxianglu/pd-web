import React from 'react';
import Header from '../components/header';
import ProductFeatures from './ProductFeatures';
import ApplicableObjects from './ApplicableObjects';
import Footer from '../components/footer';
import FAQ from '../components/FAQ';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedMarketingImages } from '../config/localizedMarketingImages';

export default function PageCom() {
  const { t, currentLanguage } = useLanguage();
  const marketingImages = getLocalizedMarketingImages(currentLanguage);
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail
          title={<>{t('maintainer.title')}</>}
          subtitle={<>{t('maintainer.subtitle')}</>}
          button1={t('maintainer.buttonText')}
          image={marketingImages.maintainerHero}
        />
        <Sketch
          title={t('maintainer.sketchTitle')}
          subtitle={<>{t('maintainer.sketchDescription')}</>}
        />
        <ProductFeatures />
        <ApplicableObjects />
        <FAQ />
      </PageWrapper>
      <Footer />
    </>
  )
} 
