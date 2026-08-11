import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';
import { HttpError } from '../lib/http-error.js';

interface ValidationSchemas {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
}

/**
 * Validates `params` / `query` / `body` against zod schemas and replaces each
 * segment with the *parsed* value, so downstream handlers receive coerced,
 * defaulted, fully-typed data instead of raw strings.
 *
 * Express 5 exposes `req.query` as a getter, so parsed query values are stashed
 * on `res.locals.query` rather than reassigned.
 */
export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const details: { path: string; message: string }[] = [];

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (result.success) {
        Object.assign(req.params, result.data);
      } else {
        details.push(...toDetails(result.error.issues, 'params'));
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (result.success) {
        res.locals.query = result.data;
      } else {
        details.push(...toDetails(result.error.issues, 'query'));
      }
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (result.success) {
        req.body = result.data;
      } else {
        details.push(...toDetails(result.error.issues, 'body'));
      }
    }

    if (details.length > 0) {
      next(HttpError.validation('Request failed validation.', details));
      return;
    }

    next();
  };
}

function toDetails(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
  segment: string,
): { path: string; message: string }[] {
  return issues.map((issue) => ({
    path: [segment, ...issue.path.map(String)].join('.'),
    message: issue.message,
  }));
}

/** Reads the validated query set by `validate({ query })`. */
export function validatedQuery<T>(res: Response): T {
  return res.locals.query as T;
}
