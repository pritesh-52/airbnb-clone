'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Marks every `<body>` child except `overlayRef` as `inert` while `active`.
 *
 * A focus trap stops Tab from leaving an overlay, but a screen reader's virtual
 * cursor can still wander into the page behind it. `inert` removes that content
 * from the accessibility tree and from hit-testing, which is what `aria-modal`
 * promises but does not itself enforce.
 *
 * Call this **before** `useFocusTrap` in every consumer: React runs cleanups in
 * registration order, so `inert` must be lifted before the trap restores focus
 * to the trigger. The other way round, the restore target is still inert and the
 * focus call is silently ignored.
 */
export function useBackgroundInert(
  overlayRef: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(() => {
    if (!active) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const backgrounded = Array.from(document.body.children).filter(
      (child) => child !== overlay && !child.hasAttribute('inert'),
    );

    backgrounded.forEach((child) => child.setAttribute('inert', ''));

    return () => backgrounded.forEach((child) => child.removeAttribute('inert'));
  }, [active, overlayRef]);
}
