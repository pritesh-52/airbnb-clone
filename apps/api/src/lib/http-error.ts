import type { ApiErrorCode } from '@airbnb-clone/types';

export interface HttpErrorDetail {
  path: string;
  message: string;
}

/**
 * Errors thrown anywhere in the request path. The error middleware maps these
 * onto the wire format; anything that is *not* an HttpError is treated as an
 * unexpected fault and reported as a generic 500 so internals never leak.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: HttpErrorDetail[];

  constructor(status: number, code: ApiErrorCode, message: string, details?: HttpErrorDetail[]) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, HttpError);
  }

  static badRequest(message: string, details?: HttpErrorDetail[]): HttpError {
    return new HttpError(400, 'BAD_REQUEST', message, details);
  }

  static validation(message: string, details: HttpErrorDetail[]): HttpError {
    return new HttpError(422, 'VALIDATION_ERROR', message, details);
  }

  static notFound(message: string): HttpError {
    return new HttpError(404, 'NOT_FOUND', message);
  }

  static internal(message = 'An unexpected error occurred.'): HttpError {
    return new HttpError(500, 'INTERNAL_ERROR', message);
  }
}
