import React from "react";
import { useResponsive } from '../components/responsive-hook';
import './BrandCompareTable.scss';
import GrayCard from "../components/gray-card";
import ContentTextImg from "../components/content-text-img";
import p12 from './imgs/12.jpg';
import p13 from './imgs/13.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function Upgrade() {
  const { isMobile, isTablet } = useResponsive();
  const { t } = useLanguage();
  
  return (
    <GrayCard
      title={t('correction.upgrade.title')}
      description={t('correction.upgrade.description')}
    >
      <ContentTextImg
        image={p12}
        title={t('correction.upgrade.aestheticImpact.title')}
        description={
          <>
            {t('correction.upgrade.aestheticImpact.description').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('correction.upgrade.aestheticImpact.description').split('\n').length - 1 && <br />}
              </span>
            ))}
          </>
        }
      />
      <ContentTextImg
        image={p13}
        imgRight={false}
        title={t('correction.upgrade.adultNeeds.title')}
        description={
          <>
            {t('correction.upgrade.adultNeeds.description').split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t('correction.upgrade.adultNeeds.description').split('\n').length - 1 && <br />}
              </span>
            ))}
          </>
        }
      />
    </GrayCard>
  );
}
