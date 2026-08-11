import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openLightbox, openPhotoTour } from './helpers';

/**
 * Accessibility gate. Fails on any serious/critical axe violation, on the page
 * at rest and in each overlay — overlay content is only in the DOM while it is
 * mounted, so each has to be scanned separately.
 */

const SERIOUS = ['critical', 'serious'];

/**
 * Scans run with reduced motion emulated so transitions are already settled.
 * Mid-transition frames report blended colors that no user ever reads as static
 * text, and would otherwise make contrast results non-deterministic.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function scan(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  return results.violations.filter((violation) => SERIOUS.includes(violation.impact ?? ''));
}

function describe(violations: Awaited<ReturnType<typeof scan>>) {
  return violations
    .map((violation) => `${violation.id} (${violation.impact}): ${violation.help}`)
    .join('\n');
}

test('listing page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).waitFor();

  expect(describe(await scan(page))).toBe('');
});

test('amenities dialog has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Show all \d+ amenities/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  expect(describe(await scan(page))).toBe('');
});

test('photo tour has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await openPhotoTour(page);

  expect(describe(await scan(page))).toBe('');
});

test('lightbox has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await openLightbox(page);

  expect(describe(await scan(page))).toBe('');
});
