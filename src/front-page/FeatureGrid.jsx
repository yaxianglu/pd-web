import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureGrid.scss';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedMarketingImages } from '../config/localizedMarketingImages';

export default function FeatureGrid() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { homepageCards } = getLocalizedMarketingImages(currentLanguage);

  const cards = [
    {
      image: homepageCards.invisibleBraces,
      alt: t('home.featureGrid.invisibleBraces.title'),
      onClick: () => navigate('/invisible-braces'),
    },
    {
      image: homepageCards.retainer,
      alt: t('home.featureGrid.retainer.title'),
      onClick: () => navigate('/maintainer'),
    },
    {
      image: homepageCards.correctionBeauty,
      alt: t('home.featureGrid.correctionBeauty.title'),
      onClick: () => navigate('/correction'),
    },
    {
      image: homepageCards.smileTest,
      alt: t('home.featureGrid.smileTest.title'),
      onClick: () => window.open('/upload?new=1', '_blank'),
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
