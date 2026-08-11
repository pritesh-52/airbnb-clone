import {
  listingSchema,
  type AvailabilityQuery,
  type AvailabilityResponse,
  type Listing,
  type RatingBreakdown,
  type Review,
  type ReviewsQuery,
  type ReviewsResponse,
} from '@airbnb-clone/types';
import { listing, reviews } from '../data/listing.data.js';
import { HttpError } from '../lib/http-error.js';
import { eachDate, round2 } from '../lib/dates.js';

/**
 * Read model for the listing. Outbound payloads are parsed through the shared
 * schema so a drift between the seed data and the published contract fails
 * here rather than in the browser.
 */

export function getListingBySlug(slug: string): Listing {
  if (slug !== listing.slug) {
    throw HttpError.notFound(`No listing found for slug "${slug}".`);
  }

  return listingSchema.parse(listing);
}

export function getReviews(slug: string, query: ReviewsQuery): ReviewsResponse {
  assertSlug(slug);

  const sorted = sortReviews(reviews, query.sort);
  const page = sorted.slice(query.offset, query.offset + query.limit);

  return {
    reviews: page,
    total: reviews.length,
    averageRating: round2(
      reviews.reduce((sum, review) => sum + review.rating, 0) / (reviews.length || 1),
    ),
    breakdown: listing.ratingBreakdown satisfies RatingBreakdown,
  };
}

export function getAvailability(slug: string, query: AvailabilityQuery): AvailabilityResponse {
  assertSlug(slug);

  if (new Date(query.to) <= new Date(query.from)) {
    throw HttpError.badRequest('`to` must be after `from`.');
  }

  const window = new Set(eachDate(query.from, query.to));
  const unavailableDates = listing.availability.blockedDates.filter((date) => window.has(date));

  return {
    from: query.from,
    to: query.to,
    minimumNights: listing.availability.minimumNights,
    maximumNights: listing.availability.maximumNights,
    checkInTime: listing.availability.checkInTime,
    checkOutTime: listing.availability.checkOutTime,
    unavailableDates,
  };
}

function sortReviews(source: Review[], sort: ReviewsQuery['sort']): Review[] {
  const copy = [...source];

  switch (sort) {
    case 'rating-desc':
      return copy.sort((a, b) => b.rating - a.rating || compareRecent(a, b));
    case 'rating-asc':
      return copy.sort((a, b) => a.rating - b.rating || compareRecent(a, b));
    case 'recent':
    default:
      return copy.sort(compareRecent);
  }
}

function compareRecent(a: Review, b: Review): number {
  return b.createdAt.localeCompare(a.createdAt);
}

function assertSlug(slug: string): void {
  if (slug !== listing.slug) {
    throw HttpError.notFound(`No listing found for slug "${slug}".`);
  }
}
