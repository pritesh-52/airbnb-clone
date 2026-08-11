'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Listing, QuoteResponse } from '@airbnb-clone/types';
import { StarIcon } from '@/components/icons';
import { ApiRequestError, createQuote } from '@/lib/api';
import { useClientValue } from '@/hooks/use-client-value';
import {
  addDays,
  formatCurrency,
  formatCurrencyPrecise,
  formatRating,
  nightsBetween,
  todayIso,
} from '@/lib/format';

interface BookingCardProps {
  listing: Listing;
  /** Rendered without the sticky wrapper inside the mobile sheet. */
  variant?: 'sticky' | 'plain';
}

interface KeyedError {
  key: string;
  message: string;
}

/**
 * Booking panel.
 *
 * Dates start empty (matching Airbnb's "Add dates" state), so the server and
 * client render identical markup. The quote and any error are keyed by the
 * selection they belong to and derived at render time, which means a stale
 * price can never be shown while a new one is in flight.
 */
export function BookingCard({ listing, variant = 'sticky' }: BookingCardProps) {
  const { pricing, availability, capacity } = listing;

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState<KeyedError | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const checkInId = useId();
  const checkOutId = useId();
  const guestsId = useId();
  const errorId = useId();

  // `min` on the date inputs is client-only; the server renders it unset.
  const minDate = useClientValue(todayIso, '');

  const nights = useMemo(
    () => (checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0),
    [checkIn, checkOut],
  );

  const selectionKey = `${checkIn}|${checkOut}|${guests}`;
  const isSelectionValid = Boolean(checkIn && checkOut && nights > 0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-price whenever the selection changes. Debounced because the native date
  // input fires per keystroke when typed rather than picked.
  useEffect(() => {
    if (!checkIn || !checkOut || nightsBetween(checkIn, checkOut) <= 0) return;

    const key = `${checkIn}|${checkOut}|${guests}`;
    const controller = new AbortController();

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPendingKey(key);

      createQuote(listing.slug, { checkIn, checkOut, guests }, { signal: controller.signal })
        .then((result) => {
          setQuote(result);
          setError(null);
        })
        .catch((cause: unknown) => {
          if (cause instanceof DOMException && cause.name === 'AbortError') return;
          setError({
            key,
            message:
              cause instanceof ApiRequestError
                ? (cause.details?.[0]?.message ?? cause.message)
                : 'We could not price those dates. Please try again.',
          });
        })
        .finally(() => setPendingKey((current) => (current === key ? null : current)));
    }, 300);

    return () => {
      controller.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [listing.slug, checkIn, checkOut, guests]);

  // Only surface results that belong to the current selection.
  const activeQuote =
    isSelectionValid &&
    quote?.checkIn === checkIn &&
    quote?.checkOut === checkOut &&
    quote?.guests === guests
      ? quote
      : null;

  const activeError = error?.key === selectionKey ? error.message : null;
  const pending = pendingKey === selectionKey;

  function handleCheckInChange(value: string) {
    setCheckIn(value);
    setConfirmation(null);

    // Keep the range valid: push checkout past the new check-in if needed.
    if (value && (!checkOut || nightsBetween(value, checkOut) < availability.minimumNights)) {
      setCheckOut(addDays(value, availability.minimumNights));
    }
  }

  const canReserve = Boolean(activeQuote) && !pending && !activeError;

  return (
    // `top-36` clears both the 80px header and the section nav that docks
    // beneath it once the gallery has scrolled away.
    <div className={variant === 'sticky' ? 'sticky top-36' : ''}>
      <div className="rounded-card border border-hairline bg-white p-6 shadow-card">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xl">
            <span className="font-semibold">
              {formatCurrency(pricing.nightlyRate, pricing.currency)}
            </span>{' '}
            <span className="text-base font-normal text-ink-muted">night</span>
          </p>

          <p className="flex items-center gap-1 text-sm">
            <StarIcon size={12} />
            <span className="font-semibold">{formatRating(listing.rating)}</span>
            <span className="text-ink-muted">· {listing.reviewsCount} reviews</span>
          </p>
        </div>

        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!activeQuote) return;
            setConfirmation(
              `Reservation request sent for ${activeQuote.nights} nights, ${
                activeQuote.guests
              } guest${activeQuote.guests === 1 ? '' : 's'}. Total ${formatCurrencyPrecise(
                activeQuote.total,
                activeQuote.currency,
              )}.`,
            );
          }}
        >
          <fieldset className="rounded-lg border border-hairline">
            <legend className="sr-only">Trip dates and guests</legend>

            <div className="grid grid-cols-2">
              <div className="border-r border-hairline p-3">
                <label
                  htmlFor={checkInId}
                  className="block text-2xs font-semibold tracking-wide uppercase"
                >
                  Check-in
                </label>
                <input
                  id={checkInId}
                  type="date"
                  value={checkIn}
                  min={minDate || undefined}
                  onChange={(event) => handleCheckInChange(event.target.value)}
                  aria-describedby={activeError ? errorId : undefined}
                  className="mt-1 w-full bg-transparent text-sm outline-none"
                />
              </div>

              <div className="p-3">
                <label
                  htmlFor={checkOutId}
                  className="block text-2xs font-semibold tracking-wide uppercase"
                >
                  Checkout
                </label>
                <input
                  id={checkOutId}
                  type="date"
                  value={checkOut}
                  min={
                    checkIn ? addDays(checkIn, availability.minimumNights) : minDate || undefined
                  }
                  onChange={(event) => {
                    setCheckOut(event.target.value);
                    setConfirmation(null);
                  }}
                  aria-describedby={activeError ? errorId : undefined}
                  className="mt-1 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="border-t border-hairline p-3">
              <label
                htmlFor={guestsId}
                className="block text-2xs font-semibold tracking-wide uppercase"
              >
                Guests
              </label>
              <select
                id={guestsId}
                value={guests}
                onChange={(event) => {
                  setGuests(Number(event.target.value));
                  setConfirmation(null);
                }}
                className="mt-1 w-full bg-transparent text-sm outline-none"
              >
                {Array.from({ length: capacity.guests }, (_, offset) => offset + 1).map((count) => (
                  <option key={count} value={count}>
                    {count} guest{count === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!canReserve}
            className="btn-reserve mt-4 w-full rounded-lg py-3.5 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-55"
          >
            {activeQuote ? 'Reserve' : 'Check availability'}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-ink-muted">
          {activeQuote
            ? 'You won’t be charged yet'
            : `Minimum stay: ${availability.minimumNights} nights`}
        </p>

        {/* Status region: pricing, validation and confirmation all announce here. */}
        <div aria-live="polite" aria-busy={pending}>
          {activeError ? (
            <p id={errorId} role="alert" className="mt-4 text-sm text-arches">
              {activeError}
            </p>
          ) : null}

          {confirmation ? <p className="mt-4 text-sm text-babu">{confirmation}</p> : null}

          {activeQuote ? (
            <div className="mt-6">
              <ul className="space-y-3">
                {activeQuote.lines.map((line) => (
                  <li key={line.id} className="flex items-center justify-between text-base">
                    <span className="underline decoration-ink-subtle underline-offset-2">
                      {line.label}
                    </span>
                    <span className={line.isDiscount ? 'text-babu' : ''}>
                      {line.isDiscount ? '−' : ''}
                      {formatCurrencyPrecise(Math.abs(line.amount), activeQuote.currency)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-center justify-between border-t border-hairline pt-4 text-base font-semibold">
                <span>Total ({activeQuote.currency})</span>
                <span>{formatCurrencyPrecise(activeQuote.total, activeQuote.currency)}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
