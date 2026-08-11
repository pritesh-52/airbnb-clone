import type { Request, Response } from 'express';
import type {
  AvailabilityQuery,
  ListingParams,
  QuoteRequest,
  ReviewsMeta,
  ReviewsQuery,
} from '@airbnb-clone/types';
import { getAvailability, getListingBySlug, getReviews } from '../services/listing.service.js';
import { createQuote } from '../services/quote.service.js';
import { validatedQuery } from '../middleware/validate.js';
import { ok } from '../lib/respond.js';

/**
 * Controllers stay thin: pull validated input off the request, call a service,
 * hand the result to the responder. No business rules live here.
 */

export function showListing(req: Request, res: Response): void {
  const { slug } = req.params as unknown as ListingParams;
  ok(res, getListingBySlug(slug));
}

export function listReviews(req: Request, res: Response): void {
  const { slug } = req.params as unknown as ListingParams;
  const query = validatedQuery<ReviewsQuery>(res);

  const result = getReviews(slug, query);
  const meta: ReviewsMeta = {
    limit: query.limit,
    offset: query.offset,
    hasMore: query.offset + result.reviews.length < result.total,
  };

  ok(res, result, meta);
}

export function showAvailability(req: Request, res: Response): void {
  const { slug } = req.params as unknown as ListingParams;
  const query = validatedQuery<AvailabilityQuery>(res);

  ok(res, getAvailability(slug, query));
}

export function createListingQuote(req: Request, res: Response): void {
  const { slug } = req.params as unknown as ListingParams;
  const body = req.body as QuoteRequest;

  ok(res, createQuote(slug, body), undefined, 201);
}
