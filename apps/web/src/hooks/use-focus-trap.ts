'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('aria-hidden') &&
      element.offsetWidth + element.offsetHeight > 0 &&
      window.getComputedStyle(element).visibility !== 'hidden',
  );
}

/**
 * Confines Tab focus to `containerRef` while `active`, and restores focus to
 * whatever was focused before the trap engaged once it releases.
 *
 * Focus moves to `initialFocusRef` if given, otherwise the first focusable
 * child, otherwise the container itself (which callers give `tabIndex={-1}`).
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>,
  /**
   * When overlays nest, only the frontmost one may pull focus. Without this
   * guard two open traps yank focus back and forth between them.
   */
  isTopmost: () => boolean = () => true,
): void {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Defer so the dialog has painted before focus lands on it.
    const focusFrame = requestAnimationFrame(() => {
      const target = initialFocusRef?.current ?? getFocusable(container)[0] ?? container;
      target.focus({ preventScroll: true });
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !container || !isTopmost()) return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || activeElement === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // Focus escaping the dialog (e.g. via browser UI) is pulled back in.
    function handleFocusIn(event: FocusEvent) {
      if (!container || !isTopmost()) return;
      if (!container.contains(event.target as Node)) {
        const focusable = getFocusable(container);
        (focusable[0] ?? container).focus({ preventScroll: true });
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [active, containerRef, initialFocusRef, isTopmost]);
}
