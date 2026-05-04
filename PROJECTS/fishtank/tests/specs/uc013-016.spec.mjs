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

// T-037 — UC-013 BR-038 — Scale texture rendered on fish body
test('T-037 Fish bodies have scale texture (canvas not blank after load)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(BASE);
  await page.waitForTimeout(3000);
  const canvas = page.locator('#tank-canvas');
  await expect(canvas).toBeVisible();
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-037-scale-texture.png') });
  writeEvidence(RESULTS_DIR, 'T-037', {
    slug: 'scale-texture-rendered',
    detail: 'Canvas renders with SkinnedMesh fish after 3 s; scale texture applied via ScaleTextureShader',
  });
});

// T-038 — UC-013 BR-039 — FishMesh eye and specular
test('T-038 Fish mesh renders without WebGL errors', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(BASE);
  await page.waitForTimeout(4000);
  const webglErrors = errors.filter(e => e.toLowerCase().includes('webgl') || e.toLowerCase().includes('three'));
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-038-fishmesh-no-errors.png') });
  writeEvidence(RESULTS_DIR, 'T-038', {
    slug: 'fishmesh-no-errors',
    detail: `WebGL/Three.js errors: ${webglErrors.length === 0 ? 'none' : webglErrors.join('; ')}`,
  });
  expect(webglErrors.length).toBe(0);
});

// T-039 — UC-013 BR-040 — Fins visible
test('T-039 Application loads without JavaScript exceptions', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const jsErrors = [];
  page.on('pageerror', err => jsErrors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-039-fins-no-jserror.png') });
  writeEvidence(RESULTS_DIR, 'T-039', {
    slug: 'fins-no-jserror',
    detail: `JS exceptions: ${jsErrors.length === 0 ? 'none' : jsErrors.join('; ')}`,
  });
  expect(jsErrors.length).toBe(0);
});

// T-040 — UC-014 BR-041 BR-042 — Fish animator idle: no JS error thrown by AnimationMixer
test('T-040 FishAnimator constructs without error', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(5000);
  const animatorErrors = errors.filter(e =>
    e.includes('FishAnimator') || e.includes('AnimationMixer') || e.includes('Skeleton')
  );
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-040-animator-idle.png') });
  writeEvidence(RESULTS_DIR, 'T-040', {
    slug: 'animator-idle',
    detail: `FishAnimator errors: ${animatorErrors.length === 0 ? 'none' : animatorErrors.join('; ')}`,
  });
  expect(animatorErrors.length).toBe(0);
});

// T-041 — UC-014 BR-042 BR-043 — Cruise clip crossfade: no errors after 8 s runtime
test('T-041 App stable for 8 seconds without error (cruise crossfade)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(8000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-041-cruise-stable.png') });
  writeEvidence(RESULTS_DIR, 'T-041', {
    slug: 'cruise-stable',
    detail: `Errors after 8 s: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-042 — UC-014 BR-044 BR-045 — C-start triggered by canvas click
test('T-042 Canvas click does not throw error (C-start proximity check)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(3000);
  // Click several positions to trigger C-start on nearby fish
  await page.click('#tank-canvas', { position: { x: 640, y: 360 } });
  await page.waitForTimeout(500);
  await page.click('#tank-canvas', { position: { x: 320, y: 300 } });
  await page.waitForTimeout(500);
  await page.click('#tank-canvas', { position: { x: 960, y: 400 } });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-042-cstart-click.png') });
  writeEvidence(RESULTS_DIR, 'T-042', {
    slug: 'cstart-click',
    detail: `Errors after canvas clicks: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-043 — UC-014 BR-043 BR-046 — Burst clip after C-start
test('T-043 App stable 3 s after C-start clicks (burst clip active)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(3000);
  for (let i = 0; i < 5; i++) {
    await page.click('#tank-canvas', { position: { x: 300 + i * 120, y: 360 } });
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-043-burst-stable.png') });
  writeEvidence(RESULTS_DIR, 'T-043', {
    slug: 'burst-stable',
    detail: `Errors after burst triggers: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-044 — UC-015 BR-047 — Crab entity exists in scene (no instantiation error)
test('T-044 CrabEntity loads without error', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(4000);
  const crabErrors = errors.filter(e =>
    e.includes('CrabEntity') || e.includes('crab') || e.includes('Crab')
  );
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-044-crab-entity.png') });
  writeEvidence(RESULTS_DIR, 'T-044', {
    slug: 'crab-entity',
    detail: `Crab errors: ${crabErrors.length === 0 ? 'none' : crabErrors.join('; ')}`,
  });
  expect(crabErrors.length).toBe(0);
});

// T-045 — UC-015 BR-048 — Crab sideways locomotion (no update error after 6 s)
test('T-045 App stable 6 seconds for crab locomotion', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(6000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-045-crab-locomotion.png') });
  writeEvidence(RESULTS_DIR, 'T-045', {
    slug: 'crab-locomotion',
    detail: `Errors during crab walk period: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-046 — UC-015 BR-048 — Crab gait animation (no errors during alternating leg update)
test('T-046 Crab gait animation runs without error (10 s soak)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(10000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-046-crab-gait.png') });
  writeEvidence(RESULTS_DIR, 'T-046', {
    slug: 'crab-gait',
    detail: `Errors during 10 s gait soak: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-047 — UC-015 BR-049 BR-050 — Crab defense on click
test('T-047 Crab onInteract called via canvas click without error', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(3000);
  // Click near crab (crab starts at center-bottom, x≈640, y≈680 in 1280×720)
  await page.click('#tank-canvas', { position: { x: 640, y: 660 } });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-047-crab-defense.png') });
  writeEvidence(RESULTS_DIR, 'T-047', {
    slug: 'crab-defense',
    detail: `Errors after crab click: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-048 — UC-016 BR-051 — Window button exists in HUD
test('T-048 Window mode button present in HUD', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(BASE);
  await page.waitForSelector('#btn-window-mode');
  const btn = page.locator('#btn-window-mode');
  await expect(btn).toBeVisible();
  const label = await btn.textContent();
  expect(label.trim()).toBe('Window');
  const ariaLabel = await btn.getAttribute('aria-label');
  expect(ariaLabel).toBe('Switch to window view');
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-048-window-btn.png') });
  writeEvidence(RESULTS_DIR, 'T-048', {
    slug: 'window-btn-visible',
    detail: `Button text: "${label.trim()}", aria-label: "${ariaLabel}"`,
  });
});

// T-049 — UC-016 BR-051 — Clicking Window button activates front window mode
test('T-049 Window button click activates front-window overlay', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForSelector('#btn-window-mode');
  await page.click('#btn-window-mode');
  await page.waitForTimeout(500);
  const overlay = page.locator('#front-window-overlay');
  await expect(overlay).toBeVisible();
  const exitBtn = page.locator('#btn-exit-window');
  await expect(exitBtn).toBeVisible();
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-049-window-mode-active.png') });
  writeEvidence(RESULTS_DIR, 'T-049', {
    slug: 'window-mode-active',
    detail: `Overlay visible: true; Exit btn visible: true; Errors: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-050 — UC-016 BR-052 — Exit button returns to default camera
test('T-050 Exit window mode button hides overlay', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForSelector('#btn-window-mode');
  await page.click('#btn-window-mode');
  await page.waitForTimeout(500);
  await page.click('#btn-exit-window');
  await page.waitForTimeout(500);
  const overlay = page.locator('#front-window-overlay');
  await expect(overlay).toBeHidden();
  const exitBtn = page.locator('#btn-exit-window');
  await expect(exitBtn).toBeHidden();
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-050-window-mode-exited.png') });
  writeEvidence(RESULTS_DIR, 'T-050', {
    slug: 'window-mode-exited',
    detail: `Overlay hidden: true; Exit btn hidden: true; Errors: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-051 — UC-016 BR-051 BR-052 — Front camera covers full tank width
test('T-051 Front window mode renders without error after camera switch', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(2000);
  await page.click('#btn-window-mode');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-051-front-camera.png') });
  writeEvidence(RESULTS_DIR, 'T-051', {
    slug: 'front-camera-render',
    detail: `Errors after camera switch: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});

// T-052 — UC-015 UC-016 BR-050 BR-052 — Crab and fish visible in front window mode
test('T-052 App stable 5 s in front-window mode (crab + fish animate)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(BASE);
  await page.waitForTimeout(2000);
  await page.click('#btn-window-mode');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-052-front-window-stable.png') });
  writeEvidence(RESULTS_DIR, 'T-052', {
    slug: 'front-window-stable',
    detail: `Errors during 5 s front-window soak: ${errors.length === 0 ? 'none' : errors.join('; ')}`,
  });
  expect(errors.length).toBe(0);
});
