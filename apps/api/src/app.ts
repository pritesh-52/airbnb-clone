import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

export const API_PREFIX = '/api/v1';

/**
 * Builds the Express app without binding a port, so tests can drive it
 * in-process via `supertest`-style injection.
 *
 * Middleware order matters: request id first (everything downstream logs it),
 * then security/parsing, then routes, then the 404 and error terminals last.
 */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(requestId);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'X-Request-Id'],
      exposedHeaders: ['X-Request-Id'],
      maxAge: 86_400,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  app.use(requestLogger);

  app.use(API_PREFIX, apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
