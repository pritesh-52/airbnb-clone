import { isApiError, type ApiResponse } from '@airbnb-clone/types';
import type {
  AvailabilityResponse,
  Listing,
  QuoteRequest,
  QuoteResponse,
  ReviewsMeta,
  ReviewsResponse,
} from '@airbnb-clone/types';
import { CLIENT_API_URL, SERVER_API_URL } from './config';

/** Thrown for any non-2xx response or transport failure. */
export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: { path: string; message: string }[];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: { path: string; message: string }[],
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  /** Next fetch cache directive; server calls default to no-store. */
  cache?: RequestCache;
  signal?: AbortSignal;
  baseUrl?: string;
}

async function request<TData, TMeta = undefined>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: TData; meta?: TMeta }> {
  const base = options.baseUrl ?? (typeof window === 'undefined' ? SERVER_API_URL : CLIENT_API_URL);
  const url = `${base}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: options.cache ?? 'no-store',
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiRequestError(
      0,
      'NETWORK_ERROR',
      `Could not reach the API at ${base}. Is it running? (${
        error instanceof Error ? error.message : 'unknown error'
      })`,
    );
  }

  let body: ApiResponse<TData, TMeta>;

  try {
    body = (await response.json()) as ApiResponse<TData, TMeta>;
  } catch {
    throw new ApiRequestError(
      response.status,
      'INVALID_RESPONSE',
      `API returned a non-JSON response (${response.status}).`,
    );
  }

  if (!response.ok || isApiError(body)) {
    const error = isApiError(body)
      ? body.error
      : { code: 'INTERNAL_ERROR', message: `Request failed with status ${response.status}.` };

    throw new ApiRequestError(
      response.status,
      error.code,
      error.message,
      'details' in error ? error.details : undefined,
    );
  }

  return body;
}

/* --------------------------------------------------------------- endpoints */

export async function fetchListing(slug: string): Promise<Listing> {
  const { data } = await request<Listing>(`/listings/${slug}`);
  return data;
}

export async function fetchReviews(
  slug: string,
  params: { limit?: number; offset?: number; sort?: 'recent' | 'rating-desc' | 'rating-asc' } = {},
  options: Pick<RequestOptions, 'signal'> = {},
): Promise<{ data: ReviewsResponse; meta?: ReviewsMeta }> {
  const search = new URLSearchParams();
  if (params.limit !== undefined) search.set('limit', String(params.limit));
  if (params.offset !== undefined) search.set('offset', String(params.offset));
  if (params.sort) search.set('sort', params.sort);

  const suffix = search.size > 0 ? `?${search.toString()}` : '';
  return request<ReviewsResponse, ReviewsMeta>(`/listings/${slug}/reviews${suffix}`, options);
}

export async function fetchAvailability(
  slug: string,
  range: { from: string; to: string },
  options: Pick<RequestOptions, 'signal'> = {},
): Promise<AvailabilityResponse> {
  const search = new URLSearchParams({ from: range.from, to: range.to });
  const { data } = await request<AvailabilityResponse>(
    `/listings/${slug}/availability?${search.toString()}`,
    options,
  );
  return data;
}

export async function createQuote(
  slug: string,
  payload: QuoteRequest,
  options: Pick<RequestOptions, 'signal'> = {},
): Promise<QuoteResponse> {
  const { data } = await request<QuoteResponse>(`/listings/${slug}/quote`, {
    method: 'POST',
    body: payload,
    ...options,
  });
  return data;
}
