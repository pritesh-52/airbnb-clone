/** Display formatting helpers. All are pure so they render identically on both sides of hydration. */

const FIXED_LOCALE = 'en-US';

/** Whole-dollar currency, matching how Airbnb shows nightly rates. */
export function formatCurrency(amount: number, currency: string, fractionDigits = 0): string {
  return new Intl.NumberFormat(FIXED_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/** Currency with cents — used in the price breakdown and total rows. */
export function formatCurrencyPrecise(amount: number, currency: string): string {
  return formatCurrency(amount, currency, 2);
}

/** `4.95` → `"4.95"`, `5` → `"5.0"`. The headline rating keeps both decimals. */
export function formatRating(rating: number): string {
  return rating.toFixed(rating % 1 === 0 ? 1 : 2);
}

/** `4.8` → `"4.8"`, `5` → `"5.0"`. Category scores are always one decimal. */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/** `2026-07-18` → `"July 2026"`, as used on review cards. */
export function formatMonthYear(isoDate: string): string {
  return new Intl.DateTimeFormat(FIXED_LOCALE, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** `2016-03-01` → `"2016"`. */
export function formatYear(isoDate: string): string {
  return isoDate.slice(0, 4);
}

/** `2026-09-10` → `"Sep 10, 2026"`. */
export function formatShortDate(isoDate: string): string {
  return new Intl.DateTimeFormat(FIXED_LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** Pluralises a count, e.g. `pluralise(1, 'guest')` → `"1 guest"`. */
export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** `3.5` → `"3.5 baths"`, `1` → `"1 bath"`. Keeps half-baths readable. */
export function formatBathrooms(count: number): string {
  const label = count === 1 ? 'bath' : 'baths';
  return `${count % 1 === 0 ? count : count.toFixed(1)} ${label}`;
}

/** Years of hosting, floored, for the host card. */
export function yearsHosting(joinedAt: string, now: Date = new Date()): number {
  const joined = new Date(`${joinedAt}T00:00:00Z`);
  const years = (now.getTime() - joined.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.max(1, Math.floor(years));
}

/** Today as `YYYY-MM-DD` in UTC. */
export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Shifts an ISO date by whole days. */
export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Nights between two ISO dates. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms =
    new Date(`${checkOut}T00:00:00Z`).getTime() - new Date(`${checkIn}T00:00:00Z`).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}
