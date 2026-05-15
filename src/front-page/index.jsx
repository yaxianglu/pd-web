import React from 'react';
import FeatureGrid from './FeatureGrid';
import homeVideo from './assets/home-video.mp4';

import Header from '../components/header';
import Footer from '../components/footer';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import Sketch from '../components/sketch';
import { useLanguage } from '../context/LanguageContext';
import { useResponsive } from '../components/responsive-hook';
import { useNavigate } from 'react-router-dom';
import { getLocalizedMarketingImages } from '../config/localizedMarketingImages';

export default function PageCom() {
  const { t, currentLanguage } = useLanguage();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const marketingImages = getLocalizedMarketingImages(currentLanguage);
  
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail
          variant="home"
          title={<span>{t('home.title')}<br />{t('home.subtitle')}</span>}
          subtitle={t('brand.tagline')}
          button1={<div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}><span>{t('home.button1')}</span><span>{t('home.button11')}</span></div>}
          button2={<div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}><span>{t('home.button2')}</span><span>{t('home.button21')}</span></div>}
          onButton1Click={() => window.open('/upload', '_blank')}
          onButton2Click={() => navigate('/about')}
          image={marketingImages.homeHero}
          description={<>{t('home.description')}<br />{t('home.description2')}</>}
        />
        <Sketch
          variant="home"
          title={<>{t('home.sketchTitle')}</>}
        >
          <div className="home-video-shell">
            <video src={homeVideo} controls playsInline preload="metadata" />
          </div>
        </Sketch>
        <FeatureGrid />
      </PageWrapper>
      <Footer />
      </>
  );
}
