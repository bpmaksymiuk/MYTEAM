// cs_test_pipeline001.mjs — DI-010
// Playwright automated tests for ElectroFlow ChargeSimulator.
// Run: DISPLAY=:0 node cs_test_pipeline001.mjs

import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import { spawn }    from 'child_process';
import fs           from 'fs';
import path         from 'path';

const PORT       = 7410;
const BASE_URL   = `http://localhost:${PORT}`;
const RESULTS_DIR = path.join('testresults', 'T-PIPELINE-CS-001');
const BUILD_DIR  = path.resolve('./build');

fs.mkdirSync(RESULTS_DIR, { recursive: true });

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', BUILD_DIR], {
  stdio: 'ignore',
  detached: true,
});
server.unref();
await new Promise(r => setTimeout(r, 1200));

// ── Test harness ──────────────────────────────────────────────────────────────
const results = [];
let   page, browser;

async function t(id, desc, fn) {
  const entry = { id, desc, result: 'FAIL', error: null };
  try {
    await fn();
    entry.result = 'PASS';
    console.log(`  ✅ ${id}: ${desc}`);
  } catch (err) {
    entry.error = err.message;
    console.error(`  ❌ ${id}: ${desc}\n     ${err.message}`);
  }
  try {
    await page.screenshot({ path: path.join(RESULTS_DIR, `${id}.png`) });
  } catch (_) {}
  results.push(entry);
}

// ── Main ──────────────────────────────────────────────────────────────────────
browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
page    = await context.newPage();

console.log('\n=== T-PIPELINE-CS-001  ElectroFlow ===\n');

await t('T01', 'Canvas renders on page load', async () => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#sim-canvas', { state: 'visible', timeout: 5000 });
});

await t('T02', 'All four tool buttons visible', async () => {
  for (const tool of ['emitter', 'collector', 'barrier', 'delete']) {
    const btn = page.locator(`[data-tool="${tool}"]`);
    await btn.waitFor({ state: 'visible', timeout: 3000 });
  }
});

await t('T03', 'Clicking Emitter tool activates it', async () => {
  await page.click('[data-tool="emitter"]');
  const cls = await page.getAttribute('[data-tool="emitter"]', 'class');
  if (!cls.includes('active')) throw new Error('Emitter button not active');
});

await t('T04', 'Placing emitter on canvas adds emitter to state', async () => {
  await page.click('[data-tool="emitter"]');
  await page.click('#sim-canvas', { position: { x: 200, y: 200 } });
  await page.waitForTimeout(300);
  const count = await page.evaluate(() => window._state?.emitters?.length ?? 0);
  if (count === 0) throw new Error(`No emitter in state (count=${count})`);
});

await t('T05', 'Placing collector on canvas adds collector to state', async () => {
  await page.click('[data-tool="collector"]');
  await page.click('#sim-canvas', { position: { x: 500, y: 300 } });
  await page.waitForTimeout(300);
  const count = await page.evaluate(() => window._state?.collectors?.length ?? 0);
  if (count === 0) throw new Error(`No collector in state (count=${count})`);
});

await t('T06', 'Drawing barrier on canvas adds barrier to state', async () => {
  await page.click('[data-tool="barrier"]');
  // Canvas starts after the 220px sidebar — use coordinates well within the canvas area
  await page.mouse.move(300, 300);
  await page.mouse.down();
  await page.mouse.move(650, 300);
  await page.mouse.up();
  await page.waitForTimeout(300);
  const count = await page.evaluate(() => window._state?.barriers?.length ?? 0);
  if (count === 0) throw new Error(`No barrier in state (count=${count})`);
});

await t('T07', 'Delete tool removes emitter from state', async () => {
  const before = await page.evaluate(() => window._state?.emitters?.length ?? 0);
  await page.click('[data-tool="delete"]');
  await page.click('#sim-canvas', { position: { x: 200, y: 200 } });
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => window._state?.emitters?.length ?? 0);
  if (after >= before) throw new Error(`Emitter not deleted (before=${before} after=${after})`);
});

await t('T08', 'Particles spawn over time with emitter present', async () => {
  // Re-place emitter, wait for particles
  await page.click('[data-tool="emitter"]');
  await page.click('#sim-canvas', { position: { x: 300, y: 250 } });
  await page.waitForTimeout(1500);
  const count = await page.evaluate(() => window._state?.particles?.length ?? 0);
  if (count === 0) throw new Error('No particles spawned after 1.5s');
});

await t('T09', 'Dark mode toggle adds dark-mode class to body', async () => {
  await page.click('#btn-dark-mode');
  const hasDark = await page.evaluate(() => document.body.classList.contains('dark-mode'));
  if (!hasDark) throw new Error('body missing dark-mode class after toggle');
  // toggle back
  await page.click('#btn-dark-mode');
});

await t('T10', 'Stats panel shows and hides', async () => {
  await page.click('#btn-stats');
  const visible = await page.isVisible('#stats-overlay');
  if (!visible) throw new Error('stats-overlay not visible after toggle');
  await page.click('#btn-stats');
  const hidden = await page.isHidden('#stats-overlay');
  if (!hidden) throw new Error('stats-overlay still visible after second toggle');
});

await t('T11', 'Maze Escape loads barriers', async () => {
  await page.click('[data-challenge="maze-escape"]');
  await page.waitForTimeout(500);
  const barrierCount = await page.evaluate(() => window._state?.barriers?.length ?? 0);
  if (barrierCount < 5) throw new Error(`Too few barriers loaded (${barrierCount})`);
});

await t('T12', 'Sandbox resets to clear state', async () => {
  await page.click('[data-challenge="sandbox"]');
  await page.waitForTimeout(300);
  const challenge = await page.evaluate(() => window._state?.challenge);
  if (challenge !== null) throw new Error(`challenge not null after sandbox (${challenge})`);
});

// ── Write results ─────────────────────────────────────────────────────────────
const pass = results.filter(r => r.result === 'PASS').length;
const fail = results.filter(r => r.result === 'FAIL').length;

fs.writeFileSync(
  path.join(RESULTS_DIR, 'results.json'),
  JSON.stringify({ pipeline: 'T-PIPELINE-CS-001', date: new Date().toISOString().slice(0,10), pass, fail, results }, null, 2)
);

console.log(`\n=== RESULT: ${pass}/${results.length} PASS  ${fail} FAIL ===\n`);

await browser.close();
server.kill();
process.exit(fail > 0 ? 1 : 0);
