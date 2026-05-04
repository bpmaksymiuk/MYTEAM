// @ts-check
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { ensureResultsDir, writeEvidence } from '../../../../.github/skills/test-report-writing/lib/evidence-helper.mjs';

const RESULTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../results');
ensureResultsDir(RESULTS_DIR);

const BASE = 'http://localhost:5174';

// T-001 — App loads
test('T-001 App loads without errors', async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle(/Cyrillic.*Glagolitic/);
  await expect(page.locator('#input-text')).toBeVisible();
  await expect(page.locator('#btn-mode-cyr-glag')).toBeVisible();
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-001-load.png') });
  writeEvidence(RESULTS_DIR, 'T-001', { slug: 'app-load', detail: 'Page renders; title and mode toggle visible' });
});

// T-002 — BR-001, BR-004 live Cyrillic→Glagolitic
test('T-002 Cyrillic→Glagolitic live conversion', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#input-text', 'абв');
  const output = await page.locator('#output-text').textContent();
  expect(output).toBe('ⰰⰱⰲ');
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-002-conversion.png') });
  writeEvidence(RESULTS_DIR, 'T-002', { slug: 'cyr-glag-live', detail: `Input: абв → Output: ${output}` });
});

// T-003 — BR-002 unmapped Cyrillic passthrough
test('T-003 Unmapped Cyrillic chars pass through', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#input-text', 'а1 б');
  const output = await page.locator('#output-text').textContent();
  expect(output).toBe('ⰰ1 ⰱ');
  writeEvidence(RESULTS_DIR, 'T-003', { slug: 'unmapped-passthrough', detail: `Input: а1 б → Output: ${output}` });
});

// T-004 — BR-003 non-Cyrillic passthrough
test('T-004 Non-Cyrillic chars pass through unchanged', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#input-text', 'Hello!');
  const output = await page.locator('#output-text').textContent();
  expect(output).toBe('Hello!');
  writeEvidence(RESULTS_DIR, 'T-004', { slug: 'non-cyrillic-passthrough', detail: `Input: Hello! → Output: ${output}` });
});

// T-005 — BR-005 mapping section opens
test('T-005 Reference table opens on Mapping button click', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mapping');
  await expect(page.locator('#section-mapping')).toBeVisible();
  await expect(page.locator('#section-mapping h2')).toHaveText('Character Mapping Reference');
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-005-mapping-open.png') });
  writeEvidence(RESULTS_DIR, 'T-005', { slug: 'mapping-open', detail: 'Mapping section visible after button click' });
});

// T-006 — BR-005 29 table rows
test('T-006 Reference table has exactly 29 rows', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mapping');
  const rows = page.locator('.mapping-table tbody tr');
  await expect(rows).toHaveCount(29);
  writeEvidence(RESULTS_DIR, 'T-006', { slug: 'table-row-count', detail: '29 tbody rows confirmed' });
});

// T-007 — BR-006 first row content
test('T-007 Mapping table first row contains А and Ⰰ', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mapping');
  const firstRow = page.locator('.mapping-table tbody tr').first();
  const cells = firstRow.locator('td');
  await expect(cells.nth(0)).toHaveText('А');
  await expect(cells.nth(2)).toHaveText('Ⰰ');
  writeEvidence(RESULTS_DIR, 'T-007', { slug: 'table-first-row', detail: 'Row 1: А — Ⰰ confirmed' });
});

// T-008 — BR-007 clear button
test('T-008 Clear button empties both panels', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#input-text', 'тест');
  await expect(page.locator('#output-text')).not.toBeEmpty();
  await page.click('#btn-clear');
  await expect(page.locator('#input-text')).toHaveValue('');
  await expect(page.locator('#output-text')).toBeEmpty();
  writeEvidence(RESULTS_DIR, 'T-008', { slug: 'clear-both-panels', detail: 'Both panels empty after clear' });
});

// T-009 — BR-008 clear focuses input
test('T-009 Clear button returns focus to input', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#input-text', 'тест');
  await page.click('#btn-clear');
  const focused = await page.evaluate(() => document.activeElement?.id);
  expect(focused).toBe('input-text');
  writeEvidence(RESULTS_DIR, 'T-009', { slug: 'clear-focus', detail: 'Focus on #input-text after clear' });
});

// T-010 — BR-011 copy disabled when empty
test('T-010 Copy button is disabled when output is empty', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('#btn-copy')).toBeDisabled();
  writeEvidence(RESULTS_DIR, 'T-010', { slug: 'copy-disabled-empty', detail: 'Copy button disabled on fresh load' });
});

// T-011 — BR-009, BR-011 copy enabled when output present
test('T-011 Copy button enabled when output has content', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#input-text', 'А');
  await expect(page.locator('#btn-copy')).toBeEnabled();
  writeEvidence(RESULTS_DIR, 'T-011', { slug: 'copy-enabled', detail: 'Copy button enabled after conversion' });
});

// T-012 — BR-009 clipboard write
test('T-012 Copy writes converted text to clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(BASE);
  await page.fill('#input-text', 'аб');
  await page.click('#btn-copy');
  const clipText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipText).toBe('ⰰⰱ');
  writeEvidence(RESULTS_DIR, 'T-012', { slug: 'clipboard-write', detail: `Clipboard contains: ${clipText}` });
});

// T-013 — BR-010 toast appears
test('T-013 Toast appears within 500ms of copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(BASE);
  await page.fill('#input-text', 'А');
  await page.click('#btn-copy');
  await expect(page.locator('#toast')).toHaveClass(/visible/, { timeout: 500 });
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-013-toast.png') });
  writeEvidence(RESULTS_DIR, 'T-013', { slug: 'toast-visible', detail: 'Toast has class "visible" within 500ms' });
});

// T-014 — BR-014, UC-005 mode toggle
test('T-014 Mode toggle switches to Glagolitic→Cyrillic', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mode-glag-cyr');
  await expect(page.locator('#btn-mode-glag-cyr')).toHaveClass(/active/);
  await expect(page.locator('#label-input')).toHaveText('Input — Glagolitic');
  await page.screenshot({ path: path.join(RESULTS_DIR, 'T-014-reverse-mode.png') });
  writeEvidence(RESULTS_DIR, 'T-014', { slug: 'mode-switch', detail: 'btn-mode-glag-cyr active; label updated' });
});

// T-015 — BR-014 mode switch clears panels
test('T-015 Mode switch clears both panels', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#input-text', 'тест');
  await page.click('#btn-mode-glag-cyr');
  await expect(page.locator('#input-text')).toHaveValue('');
  await expect(page.locator('#output-text')).toBeEmpty();
  writeEvidence(RESULTS_DIR, 'T-015', { slug: 'mode-clears-panels', detail: 'Both panels empty after mode switch' });
});

// T-016 — BR-012 Glagolitic→Cyrillic conversion
test('T-016 Glagolitic→Cyrillic live conversion', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mode-glag-cyr');
  await page.fill('#input-text', 'ⰰ');
  const output = await page.locator('#output-text').textContent();
  expect(output).toBe('а');
  writeEvidence(RESULTS_DIR, 'T-016', { slug: 'glag-cyr-live', detail: `Input: ⰰ → Output: ${output}` });
});

// T-017 — BR-013 unmapped Glagolitic passthrough
test('T-017 Unmapped Glagolitic chars pass through', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mode-glag-cyr');
  await page.fill('#input-text', 'X');
  const output = await page.locator('#output-text').textContent();
  expect(output).toBe('X');
  writeEvidence(RESULTS_DIR, 'T-017', { slug: 'unmapped-glag-passthrough', detail: `Input: X → Output: ${output}` });
});

// T-018 — BR-014 mode-reverse class
test('T-018 body has mode-reverse class in Glagolitic→Cyrillic mode', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mode-glag-cyr');
  const hasClass = await page.evaluate(() => document.body.classList.contains('mode-reverse'));
  expect(hasClass).toBe(true);
  writeEvidence(RESULTS_DIR, 'T-018', { slug: 'mode-reverse-class', detail: 'body.mode-reverse class present' });
});

// T-019 — BR-005 close mapping
test('T-019 Back button closes mapping section', async ({ page }) => {
  await page.goto(BASE);
  await page.click('#btn-mapping');
  await expect(page.locator('#section-mapping')).toBeVisible();
  await page.click('#btn-close-mapping');
  await expect(page.locator('#section-mapping')).toBeHidden();
  writeEvidence(RESULTS_DIR, 'T-019', { slug: 'mapping-close', detail: 'Mapping section hidden after Back click' });
});
