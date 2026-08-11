'use client';

import { useMemo, useState } from 'react';
import type { Listing } from '@airbnb-clone/types';
import { HeartIcon, ShareIcon } from '@/components/icons';
import { Gallery } from './gallery';
import { Lightbox } from './lightbox';
import { PhotoTour } from './photo-tour';

/**
 * Owns the three photo views and the transitions between them:
 *
 *   listing page  →  photo tour  →  lightbox
 *
 * Keeping the state here means the tour stays mounted underneath the lightbox,
 * so closing the lightbox returns to the tour at the same scroll position — and
 * the "saved" toggle stays in sync across the header and the tour.
 */
export function Photos({ listing }: { listing: Listing }) {
  const [tourOpen, setTourOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Flattened tour order — the sequence the lightbox steps through.
  const allPhotos = useMemo(
    () => listing.photoTour.flatMap((category) => category.images),
    [listing.photoTour],
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-y-2 pt-6 pb-4 md:pt-8">
        <h1 className="text-2xl">{listing.title}</h1>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline underline-offset-2 transition-colors duration-200 hover:bg-surface-muted"
          >
            <ShareIcon size={16} />
            Share
          </button>

          <button
            type="button"
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline underline-offset-2 transition-colors duration-200 hover:bg-surface-muted"
          >
            <HeartIcon
              size={16}
              filled={saved}
              className={saved ? 'text-rausch' : 'text-ink'}
              strokeWidth={saved ? 0 : 2}
            />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div id="photos" className="scroll-mt-32">
        <Gallery
          images={listing.images}
          title={listing.title}
          onOpenTour={() => setTourOpen(true)}
        />
      </div>

      <PhotoTour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        categories={listing.photoTour}
        onOpenPhoto={setPhotoIndex}
        saved={saved}
        onToggleSaved={() => setSaved((value) => !value)}
      />

      <Lightbox
        index={photoIndex}
        images={allPhotos}
        onClose={() => setPhotoIndex(null)}
        onNavigate={setPhotoIndex}
      />
    </>
  );
}
