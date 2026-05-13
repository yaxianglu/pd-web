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

jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => ({
      'home.learnMore': '想要了解',
      'home.featureGrid.invisibleBraces.title': '隱形牙套',
      'home.featureGrid.retainer.title': '維持器',
      'home.featureGrid.correctionBeauty.title': '矯正與美',
      'home.featureGrid.smileTest.title': '微笑測試',
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

    expect(screen.getByText('想要了解')).toBeInTheDocument();
    expect(screen.getAllByRole('img').map((image) => image.getAttribute('alt'))).toEqual([
      '隱形牙套',
      '維持器',
      '矯正與美',
      '微笑測試',
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
