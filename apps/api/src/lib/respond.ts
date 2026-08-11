import type { Response } from 'express';
import type { ApiSuccess } from '@airbnb-clone/types';

/**
 * Single place that writes the success envelope, so no controller can
 * accidentally return a bare payload.
 */
export function ok<TData, TMeta = undefined>(
  res: Response,
  data: TData,
  meta?: TMeta,
  status = 200,
): void {
  const body: ApiSuccess<TData, TMeta> = meta === undefined ? { data } : { data, meta };
  res.status(status).json(body);
}
