import { createApp } from './app.js';

/**
 * Serverless entry point.
 *
 * An Express app *is* a `(req, res)` handler, so exporting it directly is all a
 * function runtime needs — no adapter required. Crucially this never calls
 * `listen()`: serverless platforms invoke the handler per request and would
 * leak a port binding on every cold start.
 *
 * `src/index.ts` remains the entry for anything that runs a persistent process
 * (local development, containers, a VM), where `listen()` and the graceful
 * shutdown handlers are the right shape.
 */
export default createApp();
