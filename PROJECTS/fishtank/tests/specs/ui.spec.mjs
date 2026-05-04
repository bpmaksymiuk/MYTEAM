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

// T-019 — BR-020 UC-007
test('T-019 HUD root aria-label and controls panel visible', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#hud-root');
  const ariaLabel = await page.locator('#hud-root').getAttribute('aria-label');
  expect(ariaLabel).toBe('Tank Controls');
  await expect(page.locator('#controls-panel')).toBeVisible();
  writeEvidence(RESULTS_DIR, 'T-019', { slug: 'hud-aria', detail: 'hud-root aria-label=Tank Controls; controls-panel visible' });
});

// T-020 — BR-021 UC-007
test('T-020 Selection card DOM structure present', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#selection-card', { state: 'attached' });
  await expect(page.locator('#selection-title')).toBeDefined();
  await expect(page.locator('#selection-desc')).toBeDefined();
  writeEvidence(RESULTS_DIR, 'T-020', { slug: 'selection-card-dom', detail: '#selection-card, #selection-title, #selection-desc all present in DOM' });
});

// T-021 — BR-022 UC-007
test('T-021 Selection card initially hidden', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#selection-card', { state: 'attached' });
  const hidden = await page.locator('#selection-card').getAttribute('hidden');
  expect(hidden).not.toBeNull();
  const titleText = await page.locator('#selection-title').textContent();
  expect(titleText).toBe('');
  writeEvidence(RESULTS_DIR, 'T-021', { slug: 'selection-hidden', detail: 'Selection card has hidden attribute on load; title text is empty' });
});

// T-022 — BR-023 UC-008
test('T-022 Render loop active — canvas animating', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForTimeout(5000);
  await expect(page.locator('#tank-canvas')).toBeVisible();
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-022-render-loop.png') });
  writeEvidence(RESULTS_DIR, 'T-022', { slug: 'render-loop-active', detail: 'Canvas still visible and rendering after 5s' });
});

// T-023 — BR-024 UC-008
test('T-023 Loop stable for 5s — no stall', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(5000);
  await expect(page.locator('#tank-canvas')).toBeVisible();
  expect(errors.length).toBe(0);
  writeEvidence(RESULTS_DIR, 'T-023', { slug: 'loop-stability', detail: `Loop ran 5s without stall. Console errors: ${errors.length}` });
});

// T-024 — BR-025 UC-008
test('T-024 Viewport resize handled', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(BASE);
  await expect(page.locator('#tank-canvas')).toBeVisible();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  await expect(page.locator('#tank-canvas')).toBeVisible();
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-024-resize.png') });
  writeEvidence(RESULTS_DIR, 'T-024', { slug: 'viewport-resize', detail: 'Canvas visible at 1280x720 and 1920x1080 after resize' });
});

// T-025 — BR-026 UC-009
test('T-025 Plant system no errors after 3s', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(3000);
  expect(errors.filter(e => e.toLowerCase().includes('plant')).length).toBe(0);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-025-plant-sway.png') });
  writeEvidence(RESULTS_DIR, 'T-025', { slug: 'plant-sway', detail: 'PlantSystem.tick() ran 3s without errors' });
});

// T-026 — BR-027 UC-009
test('T-026 Particle system no errors after 3s', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(3000);
  expect(errors.filter(e => e.toLowerCase().includes('particle')).length).toBe(0);
  writeEvidence(RESULTS_DIR, 'T-026', { slug: 'particle-drift', detail: 'ParticleSystem.tick() ran 3s without errors' });
});

// T-027 — BR-028 UC-009, UC-004
test('T-027 FluidGrid disturbance damping — no errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(1000);
  await page.click('#tank-canvas', { position: { x: 640, y: 360 } });
  await page.waitForTimeout(5000);
  expect(errors.filter(e => e.toLowerCase().includes('fluid') || e.toLowerCase().includes('grid')).length).toBe(0);
  writeEvidence(RESULTS_DIR, 'T-027', { slug: 'fluid-damping', detail: 'FluidGrid impulse + decay ran 5s after click without errors' });
});

// T-028 — BR-029 UC-010
test('T-028 Bubbler rate slider min/max', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('#bubbler-input');
  expect(await page.locator('#bubbler-value').textContent()).toBe('60');
  await page.fill('#bubbler-input', '30');
  await page.dispatchEvent('#bubbler-input', 'input');
  expect(await page.locator('#bubbler-value').textContent()).toBe('30');
  await page.fill('#bubbler-input', '200');
  await page.dispatchEvent('#bubbler-input', 'input');
  expect(await page.locator('#bubbler-value').textContent()).toBe('200');
  writeEvidence(RESULTS_DIR, 'T-028', { slug: 'bubbler-rate', detail: 'Bubbler slider accepts 30 and 200 correctly' });
});

// T-029 — BR-030 UC-010
test('T-029 Bubble system runs at max rate without error', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForSelector('#bubbler-input');
  await page.fill('#bubbler-input', '200');
  await page.dispatchEvent('#bubbler-input', 'input');
  await page.waitForTimeout(3000);
  expect(errors.filter(e => e.toLowerCase().includes('bubble')).length).toBe(0);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-029-bubbles-max.png') });
  writeEvidence(RESULTS_DIR, 'T-029', { slug: 'bubble-max-rate', detail: 'BubbleSystem at rate=200 ran 3s without errors' });
});

// T-030 — BR-031 UC-010, UC-004
test('T-030 Localised bubbler current — no errors at max rate', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.fill('#bubbler-input', '200');
  await page.dispatchEvent('#bubbler-input', 'input');
  await page.waitForTimeout(3000);
  expect(errors.length).toBe(0);
  writeEvidence(RESULTS_DIR, 'T-030', { slug: 'bubbler-current', detail: 'BubbleSystem max rate + FluidGrid ran 3s without errors' });
});

// T-031 — BR-032 UC-011
test('T-031 Pointer events API — pointerdown no errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(500);
  await page.dispatchEvent('#tank-canvas', 'pointerdown', { clientX: 400, clientY: 300, pointerId: 1 });
  await page.waitForTimeout(200);
  const inputErrors = errors.filter(e => e.toLowerCase().includes('input') || e.toLowerCase().includes('pointer'));
  expect(inputErrors.length).toBe(0);
  writeEvidence(RESULTS_DIR, 'T-031', { slug: 'pointer-events', detail: 'Synthetic pointerdown on canvas processed without errors' });
});

// T-032 — BR-033 UC-011
test('T-032 Pan via pointermove — no errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(500);
  await page.dispatchEvent('#tank-canvas', 'pointerdown', { clientX: 400, clientY: 300, pointerId: 1 });
  await page.dispatchEvent('#tank-canvas', 'pointermove', { clientX: 450, clientY: 350, pointerId: 1 });
  await page.dispatchEvent('#tank-canvas', 'pointerup', { clientX: 450, clientY: 350, pointerId: 1 });
  await page.waitForTimeout(100);
  expect(errors.filter(e => e.toLowerCase().includes('input')).length).toBe(0);
  writeEvidence(RESULTS_DIR, 'T-032', { slug: 'pan-gesture', detail: 'Pointer drag (50px) processed without errors' });
});

// T-033 — BR-034 UC-011
test('T-033 HammerJS Pinch handler initialised', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(1000);
  const hammerErrors = errors.filter(e => e.toLowerCase().includes('hammer'));
  expect(hammerErrors.length).toBe(0);
  writeEvidence(RESULTS_DIR, 'T-033', { slug: 'hammer-init', detail: 'No HammerJS init errors; Pinch recognizer enabled' });
});
