'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ListingImage } from '@airbnb-clone/types';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/icons';
import { useBackgroundInert } from '@/hooks/use-background-inert';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useOverlayLayer } from '@/hooks/use-overlay-stack';
import { useScrollLock } from '@/hooks/use-scroll-lock';

interface LightboxProps {
  /** Index into `images`, or `null` when closed. */
  index: number | null;
  images: ListingImage[];
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Single-photo viewer.
 *
 * Opens over the photo tour, so it is the topmost overlay. Navigation wraps at
 * both ends and is driven by the arrow keys as well as the on-screen controls;
 * the counter is a polite live region so a screen reader announces each move.
 */
export function Lightbox({ index, images, onClose, onNavigate }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const open = index !== null;

  const layer = useOverlayLayer(open);

  useScrollLock(open);
  // Must precede the focus trap — see the hook's note on cleanup ordering.
  useBackgroundInert(overlayRef, open);
  useFocusTrap(overlayRef, open, closeButtonRef, layer.isTopmost);

  const step = useCallback(
    (delta: number) => {
      if (index === null || images.length === 0) return;
      onNavigate((index + delta + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (!layer.isTopmost()) return;

      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, step, layer]);

  if (index === null || typeof document === 'undefined') return null;

  const current = images[index];
  if (!current) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-60 flex flex-col bg-white outline-none"
    >
      <h2 id={titleId} className="sr-only">
        Photo viewer
      </h2>

      <header className="flex h-16 shrink-0 items-center justify-between px-6 lg:px-10">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="-ml-2 grid size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-muted"
        >
          <CloseIcon size={16} />
          <span className="sr-only">Close photo viewer</span>
        </button>

        <p className="text-sm text-ink-muted tabular-nums" aria-live="polite">
          {index + 1} / {images.length}
          <span className="sr-only"> — {current.alt}</span>
        </p>

        {/* Balances the header so the counter stays optically centred. */}
        <span className="size-10" aria-hidden="true" />
      </header>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-10 sm:px-20">
        <button
          type="button"
          onClick={() => step(-1)}
          className="absolute left-3 z-10 grid size-9 place-items-center rounded-full border border-hairline bg-white shadow-sm transition-transform duration-200 ease-airbnb hover:scale-105 sm:left-6"
        >
          <ChevronLeftIcon size={16} />
          <span className="sr-only">Previous photo</span>
        </button>

        <div className="relative h-full max-h-[80vh] w-full max-w-6xl">
          <Image
            key={current.id}
            src={current.url}
            alt={current.alt}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            priority
            className="object-contain"
          />
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          className="absolute right-3 z-10 grid size-9 place-items-center rounded-full border border-hairline bg-white shadow-sm transition-transform duration-200 ease-airbnb hover:scale-105 sm:right-6"
        >
          <ChevronRightIcon size={16} />
          <span className="sr-only">Next photo</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
