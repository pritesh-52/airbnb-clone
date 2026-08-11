'use client';

import { useEffect } from 'react';

/**
 * Locks background scrolling while `active` is true.
 *
 * The scrollbar width is replaced with padding so the page behind the overlay
 * does not shift horizontally when the bar disappears. Nested locks are
 * reference-counted, so closing an inner dialog does not unlock the outer one.
 */
let lockCount = 0;
let previousPaddingRight = '';
let previousOverflow = '';

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      previousOverflow = document.body.style.overflow;
      previousPaddingRight = document.body.style.paddingRight;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
        document.body.style.paddingRight = previousPaddingRight;
      }
    };
  }, [active]);
}
