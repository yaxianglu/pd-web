import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MaintainerPage from './index';

const mockThumbnail = jest.fn(() => <div data-testid="thumbnail" />);

jest.mock('../components/header', () => () => <div data-testid="header" />);
jest.mock('../components/footer', () => () => <div data-testid="footer" />);
jest.mock('../components/page-wrapper', () => ({ children }) => <div data-testid="page-wrapper">{children}</div>);
jest.mock('../components/sketch', () => ({ children }) => <div data-testid="sketch">{children}</div>);
jest.mock('../components/thumbnail', () => (props) => mockThumbnail(props));
jest.mock('../components/FAQ', () => () => <div data-testid="faq" />);
jest.mock('./ProductFeatures', () => () => <div data-testid="product-features" />);
jest.mock('./ApplicableObjects', () => () => <div data-testid="applicable-objects" />);
jest.mock('../config/localizedMarketingImages', () => ({
  getLocalizedMarketingImages: () => ({
    homeHero: 'hero-zhCN-image',
    maintainerHero: 'maintainer-zhCN-image',
    homepageCards: {
      invisibleBraces: 'card-invisible-zhCN',
      retainer: 'card-retainer-zhCN',
      correctionBeauty: 'card-correction-zhCN',
      smileTest: 'card-smile-zhCN',
    },
  }),
}));
jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    currentLanguage: 'zh-CN',
    t: (key) => ({
      'maintainer.title': '维持器',
      'maintainer.subtitle': 'subtitle',
      'maintainer.buttonText': '微笑测试',
      'maintainer.sketchTitle': 'title',
      'maintainer.sketchDescription': 'description',
    }[key] || key),
  }),
}));

describe('Maintainer page', () => {
  beforeEach(() => {
    mockThumbnail.mockClear();
  });

  it('uses the language-specific maintainer hero image', () => {
    render(
      <MemoryRouter>
        <MaintainerPage />
      </MemoryRouter>
    );

    expect(mockThumbnail).toHaveBeenCalled();
    expect(mockThumbnail.mock.calls[0][0].image).toBe('maintainer-zhCN-image');
  });
});
