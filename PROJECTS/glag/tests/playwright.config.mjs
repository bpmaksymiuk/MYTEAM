import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  testMatch: '**/*.spec.mjs',
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },
  outputDir: './test-results',
  reporter: [['list'], ['json', { outputFile: './results/playwright-report.json' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'npm --prefix ../build run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
