import type { QuoteLine, QuoteRequest, QuoteResponse } from '@airbnb-clone/types';
import { listing } from '../data/listing.data.js';
import { HttpError } from '../lib/http-error.js';
import { eachDate, nightsBetween, round2 } from '../lib/dates.js';

/**
 * Prices a stay. Kept apart from the read model because it is the one place
 * with real business rules: stay-length bounds, blocked dates, occupancy, and
 * the fee/discount ladder.
 */
export function createQuote(slug: string, request: QuoteRequest): QuoteResponse {
  if (slug !== listing.slug) {
    throw HttpError.notFound(`No listing found for slug "${slug}".`);
  }

  const { pricing, availability, capacity } = listing;
  const nights = nightsBetween(request.checkIn, request.checkOut);

  if (request.guests > capacity.guests) {
    throw HttpError.validation('Too many guests for this listing.', [
      { path: 'body.guests', message: `This listing sleeps a maximum of ${capacity.guests}.` },
    ]);
  }

  if (nights < availability.minimumNights) {
    throw HttpError.validation('Stay is shorter than the minimum.', [
      {
        path: 'body.checkOut',
        message: `Minimum stay is ${availability.minimumNights} nights.`,
      },
    ]);
  }

  if (nights > availability.maximumNights) {
    throw HttpError.validation('Stay is longer than the maximum.', [
      {
        path: 'body.checkOut',
        message: `Maximum stay is ${availability.maximumNights} nights.`,
      },
    ]);
  }

  const blocked = new Set(availability.blockedDates);
  const conflicts = eachDate(request.checkIn, request.checkOut).filter((date) => blocked.has(date));

  if (conflicts.length > 0) {
    throw HttpError.validation('Those dates are not available.', [
      { path: 'body.checkIn', message: `Unavailable: ${conflicts.join(', ')}.` },
    ]);
  }

  const lines: QuoteLine[] = [];

  const accommodation = round2(pricing.nightlyRate * nights);
  lines.push({
    id: 'accommodation',
    label: `$${pricing.nightlyRate.toLocaleString('en-US')} x ${nights} nights`,
    amount: accommodation,
    isDiscount: false,
  });

  let runningTotal = accommodation;

  // Airbnb applies the weekly discount to the accommodation subtotal only.
  if (nights >= 7 && pricing.weeklyDiscountRate > 0) {
    const discount = round2(-accommodation * pricing.weeklyDiscountRate);
    lines.push({
      id: 'weekly-discount',
      label: 'Weekly stay discount',
      amount: discount,
      isDiscount: true,
    });
    runningTotal = round2(runningTotal + discount);
  }

  if (pricing.cleaningFee > 0) {
    lines.push({
      id: 'cleaning-fee',
      label: 'Cleaning fee',
      amount: pricing.cleaningFee,
      isDiscount: false,
    });
    runningTotal = round2(runningTotal + pricing.cleaningFee);
  }

  const serviceFee = round2(runningTotal * pricing.serviceFeeRate);
  lines.push({
    id: 'service-fee',
    label: 'Airbnb service fee',
    amount: serviceFee,
    isDiscount: false,
  });
  runningTotal = round2(runningTotal + serviceFee);

  const taxes = round2(runningTotal * pricing.taxRate);
  lines.push({ id: 'taxes', label: 'Taxes', amount: taxes, isDiscount: false });
  runningTotal = round2(runningTotal + taxes);

  return {
    currency: pricing.currency,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    guests: request.guests,
    nights,
    nightlyRate: pricing.nightlyRate,
    lines,
    total: runningTotal,
  };
}
