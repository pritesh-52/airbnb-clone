import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { listingRouter } from './listing.routes.js';

/** All routes are mounted under `/api/v1` by the app factory. */
export const apiRouter: Router = Router();

apiRouter.use(healthRouter);
apiRouter.use(listingRouter);
