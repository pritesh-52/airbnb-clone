import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import type { ApiErrorBody } from '@airbnb-clone/types';
import { HttpError } from '../lib/http-error.js';
import { logger } from '../lib/logger.js';
import { isProduction } from '../config/env.js';

/**
 * Terminal error middleware. Express 5 forwards rejected promises from async
 * handlers here automatically, so handlers do not need try/catch wrappers.
 *
 * Unknown errors are logged with their stack but reported to the client as a
 * bare 500 — internals are never serialised into a response.
 */
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Delegate to Express if the response has already started streaming.
  if (res.headersSent) {
    next(error);
    return;
  }

  const normalised = normalise(error);

  const logContext = {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    status: normalised.status,
    code: normalised.code,
  };

  if (normalised.status >= 500) {
    logger.error(normalised.message, {
      ...logContext,
      stack: error instanceof Error ? error.stack : undefined,
    });
  } else {
    logger.warn(normalised.message, logContext);
  }

  const body: ApiErrorBody = {
    error: {
      code: normalised.code,
      message:
        normalised.status >= 500 && isProduction
          ? 'An unexpected error occurred.'
          : normalised.message,
      ...(normalised.details ? { details: normalised.details } : {}),
      requestId: req.id,
    },
  };

  res.status(normalised.status).json(body);
}

function normalise(error: unknown): HttpError {
  if (error instanceof HttpError) return error;

  if (error instanceof ZodError) {
    return HttpError.validation(
      'Response failed contract validation.',
      error.issues.map((issue) => ({
        path: issue.path.map(String).join('.'),
        message: issue.message,
      })),
    );
  }

  // Malformed JSON bodies surface from body-parser as a SyntaxError with `status`.
  if (
    error instanceof SyntaxError &&
    'status' in error &&
    (error as { status?: number }).status === 400
  ) {
    return HttpError.badRequest('Request body is not valid JSON.');
  }

  return HttpError.internal(error instanceof Error ? error.message : 'Unknown error');
}
