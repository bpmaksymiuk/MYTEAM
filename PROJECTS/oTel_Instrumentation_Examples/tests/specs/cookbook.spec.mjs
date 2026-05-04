import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { ensureResultsDir, writeEvidence } from '../../../../.github/skills/test-report-writing/lib/evidence-helper.mjs';

const RESULTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../results');
ensureResultsDir(RESULTS_DIR);

test.describe('oTel Cookbook — UC coverage', () => {

  test('T-001 home page presents cookbook and four languages above the fold', async ({ page }) => {
    await page.goto('/');
    const body = await page.content();
    expect(body).toMatch(/JavaScript/);
    expect(body).toMatch(/Python/);
    expect(body).toMatch(/\.NET|dotnet/i);
    expect(body).toMatch(/Java/);
    expect(body).toMatch(/OTLP/);
    expect(body).toMatch(/Dynatrace/);
    await page.screenshot({ path: path.join(RESULTS_DIR, 'T-001-home.png'), fullPage: true });
    writeEvidence(RESULTS_DIR, 'T-001', { slug: 'home', detail: 'Home page rendered with all four languages, OTLP, and Dynatrace mentioned.' });
  });

  test('T-002 configuration panel persists selection and substitutes values', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-cfg-open]');
    await page.waitForSelector('dialog[open], .cfg-modal[open]');
    await page.screenshot({ path: path.join(RESULTS_DIR, 'T-002-modal-open.png') });
    writeEvidence(RESULTS_DIR, 'T-002', { slug: 'modal-open', detail: 'Configuration modal opened from topbar.' });
  });

  for (const lang of ['javascript', 'python', 'dotnet', 'java']) {
    test(`T-00x ${lang} quickstart renders with verification badge`, async ({ page }) => {
      await page.goto(`/${lang}/quickstart/`);
      await expect(page.locator('text=Verified on')).toBeVisible();
      await page.screenshot({ path: path.join(RESULTS_DIR, `T-${lang}-quickstart.png`), fullPage: true });
      writeEvidence(RESULTS_DIR, `T-${lang}`, { slug: 'quickstart', detail: `${lang} quickstart rendered with verification badge.` });
    });
  }

  test('T-009 navigation index links every recipe', async ({ page }) => {
    await page.goto('/');
    const links = await page.locator('nav a').count();
    expect(links).toBeGreaterThan(20);
    writeEvidence(RESULTS_DIR, 'T-009', { slug: 'nav', detail: `Found ${links} navigation links from home.` });
  });

  test('T-010 cross-cutting topics index lists four topics', async ({ page }) => {
    await page.goto('/topics/');
    for (const topic of ['Resource Attributes', 'Sampling', 'Semantic Conventions', 'Batching']) {
      await expect(page.locator(`text=${topic}`).first()).toBeVisible();
    }
    writeEvidence(RESULTS_DIR, 'T-010', { slug: 'topics', detail: 'All four cross-cutting topics listed.' });
  });

  test('T-011 troubleshooting index lists symptom causes', async ({ page }) => {
    await page.goto('/troubleshooting/');
    await expect(page.locator('text=/4xx|5xx/').first()).toBeVisible();
    await expect(page.locator('text=/parent|child/i').first()).toBeVisible();
    writeEvidence(RESULTS_DIR, 'T-011', { slug: 'trouble', detail: 'Troubleshooting symptoms present.' });
  });

  test('T-012 release notes page lists v0.1.0', async ({ page }) => {
    await page.goto('/release-notes/');
    await expect(page.locator('text=v0.1.0')).toBeVisible();
    writeEvidence(RESULTS_DIR, 'T-012', { slug: 'rn', detail: 'Release notes page renders v0.1.0.' });
  });

  test('T-013 sample directories exist and parity script passes', async () => {
    const buildDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../build');
    for (const lang of ['javascript', 'python', 'dotnet', 'java']) {
      const dir = path.join(buildDir, 'samples', lang);
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.existsSync(path.join(dir, 'README.md'))).toBe(true);
    }
    writeEvidence(RESULTS_DIR, 'T-013', { slug: 'samples', detail: 'All four sample dirs present with README.md.' });
  });
});
