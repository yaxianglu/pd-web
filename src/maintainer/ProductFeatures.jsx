import React from 'react';
import './ProductFeatures.scss';
import CardWrapper from '../components/card-wrapper';
import ImageCompareWrapper from '../components/image-compare-wrapper';
import p11 from './imgs/11.svg';
import p12 from './imgs/12.svg';
import p21 from './imgs/21.svg';
import p22 from './imgs/22.svg';
import p31 from './imgs/31.svg';
import p32 from './imgs/32.svg';
import p41 from './imgs/41.svg';
import p42 from './imgs/42.svg';
import { useLanguage } from '../context/LanguageContext';

export default function ProductFeatures() {
  const { t } = useLanguage();
  
  return (
    <CardWrapper title={t('maintainer.productFeatures.title')}>
      <ImageCompareWrapper 
        title={<>{t('maintainer.productFeatures.features.fit.title')}</>}
        description={<>{t('maintainer.productFeatures.features.fit.description')}</>}
        image1={p12}
        image2={p11}
      />
      <ImageCompareWrapper 
        title={<>{t('maintainer.productFeatures.features.transparency.title')}</>}
        description={<>{t('maintainer.productFeatures.features.transparency.description')}</>}
        image1={p22}
        image2={p21}
      />
      <ImageCompareWrapper 
        title={<>{t('maintainer.productFeatures.features.stainResistant.title')}</>}
        description={<>{t('maintainer.productFeatures.features.stainResistant.description')}</>}
        image1={p31}
        image2={p32}
      />
      <ImageCompareWrapper 
        title={<>{t('maintainer.productFeatures.features.stability.title')}</>}
        description={<>{t('maintainer.productFeatures.features.stability.description')}</>}
        image1={p42}
        image2={p41}
      />
    </CardWrapper>
  );
} 