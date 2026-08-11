/**
 * Runtime configuration.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so they are read as whole
 * identifiers rather than via a computed lookup — Next cannot substitute
 * `process.env[key]`.
 */

/** Base URL used by server components. Falls back to the public URL. */
export const SERVER_API_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/** Base URL used by the browser. */
export const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/** Slug of the listing rendered at `/`. */
export const LISTING_SLUG =
  process.env.NEXT_PUBLIC_LISTING_SLUG ?? 'romantic-jacuzzi-1bhk-candolim';
