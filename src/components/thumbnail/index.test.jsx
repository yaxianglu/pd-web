import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Thumbnail from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Thumbnail', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('adds homepage-specific layout hooks so mobile spacing can be tuned independently', () => {
    const { container } = render(
      <MemoryRouter>
        <Thumbnail
          variant="home"
          title="SHINE BRIGHT"
          subtitle="SMILE RIGHT"
          button1="微笑测试"
          button2="关于珍舒美"
          image="/hero.png"
          description="homepage description"
        />
      </MemoryRouter>
    );

    expect(container.querySelector('.main-content-home')).toBeInTheDocument();
    expect(container.querySelector('.text-content-home')).toBeInTheDocument();
    expect(container.querySelector('.image-container-home')).toBeInTheDocument();
  });
});
