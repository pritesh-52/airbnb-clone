import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Visual regression + comparison artefacts.
 *
 * Each breakpoint writes a full-page PNG into `screenshots/<project>/` for
 * side-by-side comparison against the reference, and additionally asserts
 * against a committed baseline so unintended drift fails CI.
 *
 * Run `npx playwright test tests/screenshots.spec.ts --update-snapshots` to
 * accept intentional visual changes.
 */

const OUTPUT_DIR = path.resolve(process.cwd(), 'screenshots');

test.beforeAll(() => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
});

test('full page matches the visual baseline', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).waitFor();

  // Settle lazy images and any entrance transitions before capturing.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const projectDir = path.join(OUTPUT_DIR, testInfo.project.name);
  fs.mkdirSync(projectDir, { recursive: true });

  await page.screenshot({
    path: path.join(projectDir, 'listing-full.png'),
    fullPage: true,
    animations: 'disabled',
  });

  await expect(page).toHaveScreenshot(`listing-${testInfo.project.name}.png`, {
    fullPage: true,
    animations: 'disabled',
  });
});

test('respects prefers-reduced-motion', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).waitFor();

  // Every transition should collapse to effectively zero duration.
  const longTransitions = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('*'))
      .map((element) => window.getComputedStyle(element).transitionDuration)
      .filter((duration) => duration.split(',').some((part) => parseFloat(part) > 0.05)),
  );

  expect(longTransitions).toEqual([]);

  const projectDir = path.join(OUTPUT_DIR, testInfo.project.name);
  fs.mkdirSync(projectDir, { recursive: true });
  await page.screenshot({ path: path.join(projectDir, 'listing-reduced-motion.png') });
});
