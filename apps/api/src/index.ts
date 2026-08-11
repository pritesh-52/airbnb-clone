import { createApp, API_PREFIX } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info('api.started', {
    port: env.PORT,
    env: env.NODE_ENV,
    prefix: API_PREFIX,
    corsOrigins: env.CORS_ORIGINS,
  });
});

/** Drain in-flight requests before exiting so deploys do not drop connections. */
function shutdown(signal: NodeJS.Signals): void {
  logger.info('api.shutdown.start', { signal });

  server.close((error) => {
    if (error) {
      logger.error('api.shutdown.failed', { message: error.message });
      process.exit(1);
    }
    logger.info('api.shutdown.complete');
    process.exit(0);
  });

  // Hard stop if sockets refuse to close.
  setTimeout(() => {
    logger.warn('api.shutdown.forced');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('unhandledRejection', (reason) => {
  logger.error('api.unhandledRejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

process.on('uncaughtException', (error) => {
  logger.error('api.uncaughtException', { message: error.message, stack: error.stack });
  process.exit(1);
});
