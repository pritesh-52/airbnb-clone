import { Router } from 'express';
import { showHealth } from '../controllers/health.controller.js';

export const healthRouter: Router = Router();

healthRouter.get('/health', showHealth);
