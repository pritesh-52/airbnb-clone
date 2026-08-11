import { Router } from 'express';
import {
  availabilityQuerySchema,
  listingParamsSchema,
  quoteRequestSchema,
  reviewsQuerySchema,
} from '@airbnb-clone/types';
import {
  createListingQuote,
  listReviews,
  showAvailability,
  showListing,
} from '../controllers/listing.controller.js';
import { validate } from '../middleware/validate.js';

export const listingRouter: Router = Router();

listingRouter.get('/listings/:slug', validate({ params: listingParamsSchema }), showListing);

listingRouter.get(
  '/listings/:slug/reviews',
  validate({ params: listingParamsSchema, query: reviewsQuerySchema }),
  listReviews,
);

listingRouter.get(
  '/listings/:slug/availability',
  validate({ params: listingParamsSchema, query: availabilityQuerySchema }),
  showAvailability,
);

listingRouter.post(
  '/listings/:slug/quote',
  validate({ params: listingParamsSchema, body: quoteRequestSchema }),
  createListingQuote,
);
