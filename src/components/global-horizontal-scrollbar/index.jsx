import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.scss';

const MIN_THUMB_WIDTH = 56;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function computeThumbWidth(trackWidth, clientWidth, scrollWidth) {
  if (trackWidth <= 0 || clientWidth <= 0 || scrollWidth <= clientWidth) {
    return trackWidth;
  }

  return clamp((clientWidth / scrollWidth) * trackWidth, MIN_THUMB_WIDTH, trackWidth);
}

function getPointerClientX(event) {
  return event?.clientX ?? event?.nativeEvent?.clientX ?? 0;
}

function pickTarget(scopeElement, targetSelector) {
  if (!scopeElement) {
    return null;
  }

  const candidates = Array.from(scopeElement.querySelectorAll(targetSelector)).filter((element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    return element.scrollWidth - element.clientWidth > 1;
  });

  if (candidates.length === 0) {
    return null;
  }

  return candidates.sort((left, right) => {
    const leftOverflow = left.scrollWidth - left.clientWidth;
    const rightOverflow = right.scrollWidth - right.clientWidth;
    return rightOverflow - leftOverflow;
  })[0];
}

export default function GlobalHorizontalScrollbar({
  scopeRef,
  targetSelector = '.ant-table-content, .ant-table-body',
  deps = [],
}) {
  const trackRef = useRef(null);
  const targetRef = useRef(null);
  const dragStateRef = useRef(null);
  const [metrics, setMetrics] = useState({
    visible: false,
    left: 16,
    width: 0,
    thumbWidth: MIN_THUMB_WIDTH,
    thumbOffset: 0,
  });

  const syncMetrics = useCallback(() => {
    const scopeElement = scopeRef?.current || document.body;
    const nextTarget = pickTarget(scopeElement, targetSelector);
    targetRef.current = nextTarget;

    if (!nextTarget) {
      setMetrics((previous) => (
        previous.visible ? { ...previous, visible: false } : previous
      ));
      return;
    }

    const scopeRect = scopeElement.getBoundingClientRect();
    const trackWidth = trackRef.current?.clientWidth || 0;
    const maxScrollLeft = Math.max(0, nextTarget.scrollWidth - nextTarget.clientWidth);
    const visible = maxScrollLeft > 1;
    const left = Math.max(16, scopeRect.left + 16);
    const width = Math.max(160, scopeRect.width - 32);
    const thumbWidth = computeThumbWidth(trackWidth, nextTarget.clientWidth, nextTarget.scrollWidth);
    const maxThumbOffset = Math.max(0, trackWidth - thumbWidth);
    const thumbOffset = maxScrollLeft > 0 && maxThumbOffset > 0
      ? (nextTarget.scrollLeft / maxScrollLeft) * maxThumbOffset
      : 0;

    setMetrics((previous) => {
      if (
        previous.visible === visible &&
        previous.left === left &&
        previous.width === width &&
        previous.thumbWidth === thumbWidth &&
        previous.thumbOffset === thumbOffset
      ) {
        return previous;
      }

      return {
        visible,
        left,
        width,
        thumbWidth,
        thumbOffset,
      };
    });
  }, [scopeRef, targetSelector]);

  useEffect(() => {
    syncMetrics();
  }, [syncMetrics, deps]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return undefined;
    }

    const handleTargetScroll = () => {
      syncMetrics();
    };

    const resizeObserver = new ResizeObserver(() => {
      syncMetrics();
    });

    target.addEventListener('scroll', handleTargetScroll, { passive: true });
    resizeObserver.observe(target);
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      target.removeEventListener('scroll', handleTargetScroll);
      resizeObserver.disconnect();
    };
  }, [metrics.visible, syncMetrics]);

  useEffect(() => {
    const handleWindowChange = () => {
      syncMetrics();
    };

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, { passive: true });

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange);
    };
  }, [syncMetrics]);

  useEffect(() => {
    if (!metrics.visible) {
      return undefined;
    }

    syncMetrics();
    return undefined;
  }, [metrics.visible, syncMetrics]);

  const handlePointerMove = useCallback((event) => {
    const dragState = dragStateRef.current;
    const target = targetRef.current;
    const trackElement = trackRef.current;

    if (!dragState || !target || !trackElement) {
      return;
    }

    const trackWidth = trackElement.clientWidth;
    const maxScrollLeft = Math.max(0, target.scrollWidth - target.clientWidth);
    const thumbWidth = computeThumbWidth(trackWidth, target.clientWidth, target.scrollWidth);
    const maxThumbOffset = Math.max(0, trackWidth - thumbWidth);

    if (maxScrollLeft <= 0 || maxThumbOffset <= 0) {
      return;
    }

    const nextThumbOffset = clamp(
      dragState.startThumbOffset + (getPointerClientX(event) - dragState.startX),
      0,
      maxThumbOffset,
    );

    target.scrollLeft = (nextThumbOffset / maxThumbOffset) * maxScrollLeft;
    syncMetrics();
  }, [syncMetrics]);

  const stopDragging = useCallback(() => {
    dragStateRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
  }, [handlePointerMove]);

  const handleThumbPointerDown = useCallback((event) => {
    event.preventDefault();

    dragStateRef.current = {
      startX: getPointerClientX(event),
      startThumbOffset: metrics.thumbOffset,
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
  }, [handlePointerMove, metrics.thumbOffset, stopDragging]);

  const handleTrackPointerDown = useCallback((event) => {
    if (event.target?.dataset?.role === 'global-scrollbar-thumb') {
      return;
    }

    const target = targetRef.current;
    const trackElement = trackRef.current;

    if (!target || !trackElement) {
      return;
    }

    const trackRect = trackElement.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const maxScrollLeft = Math.max(0, target.scrollWidth - target.clientWidth);
    const thumbWidth = computeThumbWidth(trackWidth, target.clientWidth, target.scrollWidth);
    const maxThumbOffset = Math.max(0, trackWidth - thumbWidth);

    if (trackWidth <= 0 || maxScrollLeft <= 0 || maxThumbOffset <= 0) {
      return;
    }

    const requestedThumbOffset = clamp(
      getPointerClientX(event) - trackRect.left - (thumbWidth / 2),
      0,
      maxThumbOffset,
    );

    target.scrollLeft = (requestedThumbOffset / maxThumbOffset) * maxScrollLeft;
    syncMetrics();
  }, [syncMetrics]);

  useEffect(() => () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
  }, [handlePointerMove, stopDragging]);

  const wrapperStyle = useMemo(() => ({
    left: metrics.left,
    width: metrics.width,
  }), [metrics.left, metrics.width]);

  if (!metrics.visible) {
    return null;
  }

  return (
    <div
      className="global-horizontal-scrollbar"
      data-testid="global-horizontal-scrollbar"
      style={wrapperStyle}
    >
      <div
        ref={trackRef}
        className="global-horizontal-scrollbar__track"
        data-testid="global-horizontal-scrollbar-track"
        onPointerDown={handleTrackPointerDown}
      >
        <div
          className="global-horizontal-scrollbar__thumb"
          data-role="global-scrollbar-thumb"
          data-testid="global-horizontal-scrollbar-thumb"
          onPointerDown={handleThumbPointerDown}
          style={{
            width: metrics.thumbWidth,
            transform: `translateX(${metrics.thumbOffset}px)`,
          }}
        />
      </div>
    </div>
  );
}
