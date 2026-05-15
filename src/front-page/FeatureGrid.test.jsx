import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeatureGrid from './FeatureGrid';

const mockNavigate = jest.fn();
const mockWindowOpen = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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
      'home.learnMore': 'Learn more',
      'home.featureGrid.invisibleBraces.title': 'Invisible Braces',
      'home.featureGrid.retainer.title': 'Retainers',
      'home.featureGrid.correctionBeauty.title': 'Orthodontics & Aesthetics',
      'home.featureGrid.smileTest.title': 'Smile Quiz',
    }[key] || key),
  }),
}));

describe('FeatureGrid', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockWindowOpen.mockClear();
    window.open = mockWindowOpen;
  });

  it('renders homepage cards in the requested order and links each card to the matching destination', async () => {
    render(<FeatureGrid />);

    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(screen.getAllByRole('img').map((image) => image.getAttribute('alt'))).toEqual([
      'Invisible Braces',
      'Retainers',
      'Orthodontics & Aesthetics',
      'Smile Quiz',
    ]);
    expect(screen.getAllByRole('img').map((image) => image.getAttribute('src'))).toEqual([
      'card-invisible-en',
      'card-retainer-en',
      'card-correction-en',
      'card-smile-en',
    ]);

    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[0]);
    await userEvent.click(buttons[1]);
    await userEvent.click(buttons[2]);
    await userEvent.click(buttons[3]);

    expect(mockNavigate.mock.calls).toEqual([
      ['/invisible-braces'],
      ['/maintainer'],
      ['/correction'],
    ]);
    expect(mockWindowOpen).toHaveBeenCalledWith('/upload', '_blank');
  });
});
