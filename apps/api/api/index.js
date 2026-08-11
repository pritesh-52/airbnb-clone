/**
 * Vercel serverless function entry.
 *
 * Re-exports the compiled Express app from `dist/`, so no TypeScript is
 * compiled by the platform's own pipeline — that second compile is what
 * resolved helmet with classic Node resolution and failed the build.
 *
 * `npm run build` must run before the functions are bundled; the root
 * `buildCommand` in vercel.json takes care of that.
 */
export { default } from '../dist/serverless.js';
