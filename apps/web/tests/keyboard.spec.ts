import { test, expect } from '@playwright/test';
import { openLightbox, openPhotoTour } from './helpers';

/**
 * Keyboard operability: the acceptance criterion is that every interactive
 * element is reachable and operable without a pointer.
 */

test('skip link is the first tab stop and moves focus to main', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).waitFor();

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('amenities dialog traps focus and restores it on Escape', async ({ page }) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: /Show all \d+ amenities/ });
  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Focus starts on the close button inside the dialog.
  await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();

  // Tabbing repeatedly must never leave the dialog.
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab');
    const insideDialog = await dialog.evaluate((node) => node.contains(document.activeElement));
    expect(insideDialog).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('photo tour opens from the gallery and groups photos by room', async ({ page }) => {
  await page.goto('/');
  await openPhotoTour(page);

  const tour = page.getByRole('dialog', { name: 'Photo tour' });

  // Category headings are the tour's structure.
  await expect(tour.getByRole('heading', { name: 'Living room 1' })).toBeVisible();
  await expect(tour.getByText('Sofa · Air conditioning · Ceiling fan · TV')).toBeVisible();
  await expect(tour.getByRole('heading', { name: 'Living room 2' })).toBeVisible();

  // The category strip jumps to a section rather than filtering.
  await expect(tour.getByRole('navigation', { name: 'Photo categories' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(tour).toBeHidden();
});

test('lightbox navigates with arrow keys and returns to the tour', async ({ page }) => {
  await page.goto('/');
  await openLightbox(page);

  const lightbox = page.getByRole('dialog', { name: 'Photo viewer' });
  await expect(lightbox.getByText('1 / 23')).toBeVisible();

  await page.keyboard.press('ArrowRight');
  await expect(lightbox.getByText('2 / 23')).toBeVisible();

  await page.keyboard.press('ArrowLeft');
  await expect(lightbox.getByText('1 / 23')).toBeVisible();

  // Wraps backwards from the first photo to the last.
  await page.keyboard.press('ArrowLeft');
  await expect(lightbox.getByText('23 / 23')).toBeVisible();

  // Closing the lightbox leaves the tour open underneath.
  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
  await expect(page.getByRole('dialog', { name: 'Photo tour' })).toBeVisible();
});

test('booking form is operable and prices a stay from the API', async ({ page }) => {
  await page.goto('/');

  const isDesktop = await page
    .locator('aside#booking')
    .isVisible()
    .catch(() => false);

  if (!isDesktop) {
    await page.getByRole('button', { name: 'Reserve' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  }

  const scope = isDesktop ? page.locator('aside#booking') : page.getByRole('dialog');

  await scope.getByLabel('Check-in').fill('2026-11-10');
  await scope.getByLabel('Checkout').fill('2026-11-18');
  await scope.getByLabel('Guests').selectOption('2');

  // The quote comes back from POST /listings/:slug/quote.
  await expect(scope.getByText('Weekly stay discount')).toBeVisible({ timeout: 15_000 });
  await expect(scope.getByRole('button', { name: 'Reserve' })).toBeEnabled();

  await scope.getByRole('button', { name: 'Reserve' }).click();
  await expect(scope.getByText(/Reservation request sent/)).toBeVisible();
});

test('rejects an unavailable range with an inline error', async ({ page }) => {
  await page.goto('/');

  const isDesktop = await page
    .locator('aside#booking')
    .isVisible()
    .catch(() => false);

  if (!isDesktop) {
    await page.getByRole('button', { name: 'Reserve' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  }

  const scope = isDesktop ? page.locator('aside#booking') : page.getByRole('dialog');

  // 2026-12-24..26 are blocked in the seed data.
  await scope.getByLabel('Check-in').fill('2026-12-23');
  await scope.getByLabel('Checkout').fill('2026-12-27');

  await expect(scope.getByRole('alert')).toContainText('Unavailable', { timeout: 15_000 });
  await expect(scope.getByRole('button', { name: 'Check availability' })).toBeDisabled();
});
