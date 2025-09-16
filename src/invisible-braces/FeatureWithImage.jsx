import React, { useState, useEffect } from "react";
import png6 from './imgs/1.svg';
import png7 from './imgs/2.svg';
import png8 from './imgs/3.svg';
import png9 from './imgs/4.svg';
import png10 from './imgs/5.svg';
import png11 from './imgs/6.svg';
import './FeatureWithImage.scss';
import SubCard from "../components/sub-card";
import Grid3 from "../components/grid";
import CardWrapper from "../components/card-wrapper";
import { useLanguage } from '../context/LanguageContext';

export default function FeatureWithImage() {
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
    <CardWrapper style={{ width: '80%' }}>
      {
        isMobile ? (
          <>
          <Grid3 style={{ marginTop: 60 }}>
            <SubCard img={png6} title={t('invisibleBraces.features.usBrand.title')} description={<>{t('invisibleBraces.features.usBrand.description')}</>} />
            <SubCard img={png7} title={t('invisibleBraces.features.techAssisted.title')} description={<>{t('invisibleBraces.features.techAssisted.description')}</>} />
          </Grid3>
          <Grid3 style={{ marginTop: 60 }}>
            <SubCard img={png8} title={t('invisibleBraces.features.highTransparency.title')} description={<>{t('invisibleBraces.features.highTransparency.description')}</>} />
            <SubCard img={png9} title={t('invisibleBraces.features.personalized.title')} description={<>{t('invisibleBraces.features.personalized.description')}</>} />
            </Grid3>
          <Grid3 style={{ marginTop: 60 }}>
            <SubCard img={png10} title={t('invisibleBraces.features.threeDimensional.title')} description={<>{t('invisibleBraces.features.threeDimensional.description')}</>} />
            <SubCard img={png11} title={t('invisibleBraces.features.taiwanMade.title')} description={<>{t('invisibleBraces.features.taiwanMade.description')}</>} />
          </Grid3>
          </>
        ) : (
          <>
          <Grid3>
            <SubCard img={png6} title={t('invisibleBraces.features.usBrand.title')} description={<>{t('invisibleBraces.features.usBrand.description')}</>} />
            <SubCard img={png7} title={t('invisibleBraces.features.techAssisted.title')} description={<>{t('invisibleBraces.features.techAssisted.description')}</>} />
            <SubCard img={png8} title={t('invisibleBraces.features.highTransparency.title')} description={<>{t('invisibleBraces.features.highTransparency.description')}</>} />
          </Grid3>
            <div className="divider" />
          <Grid3>
              <SubCard img={png9} title={t('invisibleBraces.features.personalized.title')} description={<>{t('invisibleBraces.features.personalized.description')}</>} />
              <SubCard img={png10} title={t('invisibleBraces.features.threeDimensional.title')} description={<>{t('invisibleBraces.features.threeDimensional.description')}</>} />
              <SubCard img={png11} title={t('invisibleBraces.features.taiwanMade.title')} description={<>{t('invisibleBraces.features.taiwanMade.description')}</>} />
            </Grid3>
            </>
        )
      }
    </CardWrapper>
  );
}
