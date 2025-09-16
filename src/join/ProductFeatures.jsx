// ProductFeatures.jsx
import React from 'react';
import './ProductFeatures.scss';
import CardWrapper from '../components/card-wrapper';
import { useLanguage } from '../context/LanguageContext';

export default function ProductFeatures() {
  const { t } = useLanguage();
  
  const features = [
    {
      title: t('join.features.items.usBrand.title'),
      desc: t('join.features.items.usBrand.description'),
      color: 'rgba(105,155,255)'
    },
    {
      title: t('join.features.items.taiwanMade.title'),
      desc: (
        <>
          {t('join.features.items.taiwanMade.description').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('join.features.items.taiwanMade.description').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      ),
      color: 'rgba(250,86,30)'
    },
    {
      title: t('join.features.items.marketing.title'),
      desc: (
        <>
          {t('join.features.items.marketing.description').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('join.features.items.marketing.description').split('\n').length - 1 && <br />}
            </span>
          ))}
        </>
      ),
      color: 'rgba(180,211,24)'
    },
    {
      title: t('join.features.items.join.title'),
      desc: t('join.features.items.join.description'),
      color: 'rgba(255,140,26)'
    },
  ];

  return (
    <CardWrapper title={t('join.features.title')}>
      <div className="join-features__list">
        {features.map((f, i) => (
          <div
            key={i}
            className={
              'join-features__item join-features__item--' + f.color +
              (f.highlight ? ' join-features__item--highlight' : '')
            }
            style={{ backgroundColor: f.color }}
          >
            <div className="join-features__item-header">{f.title}</div>
            <div className="join-features__item-divider" />
            <div className="join-features__item-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}
