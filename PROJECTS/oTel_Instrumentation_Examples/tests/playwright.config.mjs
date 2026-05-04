import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  outputDir: './test-results',
  timeout: 60_000,
  reporter: [['list'], ['json', { outputFile: './results/playwright-report.json' }]],
  use: {
    baseURL: 'http://localhost:8080',
    headless: false,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm --prefix ../build run dev',
    url: 'http://localhost:8080',
    timeout: 120_000,
    reuseExistingServer: true
  }
});
