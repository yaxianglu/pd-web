import React from 'react';
import FeatureGrid from './FeatureGrid';
import heroImage from './assets/home-hero.png';
import homeVideo from './assets/home-video.mp4';
import './home.scss';

import Header from '../components/header';
import Footer from '../components/footer';
import PageWrapper from '../components/page-wrapper';
import Sketch from '../components/sketch';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function PageCom() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <>
      <Header />
      <PageWrapper>
        <section className="home-hero-banner">
          <img
            src={heroImage}
            alt={t('brand.tagline')}
            className="home-hero-banner-image"
          />
          <div className="home-hero-actions">
            <button
              type="button"
              className="home-hero-primary"
              onClick={() => window.open('/upload', '_blank')}
            >
              <span>{t('home.button1')}</span>
              <span>{t('home.button11')}</span>
              <span className="home-hero-action-star">✦</span>
            </button>
            <button
              type="button"
              className="home-hero-secondary"
              onClick={() => navigate('/about')}
            >
              <span>{t('home.button2')}</span>
              <span>{t('home.button21')}</span>
            </button>
          </div>
        </section>
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
