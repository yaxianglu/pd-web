import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fs from 'node:fs';
import path from 'node:path';
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

  it('drops fixed desktop flex-basis values for the homepage hero on mobile', () => {
    const scss = fs.readFileSync(path.resolve(__dirname, 'index.scss'), 'utf8');

    expect(scss).toMatch(/\.text-content-home\s*\{\s*@media\s*\(max-width:\s*1125px\)\s*\{\s*order:\s*1;\s*flex:\s*0\s+0\s+auto;/s);
    expect(scss).toMatch(/\.image-container-home\s*\{\s*@media\s*\(max-width:\s*1125px\)\s*\{\s*order:\s*2;\s*flex:\s*0\s+0\s+auto;/s);
  });

  it('keeps enough mobile top padding so the homepage hero title is not hidden under the fixed header', () => {
    const scss = fs.readFileSync(path.resolve(__dirname, 'index.scss'), 'utf8');

    expect(scss).toMatch(/&\.thumbnail-section-home[\s\S]*@media\s*\(max-width:\s*1125px\)\s*\{\s*padding-top:\s*72px;/s);
  });
});
