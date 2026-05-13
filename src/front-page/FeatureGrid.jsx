import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureGrid.scss';
import cardInvisible from './assets/home-card-invisible.png';
import cardCorrection from './assets/home-card-correction.png';
import cardRetainer from './assets/home-card-retainer.png';
import cardSmileTest from './assets/home-card-smile-test.png';
import { useLanguage } from '../context/LanguageContext';

export default function FeatureGrid() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const cards = [
    {
      image: cardInvisible,
      alt: t('home.featureGrid.invisibleBraces.title'),
      onClick: () => navigate('/invisible-braces'),
    },
    {
      image: cardCorrection,
      alt: t('home.featureGrid.correctionBeauty.title'),
      onClick: () => navigate('/correction'),
    },
    {
      image: cardRetainer,
      alt: t('home.featureGrid.retainer.title'),
      onClick: () => navigate('/maintainer'),
    },
    {
      image: cardSmileTest,
      alt: t('home.featureGrid.smileTest.title'),
      onClick: () => window.open('/upload', '_blank'),
    },
  ];

  return (
    <section className="feature-grid">
      <div className="feature-grid-heading">{t('home.learnMore')}</div>
      <div className="grid-container">
        {cards.map((card) => (
          <button
            key={card.alt}
            type="button"
            className="grid-card-button"
            onClick={card.onClick}
          >
            <img src={card.image} alt={card.alt} className="grid-card-image" />
          </button>
        ))}
      </div>
    </section>
  );
}
