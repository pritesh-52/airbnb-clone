'use client';

import { useState } from 'react';
import type { Amenity, AmenityCategory } from '@airbnb-clone/types';
import { AmenityGlyph } from '@/components/icons';
import { Modal } from '@/components/ui/modal';

const CATEGORY_LABELS: Record<AmenityCategory, string> = {
  popular: 'Popular',
  bathroom: 'Bathroom',
  bedroom: 'Bedroom and laundry',
  entertainment: 'Entertainment',
  family: 'Family',
  'heating-cooling': 'Heating and cooling',
  safety: 'Home safety',
  outdoor: 'Outdoor',
  parking: 'Parking and facilities',
  services: 'Services',
};

const PREVIEW_COUNT = 10;

function AmenityRow({ amenity, showDescription }: { amenity: Amenity; showDescription?: boolean }) {
  return (
    <div className="flex items-start gap-4 py-2">
      {/*
        Unavailable amenities are dimmed to #717171 rather than a lighter grey:
        anything paler fails the 4.5:1 contrast floor against white.
      */}
      <AmenityGlyph
        name={amenity.icon}
        size={24}
        className={amenity.available ? 'mt-0.5 shrink-0' : 'mt-0.5 shrink-0 text-ink-muted'}
      />
      <div className={amenity.available ? '' : 'text-ink-muted'}>
        <span className={amenity.available ? 'text-base' : 'text-base line-through'}>
          {amenity.label}
        </span>
        {showDescription && amenity.description ? (
          <p className="text-sm text-ink-muted">{amenity.description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Amenities({ amenities }: { amenities: Amenity[] }) {
  const [open, setOpen] = useState(false);

  const preview = amenities.filter((amenity) => amenity.available).slice(0, PREVIEW_COUNT);

  // Preserve the category order declared above rather than data order.
  const grouped = (Object.keys(CATEGORY_LABELS) as AmenityCategory[])
    .map((category) => ({
      category,
      items: amenities.filter((amenity) => amenity.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section id="amenities" className="scroll-mt-32 border-b border-hairline-soft py-12">
      <h2 className="text-xl">What this place offers</h2>

      <div className="mt-6 grid grid-cols-1 gap-x-12 md:grid-cols-2">
        {preview.map((amenity) => (
          <AmenityRow key={amenity.id} amenity={amenity} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 rounded-lg border border-ink px-6 py-3 text-base font-semibold transition-colors duration-200 ease-airbnb hover:bg-surface-muted"
      >
        Show all {amenities.length} amenities
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="What this place offers" size="md">
        <h3 className="mb-6 text-2xl">What this place offers</h3>

        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.category}>
              <h4 className="mb-2 text-base font-semibold">{CATEGORY_LABELS[group.category]}</h4>
              <ul className="divide-y divide-hairline-soft">
                {group.items.map((amenity) => (
                  <li key={amenity.id}>
                    <AmenityRow amenity={amenity} showDescription />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Modal>
    </section>
  );
}
