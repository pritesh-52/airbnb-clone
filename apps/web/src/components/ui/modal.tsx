'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@/components/icons';
import { useBackgroundInert } from '@/hooks/use-background-inert';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useOverlayLayer } from '@/hooks/use-overlay-stack';
import { useScrollLock } from '@/hooks/use-scroll-lock';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Rendered in the header bar and wired up as the dialog's accessible name. */
  title: string;
  /** Hides the visual title while keeping it available to assistive tech. */
  hideTitle?: boolean;
  children: ReactNode;
  /** Pinned to the bottom of the dialog, outside the scrolling body. */
  footer?: ReactNode;
  size?: 'md' | 'lg' | 'full';
  /** Full-bleed variant used by the photo viewer. */
  variant?: 'sheet' | 'viewer';
}

const SIZE_CLASSES: Record<NonNullable<ModalProps['size']>, string> = {
  md: 'sm:max-w-[568px]',
  lg: 'sm:max-w-[780px]',
  full: 'sm:max-w-none',
};

/**
 * Accessible dialog.
 *
 * Implements the WAI-ARIA dialog pattern: `role="dialog"` + `aria-modal`, an
 * accessible name from the title, Escape to dismiss, a focus trap while open,
 * focus restoration on close, and background scroll lock.
 *
 * Dismiss-on-outside-click is a document-level pointer listener rather than a
 * handler on the backdrop element, so no non-interactive element carries a
 * click handler.
 */
export function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  children,
  footer,
  size = 'md',
  variant = 'sheet',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const layer = useOverlayLayer(open);

  useScrollLock(open);
  // Must precede the focus trap — see the hook's note on cleanup ordering.
  useBackgroundInert(overlayRef, open);
  useFocusTrap(dialogRef, open, closeButtonRef, layer.isTopmost);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && layer.isTopmost()) {
        event.stopPropagation();
        onClose();
      }
    }

    function handlePointerDown(event: MouseEvent) {
      if (!layer.isTopmost()) return;
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open, onClose, layer]);

  // Every dialog starts closed, so the server pass never reaches the portal.
  if (!open || typeof document === 'undefined') return null;

  const isViewer = variant === 'viewer';

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div
        className={
          isViewer
            ? 'absolute inset-0 bg-white'
            : 'absolute inset-0 bg-black/50 transition-opacity duration-200'
        }
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          'relative flex max-h-[92vh] w-full flex-col bg-white shadow-modal outline-none',
          'rounded-t-xl sm:rounded-xl',
          isViewer ? 'h-full max-h-none rounded-none sm:rounded-none' : '',
          SIZE_CLASSES[size],
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <header
          className={[
            'relative flex shrink-0 items-center px-6 py-4',
            isViewer ? '' : 'border-b border-hairline-soft',
          ].join(' ')}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="-ml-2 grid size-8 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-surface-muted"
          >
            <CloseIcon size={16} />
            <span className="sr-only">Close</span>
          </button>

          <h2
            id={titleId}
            className={[
              'absolute left-1/2 -translate-x-1/2 text-base font-semibold',
              hideTitle ? 'sr-only' : '',
            ].join(' ')}
          >
            {title}
          </h2>
        </header>

        {/*
          A focusable scroll container: without `tabIndex` a keyboard-only user
          cannot scroll overflowing dialog content (axe flags this as
          `scrollable-region-focusable`). `role="region"` plus a name from the
          dialog title is what makes a focusable non-widget element legitimate.
        */}
        <div
          role="region"
          aria-labelledby={titleId}
          tabIndex={0}
          className={['flex-1 overflow-y-auto', isViewer ? 'px-4 sm:px-10' : 'px-6 py-6'].join(' ')}
        >
          {children}
        </div>

        {footer ? (
          <footer className="shrink-0 border-t border-hairline-soft px-6 py-4">{footer}</footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
