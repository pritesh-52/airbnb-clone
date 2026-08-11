'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Reads a value that only exists on the client (today's date, viewport, …)
 * without risking a hydration mismatch.
 *
 * React renders `serverSnapshot` for the server pass and the first client
 * render, then swaps in the real value — so the two trees always agree.
 * `getSnapshot` must return a value that is `Object.is`-stable between calls.
 */
export function useClientValue<T>(getSnapshot: () => T, serverSnapshot: T): T {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
