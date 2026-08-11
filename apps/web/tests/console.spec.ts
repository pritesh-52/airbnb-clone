import { test, expect } from '@playwright/test';

/**
 * Guards the "no console errors or hydration warnings" acceptance criterion.
 * React reports hydration mismatches as console errors, so both are covered by
 * the same assertion.
 */
test('renders without console errors or hydration warnings', async ({ page }) => {
  const problems: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`[${message.type()}] ${message.text()}`);
    }
  });

  page.on('pageerror', (error) => problems.push(`[pageerror] ${error.message}`));

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).waitFor();

  // Exercise the interactive surfaces that mount portals and fetch data.
  await page.getByRole('button', { name: /Show all \d+ amenities/ }).click();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: /Show all \d+ reviews/ }).click();
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape');

  const hydration = problems.filter((problem) =>
    /hydrat|did not match|Text content/i.test(problem),
  );

  expect(hydration.join('\n')).toBe('');
  expect(problems.join('\n')).toBe('');
});
