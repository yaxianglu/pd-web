jest.mock('../assets/localized-marketing/home-hero-zhTW.png', () => 'home-hero-zhTW', { virtual: true });
jest.mock('../assets/localized-marketing/home-hero-zhCN.jpg', () => 'home-hero-zhCN', { virtual: true });
jest.mock('../assets/localized-marketing/home-hero-en.jpg', () => 'home-hero-en', { virtual: true });

jest.mock('../assets/localized-marketing/home-card-invisible-zhTW.png', () => 'home-card-invisible-zhTW', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-invisible-zhCN.jpg', () => 'home-card-invisible-zhCN', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-invisible-en.jpg', () => 'home-card-invisible-en', { virtual: true });

jest.mock('../assets/localized-marketing/home-card-retainer-zhTW.png', () => 'home-card-retainer-zhTW', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-retainer-zhCN.jpg', () => 'home-card-retainer-zhCN', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-retainer-en.jpg', () => 'home-card-retainer-en', { virtual: true });

jest.mock('../assets/localized-marketing/home-card-correction-zhTW.png', () => 'home-card-correction-zhTW', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-correction-zhCN.jpg', () => 'home-card-correction-zhCN', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-correction-en.jpg', () => 'home-card-correction-en', { virtual: true });

jest.mock('../assets/localized-marketing/home-card-smile-test-zhTW.png', () => 'home-card-smile-test-zhTW', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-smile-test-zhCN.jpg', () => 'home-card-smile-test-zhCN', { virtual: true });
jest.mock('../assets/localized-marketing/home-card-smile-test-en.jpg', () => 'home-card-smile-test-en', { virtual: true });

jest.mock('../assets/localized-marketing/maintainer-hero-zhTW.jpg', () => 'maintainer-hero-zhTW', { virtual: true });
jest.mock('../assets/localized-marketing/maintainer-hero-zhCN.jpg', () => 'maintainer-hero-zhCN', { virtual: true });
jest.mock('../assets/localized-marketing/maintainer-hero-en.jpg', () => 'maintainer-hero-en', { virtual: true });

import { getLocalizedMarketingImages } from './localizedMarketingImages';

describe('localizedMarketingImages', () => {
  it('returns the correct image set for each supported language and falls back to zh-TW', () => {
    expect(getLocalizedMarketingImages('zh-TW')).toEqual({
      homeHero: 'home-hero-zhTW',
      maintainerHero: 'maintainer-hero-zhTW',
      homepageCards: {
        invisibleBraces: 'home-card-invisible-zhTW',
        retainer: 'home-card-retainer-zhTW',
        correctionBeauty: 'home-card-correction-zhTW',
        smileTest: 'home-card-smile-test-zhTW',
      },
    });

    expect(getLocalizedMarketingImages('zh-CN')).toEqual({
      homeHero: 'home-hero-zhCN',
      maintainerHero: 'maintainer-hero-zhCN',
      homepageCards: {
        invisibleBraces: 'home-card-invisible-zhCN',
        retainer: 'home-card-retainer-zhCN',
        correctionBeauty: 'home-card-correction-zhCN',
        smileTest: 'home-card-smile-test-zhCN',
      },
    });

    expect(getLocalizedMarketingImages('en')).toEqual({
      homeHero: 'home-hero-en',
      maintainerHero: 'maintainer-hero-en',
      homepageCards: {
        invisibleBraces: 'home-card-invisible-en',
        retainer: 'home-card-retainer-en',
        correctionBeauty: 'home-card-correction-en',
        smileTest: 'home-card-smile-test-en',
      },
    });

    expect(getLocalizedMarketingImages('ja')).toEqual(getLocalizedMarketingImages('zh-TW'));
  });
});
