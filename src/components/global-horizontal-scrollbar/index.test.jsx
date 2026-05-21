import React, { useEffect, useRef, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import GlobalHorizontalScrollbar from './index';

function defineDimension(element, key, value) {
  Object.defineProperty(element, key, {
    configurable: true,
    get: () => value,
  });
}

function TestHarness({ overflow = true }) {
  const scopeRef = useRef(null);
  const targetRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    defineDimension(targetRef.current, 'clientWidth', 320);
    defineDimension(targetRef.current, 'scrollWidth', overflow ? 1280 : 320);
    let scrollLeftValue = 0;
    Object.defineProperty(targetRef.current, 'scrollLeft', {
      configurable: true,
      get: () => scrollLeftValue,
      set: (value) => {
        scrollLeftValue = value;
      },
    });

    setReady(true);
  }, [overflow]);

  return (
    <div ref={scopeRef}>
      <div ref={targetRef} className="sync-target" />
      <GlobalHorizontalScrollbar
        scopeRef={scopeRef}
        targetSelector=".sync-target"
        deps={[ready, overflow]}
      />
    </div>
  );
}

describe('GlobalHorizontalScrollbar', () => {
  beforeAll(() => {
    global.ResizeObserver = global.ResizeObserver || class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('shows a fixed fallback scrollbar when the scoped target overflows horizontally', async () => {
    render(<TestHarness overflow />);

    await waitFor(() => {
      expect(screen.getByTestId('global-horizontal-scrollbar')).toBeInTheDocument();
    });
  });

  it('does not render the fallback bar when horizontal overflow is absent', async () => {
    render(<TestHarness overflow={false} />);

    await waitFor(() => {
      expect(screen.queryByTestId('global-horizontal-scrollbar')).not.toBeInTheDocument();
    });
  });

  it('syncs the thumb position when the target scrolls horizontally', async () => {
    const { container } = render(<TestHarness overflow />);

    const target = container.querySelector('.sync-target');

    await waitFor(() => {
      expect(screen.getByTestId('global-horizontal-scrollbar-thumb')).toBeInTheDocument();
    });

    const track = screen.getByTestId('global-horizontal-scrollbar-track');
    defineDimension(track, 'clientWidth', 240);

    target.scrollLeft = 480;
    fireEvent.scroll(target);

    await waitFor(() => {
      expect(screen.getByTestId('global-horizontal-scrollbar-thumb')).toHaveStyle({
        transform: 'translateX(90px)',
      });
    });
  });
});
