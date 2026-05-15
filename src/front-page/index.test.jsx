import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FrontPage from './index';

const mockNavigate = jest.fn();
const mockThumbnail = jest.fn(() => <div data-testid="thumbnail" />);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../components/header', () => () => <div data-testid="header" />);
jest.mock('../components/footer', () => () => <div data-testid="footer" />);
jest.mock('../components/page-wrapper', () => ({ children }) => <div data-testid="page-wrapper">{children}</div>);
jest.mock('../components/sketch', () => ({ children }) => <div data-testid="sketch">{children}</div>);
jest.mock('./FeatureGrid', () => () => <div data-testid="feature-grid" />);
jest.mock('../components/thumbnail', () => (props) => mockThumbnail(props));
jest.mock('../components/responsive-hook', () => ({
  useResponsive: () => ({ isMobile: false }),
}));
jest.mock('../config/localizedMarketingImages', () => ({
  getLocalizedMarketingImages: () => ({
    homeHero: 'hero-en-image',
    maintainerHero: 'maintainer-en-image',
    homepageCards: {
      invisibleBraces: 'card-invisible-en',
      retainer: 'card-retainer-en',
      correctionBeauty: 'card-correction-en',
      smileTest: 'card-smile-en',
    },
  }),
}));
jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    t: (key) => ({
      'home.title': 'SHINE BRIGHT',
      'home.subtitle': 'SMILE RIGHT',
      'brand.tagline': 'Shine bright.',
      'home.button1': 'Smile',
      'home.button11': 'Quiz',
      'home.button2': 'About',
      'home.button21': 'Us',
      'home.description': 'desc line 1',
      'home.description2': 'desc line 2',
      'home.sketchTitle': 'sketch title',
    }[key] || key),
  }),
}));

describe('FrontPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockThumbnail.mockClear();
  });

  it('uses the language-specific homepage hero image', () => {
    render(
      <MemoryRouter>
        <FrontPage />
      </MemoryRouter>
    );

    expect(mockThumbnail).toHaveBeenCalled();
    expect(mockThumbnail.mock.calls[0][0].image).toBe('hero-en-image');
  });
});
