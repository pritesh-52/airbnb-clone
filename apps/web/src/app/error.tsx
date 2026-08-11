'use client';

import { useEffect } from 'react';

/**
 * Route-level error boundary. The most likely failure in development is the API
 * not running, so the copy points at that first.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl">We couldn&rsquo;t load this listing</h1>

      <p className="mt-4 text-base text-ink-muted">
        The page could not reach the API. If you are running locally, start it with{' '}
        <code className="rounded bg-surface-muted px-1.5 py-0.5 text-sm">npm run dev</code> from the
        repository root, which boots both apps together.
      </p>

      <p className="mt-4 text-sm text-ink-subtle">{error.message}</p>

      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg border border-ink px-6 py-3 text-base font-semibold transition-colors duration-200 hover:bg-surface-muted"
      >
        Try again
      </button>
    </main>
  );
}
