import homeHeroZhTW from '../assets/localized-marketing/home-hero-zhTW.png';
import homeHeroZhCN from '../assets/localized-marketing/home-hero-zhCN.jpg';
import homeHeroEn from '../assets/localized-marketing/home-hero-en.jpg';

import homeCardInvisibleZhTW from '../assets/localized-marketing/home-card-invisible-zhTW.png';
import homeCardInvisibleZhCN from '../assets/localized-marketing/home-card-invisible-zhCN.jpg';
import homeCardInvisibleEn from '../assets/localized-marketing/home-card-invisible-en.jpg';

import homeCardRetainerZhTW from '../assets/localized-marketing/home-card-retainer-zhTW.png';
import homeCardRetainerZhCN from '../assets/localized-marketing/home-card-retainer-zhCN.jpg';
import homeCardRetainerEn from '../assets/localized-marketing/home-card-retainer-en.jpg';

import homeCardCorrectionZhTW from '../assets/localized-marketing/home-card-correction-zhTW.png';
import homeCardCorrectionZhCN from '../assets/localized-marketing/home-card-correction-zhCN.jpg';
import homeCardCorrectionEn from '../assets/localized-marketing/home-card-correction-en.jpg';

import homeCardSmileTestZhTW from '../assets/localized-marketing/home-card-smile-test-zhTW.png';
import homeCardSmileTestZhCN from '../assets/localized-marketing/home-card-smile-test-zhCN.jpg';
import homeCardSmileTestEn from '../assets/localized-marketing/home-card-smile-test-en.jpg';

import maintainerHeroZhTW from '../assets/localized-marketing/maintainer-hero-zhTW.jpg';
import maintainerHeroZhCN from '../assets/localized-marketing/maintainer-hero-zhCN.jpg';
import maintainerHeroEn from '../assets/localized-marketing/maintainer-hero-en.jpg';

const marketingImages = {
  'zh-TW': {
    homeHero: homeHeroZhTW,
    maintainerHero: maintainerHeroZhTW,
    homepageCards: {
      invisibleBraces: homeCardInvisibleZhTW,
      retainer: homeCardRetainerZhTW,
      correctionBeauty: homeCardCorrectionZhTW,
      smileTest: homeCardSmileTestZhTW,
    },
  },
  'zh-CN': {
    homeHero: homeHeroZhCN,
    maintainerHero: maintainerHeroZhCN,
    homepageCards: {
      invisibleBraces: homeCardInvisibleZhCN,
      retainer: homeCardRetainerZhCN,
      correctionBeauty: homeCardCorrectionZhCN,
      smileTest: homeCardSmileTestZhCN,
    },
  },
  en: {
    homeHero: homeHeroEn,
    maintainerHero: maintainerHeroEn,
    homepageCards: {
      invisibleBraces: homeCardInvisibleEn,
      retainer: homeCardRetainerEn,
      correctionBeauty: homeCardCorrectionEn,
      smileTest: homeCardSmileTestEn,
    },
  },
};

export const getLocalizedMarketingImages = (languageCode) =>
  marketingImages[languageCode] || marketingImages['zh-TW'];

export default marketingImages;
