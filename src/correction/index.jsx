import React from 'react';
import Header from '../components/header';
import ProductFeatures from './ProductFeatures';
import ManufacturingSection from './ManufacturingSection';
import WhichPlan from './PlanCard';
import BrandCompareTable from './BrandCompareTable';
import Footer from '../components/footer';
import FAQ from '../components/FAQ';
import p17 from './imgs/1.jpg';
import Early from './early';
import p7 from './imgs/7.jpg';
import p11 from './imgs/11.jpg';
import Upgrade from './upgrade';

import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import DetailButton from '../components/detail-button';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

export default function PageCom() {
  const { t } = useLanguage();
  
  // Set SEO for this page
  useSEO('correction');
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail 
          title={<>{t('correction.title').split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < t('correction.title').split('\n').length - 1 && <br/>}
            </React.Fragment>
          ))}</>}
          subtitle={<>{t('correction.subDescription')}</>}
          button1={t('correction.buttonText')}
          image={p17}
        />
        <Sketch
          title={<>{t('correction.sketchTitle')}</>}
          // subtitle={<>{t('correction.sketchDescription')}</>}
        />
        <ProductFeatures />
        <ManufacturingSection />
        <WhichPlan image={p7} background="rgba(99, 147, 241, 0.8)"/>
        <BrandCompareTable />
        <Early />
        <WhichPlan
          image={p11}
          background="rgba(180,221,24, 0.8)"
          imgRight={false}
          title={t('correction.adultCorrection')}
          description={<>{t('correction.adultDescription')}</>}
        />
        <Upgrade />
        <DetailButton text={t('common.smileTest')}/>
        <FAQ />
      </PageWrapper>
      <Footer />
      </>
  );
} 