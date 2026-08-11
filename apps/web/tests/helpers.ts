import type { Page } from '@playwright/test';

/**
 * Opens the photo tour.
 *
 * "Show all photos" only exists from `md` up; below that the hero rail is the
 * entry point. Both lead to the same view, so tests use whichever the current
 * viewport actually renders.
 */
export async function openPhotoTour(page: Page): Promise<void> {
  const showAll = page.getByRole('button', { name: 'Show all photos' });

  if (await showAll.isVisible().catch(() => false)) {
    await showAll.click();
  } else {
    await page.getByRole('button', { name: 'Open the photo tour' }).first().click();
  }

  await page.getByRole('dialog', { name: 'Photo tour' }).waitFor();
}

/** Opens the lightbox on the first photo of the tour. */
export async function openLightbox(page: Page): Promise<void> {
  await openPhotoTour(page);
  await page.getByRole('button', { name: 'Open this photo full screen' }).first().click();
  await page.getByRole('dialog', { name: 'Photo viewer' }).waitFor();
}
