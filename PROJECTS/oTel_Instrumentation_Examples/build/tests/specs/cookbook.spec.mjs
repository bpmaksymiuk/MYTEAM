import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8080';

const TOPICS = [
  { slug: 'quickstart',                title: 'Quickstart' },
  { slug: 'traces',                    title: 'Traces' },
  { slug: 'metrics',                   title: 'Metrics' },
  { slug: 'logs',                      title: 'Logs' },
  { slug: 'auto',                      title: 'Auto-instrumentation' },
  { slug: 'resource-attributes',       title: 'Resource Attributes' },
  { slug: 'sampling',                  title: 'Sampling' },
  { slug: 'semantic-conventions-http', title: 'Semantic Conventions (HTTP)' },
  { slug: 'batching',                  title: 'Batching' },
  { slug: 'troubleshooting',           title: 'Troubleshooting' },
];

// TC-001: Home page topic hub grid
test('TC-001: home page has 10 topic cards', async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle(/Performance Architecture OTel Cookbook/);
  const cards = page.locator('.topic-card');
  await expect(cards).toHaveCount(10);
  for (const topic of TOPICS) {
    const card = page.locator(`.topic-card[href="/${topic.slug}/"]`);
    await expect(card).toBeVisible();
  }
});

// TC-002: Sidebar navigation
test('TC-002: sidebar lists 10 topics and marks active page', async ({ page }) => {
  await page.goto(`${BASE}/quickstart/`);
  const navLinks = page.locator('.nav-topics li a');
  await expect(navLinks).toHaveCount(10);
  const activeLink = page.locator('.nav-topics li a[aria-current="page"]');
  await expect(activeLink).toHaveText('Quickstart');
  await page.locator('.nav-topics li a', { hasText: 'Traces' }).click();
  await expect(page).toHaveURL(`${BASE}/traces/`);
});

// TC-003: Language tabs render and toggle
test('TC-003: language tabs render and toggle panels', async ({ page }) => {
  await page.goto(`${BASE}/quickstart/`);
  const tabList = page.locator('.tab-list').first();
  await expect(tabList).toBeVisible();
  const tabs = tabList.locator('.tab-btn');
  await expect(tabs).toHaveCount(4);
  // Default: JS selected
  const jsTab = tabList.locator('.tab-btn', { hasText: 'JavaScript' });
  await expect(jsTab).toHaveAttribute('aria-selected', 'true');
  // JS panel visible
  const jsPanel = page.locator('.tab-panel[data-lang="js"]').first();
  await expect(jsPanel).not.toBeHidden();
  // Python panel hidden by default
  const pyPanel = page.locator('.tab-panel[data-lang="py"]').first();
  await expect(pyPanel).toBeHidden();
  // Click Python
  const pyTab = tabList.locator('.tab-btn', { hasText: 'Python' });
  await pyTab.click();
  await expect(pyTab).toHaveAttribute('aria-selected', 'true');
  await expect(pyPanel).not.toBeHidden();
  await expect(jsPanel).toBeHidden();
});

// TC-004: Tab language persists across pages
test('TC-004: selected language persists across navigation', async ({ page }) => {
  await page.goto(`${BASE}/quickstart/`);
  const dotnetTab = page.locator('.tab-list .tab-btn', { hasText: '.NET' }).first();
  await dotnetTab.click();
  await expect(dotnetTab).toHaveAttribute('aria-selected', 'true');
  await page.goto(`${BASE}/traces/`);
  const dotnetTabTraces = page.locator('.tab-list .tab-btn', { hasText: '.NET' }).first();
  await expect(dotnetTabTraces).toHaveAttribute('aria-selected', 'true');
});

// TC-005: Config panel preset labels
test('TC-005: config panel has correct preset labels', async ({ page }) => {
  await page.goto(`${BASE}/quickstart/`);
  await page.locator('button.cfg-gear').click();
  const modal = page.locator('#cfg-modal');
  await expect(modal).toBeVisible();
  await expect(modal.locator('input[value="direct"]')).toBeChecked();
  await expect(modal.locator('[data-preset="direct"] strong')).toContainText('Direct OTLP');
  await expect(modal.locator('[data-preset="dynatrace"] strong')).toContainText('Dynatrace');
  await expect(modal.locator('[data-preset="collector"] strong')).toContainText('OTel Collector');
  // Endpoint field visible for direct preset
  const endpointField = modal.locator('[data-show-when-preset~="direct"]');
  await expect(endpointField).toBeVisible();
  // Switch to Dynatrace
  await modal.locator('input[value="dynatrace"]').check();
  await expect(endpointField).toBeHidden();
  await expect(modal.locator('[data-show-when-preset="dynatrace"]').first()).toBeVisible();
  // Switch to collector
  await modal.locator('input[value="collector"]').check();
  await expect(endpointField).toBeVisible();
});

// TC-006: No-JS fallback (all panels visible)
test('TC-006: no-JS fallback shows all panels', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/quickstart/`);
  const panels = page.locator('.tab-panel');
  const count = await panels.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(panels.nth(i)).toBeVisible();
  }
  await expect(page.locator('.tab-list')).toHaveCount(0);
  await ctx.close();
});

// TC-008: All 10 topic pages load without error
test('TC-008: all 10 topic pages load with correct h1', async ({ page }) => {
  for (const topic of TOPICS) {
    await page.goto(`${BASE}/${topic.slug}/`);
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText(topic.title.split('(')[0].trim());
  }
});

// TC-009: Collector preset labelled optional
test('TC-009: collector preset card contains "optional"', async ({ page }) => {
  await page.goto(`${BASE}/quickstart/`);
  await page.locator('button.cfg-gear').click();
  const collectorCard = page.locator('[data-preset="collector"]');
  await expect(collectorCard).toContainText('optional');
});

// TC-010: Release notes page loads
test('TC-010: release notes page loads', async ({ page }) => {
  await page.goto(`${BASE}/release-notes/`);
  await expect(page.locator('h1').first()).toBeVisible();
});
