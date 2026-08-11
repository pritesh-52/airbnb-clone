import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http-error.js';

/** Terminal route: anything unmatched becomes a structured 404. */
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(HttpError.notFound(`No route matches ${req.method} ${req.originalUrl}`));
}
