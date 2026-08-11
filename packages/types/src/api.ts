import { z } from 'zod';
import { listingSchema, reviewSchema, ratingBreakdownSchema } from './listing.js';

/**
 * Transport-level contracts: the response envelope, error shape, and the
 * request/response pairs for each endpoint.
 *
 * Every successful response is `{ data, meta? }`; every failure is
 * `{ error: { code, message, details? } }`. Clients can therefore branch on the
 * presence of `error` without inspecting the status code.
 */

export const apiErrorCodeSchema = z.enum([
  'BAD_REQUEST',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'METHOD_NOT_ALLOWED',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
]);
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiErrorSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string(),
    /** Field-level issues, keyed by dotted path. Present on VALIDATION_ERROR. */
    details: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
    requestId: z.string().optional(),
  }),
});
export type ApiErrorBody = z.infer<typeof apiErrorSchema>;

/** Success envelope. Generic over the payload so each endpoint stays typed. */
export interface ApiSuccess<TData, TMeta = undefined> {
  data: TData;
  meta?: TMeta;
}

export type ApiResponse<TData, TMeta = undefined> = ApiSuccess<TData, TMeta> | ApiErrorBody;

export function isApiError<TData, TMeta>(body: ApiResponse<TData, TMeta>): body is ApiErrorBody {
  return typeof body === 'object' && body !== null && 'error' in body;
}

/* ------------------------------------------------------------------ health */

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  uptimeSeconds: z.number().nonnegative(),
  timestamp: z.iso.datetime(),
  version: z.string(),
});
export type HealthResponse = z.infer<typeof healthResponseSchema>;

/* ----------------------------------------------------------------- listing */

export const listingParamsSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
});
export type ListingParams = z.infer<typeof listingParamsSchema>;

export const listingResponseSchema = listingSchema;
export type ListingResponse = z.infer<typeof listingResponseSchema>;

/* ----------------------------------------------------------------- reviews */

export const reviewsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(6),
  offset: z.coerce.number().int().nonnegative().default(0),
  sort: z.enum(['recent', 'rating-desc', 'rating-asc']).default('recent'),
});
export type ReviewsQuery = z.infer<typeof reviewsQuerySchema>;

export const reviewsResponseSchema = z.object({
  reviews: z.array(reviewSchema),
  total: z.number().int().nonnegative(),
  averageRating: z.number().min(0).max(5),
  breakdown: ratingBreakdownSchema,
});
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;

export const reviewsMetaSchema = z.object({
  limit: z.number().int(),
  offset: z.number().int(),
  hasMore: z.boolean(),
});
export type ReviewsMeta = z.infer<typeof reviewsMetaSchema>;

/* ------------------------------------------------------------ availability */

export const availabilityQuerySchema = z.object({
  /** Inclusive ISO-8601 start of the window to report on. */
  from: z.iso.date(),
  /** Exclusive ISO-8601 end of the window. */
  to: z.iso.date(),
});
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;

export const availabilityResponseSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  minimumNights: z.number().int().positive(),
  maximumNights: z.number().int().positive(),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  unavailableDates: z.array(z.iso.date()),
});
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;

/* ------------------------------------------------------------------- quote */

export const quoteRequestSchema = z
  .object({
    checkIn: z.iso.date(),
    checkOut: z.iso.date(),
    guests: z.number().int().positive().max(16),
  })
  .refine((value) => new Date(value.checkOut) > new Date(value.checkIn), {
    message: 'checkOut must be after checkIn',
    path: ['checkOut'],
  });
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

export const quoteLineSchema = z.object({
  id: z.string(),
  label: z.string(),
  amount: z.number(),
  /** Renders with a tooltip/underline in the price breakdown. */
  isDiscount: z.boolean().default(false),
});
export type QuoteLine = z.infer<typeof quoteLineSchema>;

export const quoteResponseSchema = z.object({
  currency: z.string().length(3),
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  guests: z.number().int().positive(),
  nights: z.number().int().positive(),
  nightlyRate: z.number(),
  lines: z.array(quoteLineSchema),
  total: z.number(),
});
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
