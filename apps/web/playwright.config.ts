import { defineConfig, devices } from '@playwright/test';

const WEB_PORT = Number(process.env.PLAYWRIGHT_WEB_PORT ?? 3000);
const API_PORT = Number(process.env.PLAYWRIGHT_API_PORT ?? 4000);
const BASE_URL = `http://127.0.0.1:${WEB_PORT}`;

/**
 * Boots the API and the web app together, then runs the suites against them.
 *
 * The three projects mirror the breakpoints the clone is specified at, so the
 * screenshot suite produces one baseline per breakpoint without duplicating any
 * test code.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Image decoding differs slightly across platforms; this tolerance keeps
      // the baselines stable without hiding real layout regressions.
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1112 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: false },
    },
  ],

  webServer: [
    {
      command: 'npm run start --workspace=@airbnb-clone/api',
      cwd: '../..',
      port: API_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: { PORT: String(API_PORT), NODE_ENV: 'production', CORS_ORIGINS: BASE_URL },
    },
    {
      command: `npm run start --workspace=@airbnb-clone/web -- --port ${WEB_PORT}`,
      cwd: '../..',
      port: WEB_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        API_URL: `http://127.0.0.1:${API_PORT}/api/v1`,
        NEXT_PUBLIC_API_URL: `http://127.0.0.1:${API_PORT}/api/v1`,
      },
    },
  ],
});
