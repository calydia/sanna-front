import { defineConfig, devices } from '@playwright/test';

const mockApiUrl = 'http://127.0.0.1:4010';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate: '{testDir}/../__screenshots__/{testFilePath}/{projectName}/{arg}{ext}',
  use: {
    baseURL: 'http://127.0.0.1:4322',
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'Europe/Helsinki',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node tests/mock-server.mjs',
      url: `${mockApiUrl}/health`,
      reuseExistingServer: false,
      timeout: 10_000,
    },
    {
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4322',
      env: {
        ...process.env,
        BLOG_API_URL: `${mockApiUrl}/graphql`,
      },
      url: 'http://127.0.0.1:4322/',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: 'mobile-chromium',
      testIgnore: /accessibility\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
