import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeatureGrid from './FeatureGrid';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => ({
      'home.learnMore': '想要了解',
      'home.featureGrid.invisibleBraces.title': '隱形牙套',
      'home.featureGrid.retainer.title': '維持器',
      'home.featureGrid.journey.title': '療程旅程',
      'home.featureGrid.correctionBeauty.title': '矯正與美',
    }[key] || key),
  }),
}));

describe('FeatureGrid', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders homepage cards in the same order as the header tabs and navigates to matching pages', async () => {
    render(<FeatureGrid />);

    expect(screen.getByText('想要了解')).toBeInTheDocument();
    expect(screen.getAllByRole('img').map((image) => image.getAttribute('alt'))).toEqual([
      '隱形牙套',
      '維持器',
      '療程旅程',
      '矯正與美',
    ]);

    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[0]);
    await userEvent.click(buttons[1]);
    await userEvent.click(buttons[2]);
    await userEvent.click(buttons[3]);

    expect(mockNavigate.mock.calls).toEqual([
      ['/invisible-braces'],
      ['/maintainer'],
      ['/journey'],
      ['/correction'],
    ]);
  });
});
