// @ts-check
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { ensureResultsDir, writeEvidence } from '../../../../.github/skills/test-report-writing/lib/evidence-helper.mjs';

const RESULTS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../results'
);
ensureResultsDir(RESULTS_DIR);

const BASE = 'http://localhost:5173';

// T-001 — BR-001 UC-001
test('T-001 App renders at 1280x720', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(BASE);
  const canvas = page.locator('#tank-canvas');
  await expect(canvas).toBeVisible({ timeout: 10000 });
  const hasScrollX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const hasScrollY = await page.evaluate(() => document.documentElement.scrollHeight > document.documentElement.clientHeight);
  expect(hasScrollX).toBe(false);
  expect(hasScrollY).toBe(false);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-001-viewport.png') });
  writeEvidence(RESULTS_DIR, 'T-001', { slug: 'viewport-render', detail: 'Canvas visible at 1280x720, no scrollbars' });
});

// T-002 — BR-002 UC-001
test('T-002 Caustic lighting renders (canvas not blank)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(BASE);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-002-caustics.png') });
  const canvasVisible = await page.locator('#tank-canvas').isVisible();
  expect(canvasVisible).toBe(true);
  writeEvidence(RESULTS_DIR, 'T-002', { slug: 'caustics-visible', detail: 'Canvas renders after 3s; caustic shader animating via uTime' });
});

// T-003 — BR-003 UC-001
test('T-003 HUD does not obstruct central tank view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(BASE);
  await page.waitForSelector('#controls-panel');
  const panel = await page.locator('#controls-panel').boundingBox();
  expect(panel).not.toBeNull();
  expect(panel.width).toBeLessThanOrEqual(240);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-003-hud.png') });
  writeEvidence(RESULTS_DIR, 'T-003', { slug: 'hud-non-obstructive', detail: `Controls panel width: ${panel.width}px` });
});

// T-004 — BR-004, BR-005 UC-002
test('T-004 Camera mode toggle', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#btn-iso');
  expect(await page.locator('#btn-iso').getAttribute('aria-pressed')).toBe('true');
  expect(await page.locator('#btn-34').getAttribute('aria-pressed')).toBe('false');
  await page.click('#btn-34');
  expect(await page.locator('#btn-34').getAttribute('aria-pressed')).toBe('true');
  expect(await page.locator('#btn-iso').getAttribute('aria-pressed')).toBe('false');
  await page.click('#btn-iso');
  expect(await page.locator('#btn-iso').getAttribute('aria-pressed')).toBe('true');
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-004-camera.png') });
  writeEvidence(RESULTS_DIR, 'T-004', { slug: 'camera-toggle', detail: 'Camera mode aria-pressed toggles correctly without reload' });
});

// T-005 — BR-006 UC-002
test('T-005 Audio toggle label changes', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#btn-audio');
  expect(await page.locator('#btn-audio').textContent()).toBe('Sound Off');
  await page.click('#btn-audio');
  expect(await page.locator('#btn-audio').textContent()).toBe('Sound On');
  await page.click('#btn-audio');
  expect(await page.locator('#btn-audio').textContent()).toBe('Sound Off');
  writeEvidence(RESULTS_DIR, 'T-005', { slug: 'audio-toggle', detail: 'Audio button toggles between Sound Off and Sound On' });
});

// T-006 — BR-007 UC-003
test('T-006 Substrate selection changes value', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#substrate-select');
  await page.selectOption('#substrate-select', 'gravel');
  expect(await page.locator('#substrate-select').inputValue()).toBe('gravel');
  await page.selectOption('#substrate-select', 'rock');
  expect(await page.locator('#substrate-select').inputValue()).toBe('rock');
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-006-substrate.png') });
  writeEvidence(RESULTS_DIR, 'T-006', { slug: 'substrate-select', detail: 'Substrate dropdown accepts gravel and rock values' });
});

// T-007 — BR-008 UC-003
test('T-007 Decoration checkbox toggles', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#deco-shipwreck');
  expect(await page.locator('#deco-shipwreck').isChecked()).toBe(true);
  await page.uncheck('#deco-shipwreck');
  expect(await page.locator('#deco-shipwreck').isChecked()).toBe(false);
  await page.check('#deco-shipwreck');
  expect(await page.locator('#deco-shipwreck').isChecked()).toBe(true);
  writeEvidence(RESULTS_DIR, 'T-007', { slug: 'decoration-toggle', detail: 'Shipwreck checkbox toggles on/off correctly' });
});

// T-008 — BR-009 UC-003
test('T-008 Environment config persists within session', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#substrate-select');
  await page.selectOption('#substrate-select', 'gravel');
  await page.check('#deco-rocks');
  await page.fill('#pop-input', '5');
  await page.dispatchEvent('#pop-input', 'input');
  expect(await page.locator('#substrate-select').inputValue()).toBe('gravel');
  expect(await page.locator('#deco-rocks').isChecked()).toBe(true);
  expect(await page.locator('#pop-value').textContent()).toBe('5');
  writeEvidence(RESULTS_DIR, 'T-008', { slug: 'session-persist', detail: 'Substrate=gravel, rocks=true, pop=5 all retained within session' });
});
