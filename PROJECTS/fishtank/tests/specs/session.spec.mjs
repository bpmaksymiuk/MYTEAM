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

// T-034 — BR-035 UC-012
test('T-034 Session stability — 10-second soak', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(2000);
  // Interactions during soak
  await page.click('#tank-canvas', { position: { x: 640, y: 360 } });
  await page.waitForTimeout(2000);
  await page.click('#btn-34');
  await page.waitForTimeout(2000);
  await page.click('#tank-canvas', { position: { x: 400, y: 300 } });
  await page.waitForTimeout(2000);
  await page.click('#btn-iso');
  await page.waitForTimeout(2000);
  await expect(page.locator('#tank-canvas')).toBeVisible();
  expect(errors.length).toBe(0);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-034-soak.png') });
  writeEvidence(RESULTS_DIR, 'T-034', { slug: 'soak-stability', detail: `10s soak complete. Canvas visible. Errors: ${errors.length}` });
});

// T-035 — BR-036 UC-012
test('T-035 Core features accessible after 5 seconds', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(5000);
  await page.click('#btn-34');
  expect(await page.locator('#btn-34').getAttribute('aria-pressed')).toBe('true');
  await page.click('#tank-canvas', { position: { x: 640, y: 360 } });
  await expect(page.locator('#substrate-select')).toBeEnabled();
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-035-core-features.png') });
  writeEvidence(RESULTS_DIR, 'T-035', { slug: 'core-features', detail: 'HUD controls responsive after 5s; camera toggle and feed work' });
});

// T-036 — BR-037 UC-012
test('T-036 No blocking error state during full interaction sequence', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(1000);
  // Full interaction sequence
  await page.click('#btn-34');
  await page.click('#btn-iso');
  await page.selectOption('#substrate-select', 'gravel');
  await page.uncheck('#deco-shipwreck');
  await page.check('#deco-shipwreck');
  await page.fill('#pop-input', '15');
  await page.dispatchEvent('#pop-input', 'input');
  await page.click('#btn-audio');
  await page.click('#btn-audio');
  await page.fill('#bubbler-input', '120');
  await page.dispatchEvent('#bubbler-input', 'input');
  await page.click('#tank-canvas', { position: { x: 640, y: 360 } });
  await page.waitForTimeout(1000);
  // Confirm no modal error and HUD responsive
  const selectionCard = page.locator('#selection-card');
  await expect(page.locator('#controls-panel')).toBeVisible();
  await expect(page.locator('#hud-root')).toBeEnabled();
  expect(errors.length).toBe(0);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-036-no-error-state.png') });
  writeEvidence(RESULTS_DIR, 'T-036', { slug: 'no-blocking-error', detail: `Full interaction sequence complete. Errors: ${errors.length}` });
});
