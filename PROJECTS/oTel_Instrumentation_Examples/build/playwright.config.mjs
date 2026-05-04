import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  use: {
    headless: true,
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'npx @11ty/eleventy --serve --port=8080',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 30000,
  },
  reporter: 'list',
});
