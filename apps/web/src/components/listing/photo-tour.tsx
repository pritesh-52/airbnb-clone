'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { PhotoCategory } from '@airbnb-clone/types';
import { ChevronLeftIcon, HeartIcon, ShareIcon } from '@/components/icons';
import { useBackgroundInert } from '@/hooks/use-background-inert';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useOverlayLayer } from '@/hooks/use-overlay-stack';
import { useScrollLock } from '@/hooks/use-scroll-lock';

interface PhotoTourProps {
  open: boolean;
  onClose: () => void;
  categories: PhotoCategory[];
  /** Opens the single-photo viewer at a flattened tour index. */
  onOpenPhoto: (index: number) => void;
  saved: boolean;
  onToggleSaved: () => void;
}

/**
 * Full-screen photo tour.
 *
 * Photos are grouped by room. A thumbnail strip at the top jumps to a category;
 * each category then renders its name and in-room amenities beside its photos —
 * first photo full-column-width, the rest in a two-up grid.
 *
 * Built as its own overlay rather than through `Modal` because it is a
 * full-page scrolling document with its own header, not a centred sheet. It
 * reuses the same scroll-lock / inert / focus-trap hooks so the dialog
 * semantics stay identical.
 */
export function PhotoTour({
  open,
  onClose,
  categories,
  onOpenPhoto,
  saved,
  onToggleSaved,
}: PhotoTourProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const layer = useOverlayLayer(open);

  useScrollLock(open);
  // Must precede the focus trap — see the hook's note on cleanup ordering.
  useBackgroundInert(overlayRef, open);
  useFocusTrap(overlayRef, open, closeButtonRef, layer.isTopmost);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      // The lightbox opens on top of the tour; only the frontmost overlay
      // may consume Escape.
      if (event.key === 'Escape' && layer.isTopmost()) {
        event.stopPropagation();
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, layer]);

  const jumpTo = useCallback((categoryId: string) => {
    document.getElementById(`tour-${categoryId}`)?.scrollIntoView({ block: 'start' });
  }, []);

  /**
   * Each category paired with the index its first photo occupies in the
   * flattened tour, so a click can open the lightbox at the right place.
   *
   * Computed declaratively rather than with a running counter: a reassigned
   * `let` is rejected by the React Compiler rules, and the quadratic cost is
   * irrelevant for a handful of categories.
   */
  const sections = useMemo(
    () =>
      categories.map((category, position) => ({
        category,
        startIndex: categories
          .slice(0, position)
          .reduce((total, earlier) => total + earlier.images.length, 0),
      })),
    [categories],
  );

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-50 overflow-y-auto bg-white outline-none"
    >
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-6 lg:px-10">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="-ml-2 grid size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-muted"
        >
          <ChevronLeftIcon size={18} />
          <span className="sr-only">Close photo tour</span>
        </button>

        <h2 id={titleId} className="text-base font-semibold">
          Photo tour
        </h2>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-muted"
          >
            <ShareIcon size={16} />
            <span className="sr-only">Share this listing</span>
          </button>
          <button
            type="button"
            aria-pressed={saved}
            onClick={onToggleSaved}
            className="grid size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-muted"
          >
            <HeartIcon
              size={16}
              filled={saved}
              className={saved ? 'text-rausch' : 'text-ink'}
              strokeWidth={saved ? 0 : 2}
            />
            <span className="sr-only">{saved ? 'Remove from saved' : 'Save this listing'}</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        {/* Category strip — jumps to a section rather than filtering. */}
        <nav aria-label="Photo categories" className="pt-2 pb-10">
          {/* A fixed 8-column grid at desktop rather than free wrapping, so the
              strip breaks after the eighth category exactly as the reference does. */}
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {categories.map((category) => {
              const cover = category.images[0];
              if (!cover) return null;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(category.id)}
                    className="group w-full text-left"
                  >
                    <span className="relative block aspect-4/3 w-full overflow-hidden rounded-lg">
                      <Image
                        src={cover.url}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 120px"
                        className="object-cover transition-[filter] duration-200 ease-airbnb group-hover:brightness-90"
                      />
                    </span>
                    <span className="mt-1.5 block text-xs leading-4 text-ink-muted group-hover:text-ink">
                      {category.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-8">
          {sections.map(({ category, startIndex }) => {
            const [lead, ...rest] = category.images;
            if (!lead) return null;

            return (
              <section
                key={category.id}
                id={`tour-${category.id}`}
                aria-labelledby={`tour-heading-${category.id}`}
                className="grid grid-cols-1 gap-4 scroll-mt-20 lg:grid-cols-2 lg:gap-12"
              >
                <div>
                  <h3 id={`tour-heading-${category.id}`} className="text-2xl">
                    {category.name}
                  </h3>
                  {category.amenities.length > 0 ? (
                    <p className="mt-1 text-sm text-ink-muted">{category.amenities.join(' · ')}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <TourPhoto
                    image={lead}
                    index={startIndex}
                    onOpen={onOpenPhoto}
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />

                  {rest.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {rest.map((image, offset) => (
                        <TourPhoto
                          key={image.id}
                          image={image}
                          index={startIndex + offset + 1}
                          onOpen={onOpenPhoto}
                          sizes="(max-width: 1024px) 50vw, 236px"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function TourPhoto({
  image,
  index,
  onOpen,
  sizes,
}: {
  image: PhotoCategory['images'][number];
  index: number;
  onOpen: (index: number) => void;
  sizes: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative block aspect-3/2 w-full overflow-hidden rounded-lg bg-surface-muted"
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover transition-[filter] duration-200 ease-airbnb group-hover:brightness-90"
      />
      <span className="sr-only">Open this photo full screen</span>
    </button>
  );
}
