import React from 'react';
import FeatureWithImage from './FeatureWithImage';
import ManufacturingSection from './ManufacturingSection';
import WhichPlan from './PlanCard';
import BrandCompareTable from './BrandCompareTable';
import FAQ from '../components/FAQ';

import Header from '../components/header';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import Footer from '../components/footer';
import p5 from '../asserts/5.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function PageCom() {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail
          title={<>{t('invisibleBraces.title')}</>}
          subtitle={<>{t('invisibleBraces.subtitle')}</>}
          button1={t('invisibleBraces.buttonText')}
          image={p5}
        />
        <Sketch
          title={t('invisibleBraces.whyChooseTitle')}
          subtitle={<>{t('invisibleBraces.whyChooseDescription')}</>}
        />
        <FeatureWithImage />
        <ManufacturingSection />
        <WhichPlan />
        {currentLanguage !== 'en' && <BrandCompareTable />}
        <FAQ />
      </PageWrapper>
      <Footer />
      </>
  )
} 