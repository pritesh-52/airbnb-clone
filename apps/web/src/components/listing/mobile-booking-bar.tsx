'use client';

import { useState } from 'react';
import type { Listing } from '@airbnb-clone/types';
import { StarIcon } from '@/components/icons';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatRating } from '@/lib/format';
import { BookingCard } from './booking-card';

/**
 * Fixed bottom bar shown below `lg`, mirroring the reference's mobile booking
 * affordance. Opening it reuses the same `BookingCard` so pricing logic exists
 * in exactly one place.
 */
export function MobileBookingBar({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-white px-6 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base">
              <span className="font-semibold">
                {formatCurrency(listing.pricing.nightlyRate, listing.pricing.currency)}
              </span>{' '}
              <span className="text-ink-muted">night</span>
            </p>
            <p className="flex items-center gap-1 text-xs text-ink-muted">
              <StarIcon size={10} />
              <span className="font-semibold text-ink">{formatRating(listing.rating)}</span>·{' '}
              {listing.reviewsCount} reviews
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-reserve rounded-lg px-6 py-3 text-base font-semibold"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* Spacer so the bar never covers the footer's last row. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      <Modal open={open} onClose={() => setOpen(false)} title="Reserve this place" size="md">
        <BookingCard listing={listing} variant="plain" />
      </Modal>
    </>
  );
}
