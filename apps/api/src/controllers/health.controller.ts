import type { Request, Response } from 'express';
import type { HealthResponse } from '@airbnb-clone/types';
import { ok } from '../lib/respond.js';

const VERSION = process.env.npm_package_version ?? '1.0.0';

/** Liveness probe. Intentionally dependency-free so it stays green under load. */
export function showHealth(_req: Request, res: Response): void {
  const payload: HealthResponse = {
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: VERSION,
  };

  ok(res, payload);
}
