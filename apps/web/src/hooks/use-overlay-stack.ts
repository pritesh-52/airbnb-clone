'use client';

import { useCallback, useEffect, useState } from 'react';

/** Layer tokens, lowest first. The last entry is the overlay on top. */
const stack: symbol[] = [];

export interface OverlayLayer {
  /** True when this overlay is the frontmost one. Read at event time. */
  isTopmost: () => boolean;
}

/**
 * Registers an overlay as a layer while it is open, and reports whether it is
 * the one currently on top.
 *
 * Overlays listen on `document` for Escape and focus changes, and a listener on
 * `document` cannot be stopped by another listener on the same node —
 * `stopPropagation` only blocks *other* nodes. So with the photo tour and the
 * lightbox both open, whichever registered first would win, and Escape would
 * dismiss the tour *underneath* the lightbox. Guarding each handler with
 * `isTopmost()` makes the frontmost overlay the only one that reacts.
 */
export function useOverlayLayer(active: boolean): OverlayLayer {
  // A stable identity per component instance; the initialiser runs only once.
  const [token] = useState(() => Symbol('overlay-layer'));

  useEffect(() => {
    if (!active) return;

    stack.push(token);

    return () => {
      const index = stack.lastIndexOf(token);
      if (index !== -1) stack.splice(index, 1);
    };
  }, [active, token]);

  const isTopmost = useCallback(() => stack[stack.length - 1] === token, [token]);

  return { isTopmost };
}
