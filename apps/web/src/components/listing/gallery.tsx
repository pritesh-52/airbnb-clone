'use client';

import Image from 'next/image';
import type { ListingImage } from '@airbnb-clone/types';
import { GridIcon } from '@/components/icons';

interface GalleryProps {
  images: ListingImage[];
  title: string;
  /** Every hero image opens the photo tour, matching the reference. */
  onOpenTour: () => void;
}

/**
 * Hero gallery.
 *
 * Desktop renders the 1-large + 4-small mosaic; below `md` it collapses to a
 * swipeable rail with scroll-snap. Neither opens a viewer directly — both hand
 * off to the photo tour, which is where photo browsing happens.
 */
export function Gallery({ images, title, onOpenTour }: GalleryProps) {
  const hero = images[0];
  const grid = images.slice(1, 5);

  if (!hero) return null;

  return (
    <>
      {/* Mobile: full-bleed snap rail */}
      <div className="md:hidden">
        <ul
          className="-mx-6 flex snap-x snap-mandatory gap-1 overflow-x-auto"
          aria-label={`Photos of ${title}`}
        >
          {images.map((image, imageIndex) => (
            <li key={image.id} className="w-full shrink-0 snap-center">
              <button
                type="button"
                onClick={onOpenTour}
                className="relative block aspect-4/3 w-full"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  priority={imageIndex === 0}
                  className="object-cover"
                />
                <span className="sr-only">Open the photo tour</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: 1 + 4 mosaic. The 2:1 container drives cell heights, so every
          tile fills its grid area exactly — intrinsic aspect ratios on the
          children would leave the second row short of the hero. */}
      <div className="relative hidden md:block">
        <div className="grid aspect-2/1 grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-gallery">
          <button
            type="button"
            onClick={onOpenTour}
            className="group relative col-span-2 row-span-2 h-full w-full overflow-hidden"
          >
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              sizes="(max-width: 1128px) 50vw, 560px"
              priority
              className="object-cover transition-[filter] duration-200 ease-airbnb group-hover:brightness-90"
            />
            <span className="sr-only">Open the photo tour</span>
          </button>

          {grid.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={onOpenTour}
              className="group relative h-full w-full overflow-hidden"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 1128px) 25vw, 280px"
                className="object-cover transition-[filter] duration-200 ease-airbnb group-hover:brightness-90"
              />
              <span className="sr-only">Open the photo tour</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenTour}
          className="absolute right-6 bottom-6 flex items-center gap-2 rounded-lg border border-ink bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 ease-airbnb hover:bg-surface-muted"
        >
          <GridIcon size={14} />
          Show all photos
        </button>
      </div>
    </>
  );
}
