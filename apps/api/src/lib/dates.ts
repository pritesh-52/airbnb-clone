/** Date helpers operating on `YYYY-MM-DD` strings in UTC to avoid TZ drift. */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toUtcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((toUtcDate(checkOut).getTime() - toUtcDate(checkIn).getTime()) / MS_PER_DAY);
}

/** Every date from `start` (inclusive) to `end` (exclusive). */
export function eachDate(start: string, end: string): string[] {
  const dates: string[] = [];
  const cursor = toUtcDate(start);
  const stop = toUtcDate(end);

  while (cursor < stop) {
    dates.push(toIsoDate(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

/** Rounds to cents, avoiding the float dust that `0.1 + 0.2` style maths leaves. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
