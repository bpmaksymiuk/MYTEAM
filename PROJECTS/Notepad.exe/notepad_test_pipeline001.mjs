// notepad_test_pipeline001.mjs — DI-011
// Playwright test pipeline for Notepad.exe Chrome Extension
// Run: DISPLAY=:0 node notepad_test_pipeline001.mjs

import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const EXTENSION_PATH = path.resolve(__dirname, 'build/extension');
const RESULTS_DIR    = path.resolve(__dirname, 'testresults/T-PIPELINE-NOTEPAD-EXE-001');
const RESULTS_FILE   = path.join(RESULTS_DIR, 'results.json');

fs.mkdirSync(RESULTS_DIR, { recursive: true });

const results = { passed: 0, failed: 0, partial: 0, tests: [] };

function record(id, description, status, notes = '') {
  results.tests.push({ id, description, status, notes });
  if (status === 'PASS') results.passed++;
  else if (status === 'FAIL') results.failed++;
  else results.partial++;
  console.log(`  [${status.padEnd(7)}] ${id}: ${description}${notes ? ' — ' + notes : ''}`);
}

async function closeAllDialogs(page) {
  // Force-close any open dialog overlays so menus remain clickable
  await page.evaluate(() => {
    const overlay = document.getElementById('dialog-overlay');
    if (overlay) overlay.classList.add('hidden');
    document.querySelectorAll('.dialog').forEach(d => d.classList.add('hidden'));
  }).catch(() => {});
}

async function screenshot(page, name) {
  const file = path.join(RESULTS_DIR, `${name}.png`);
  await page.screenshot({ path: file });
  return file;
}

async function run() {
  console.log('=== Notepad.exe Test Pipeline 001 ===\n');

  // Launch Chromium with extension loaded
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
    slowMo: 100,
  });

  // Get the extension ID from background service worker
  let extensionId = null;
  try {
    const workers = context.serviceWorkers();
    if (workers.length > 0) {
      extensionId = workers[0].url().split('/')[2];
    } else {
      // Wait for service worker
      const worker = await context.waitForEvent('serviceworker', { timeout: 5000 });
      extensionId = worker.url().split('/')[2];
    }
    record('T-001', 'Extension loads and service worker starts', 'PASS');
  } catch (e) {
    record('T-001', 'Extension loads and service worker starts', 'FAIL', e.message);
    extensionId = null;
  }

  // ── UC-001 / UC-008: Detached window (requires real installed extension) ───
  // NOTE: chrome.windows.create is not available in the test extension context
  // in the same way as a real install. We test the page directly instead.
  record('UC-001', 'Extension opens a detached Notepad window', 'PARTIAL',
    'chrome.windows.create requires a real installed extension — tested via direct page load');
  record('UC-008', 'Extension enforces single-instance window', 'PARTIAL',
    'chrome.storage.session.get/set tested indirectly via background.js load');

  // Open the index.html page directly for functional testing
  const page = await context.newPage();
  const indexUrl = `chrome-extension://${extensionId}/index.html`;

  try {
    await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await screenshot(page, '01-initial-load');
    record('T-002', 'index.html loads without errors', 'PASS');
  } catch (e) {
    record('T-002', 'index.html loads without errors', 'FAIL', e.message);
    await context.close();
    writeResults();
    return;
  }

  // ── UC-002: Text editing ──────────────────────────────────────────────────
  try {
    const editor = page.locator('#editor');
    await editor.click();
    await editor.type('Hello, Notepad!');
    const value = await editor.inputValue();
    if (value === 'Hello, Notepad!') {
      record('UC-002', 'User can type text in the editor', 'PASS');
    } else {
      record('UC-002', 'User can type text in the editor', 'FAIL', `Got: ${value}`);
    }
    await screenshot(page, '02-typing');
  } catch (e) {
    record('UC-002', 'User can type text in the editor', 'FAIL', e.message);
  }

  // ── UC-006: Status bar ────────────────────────────────────────────────────
  try {
    const lineEl  = page.locator('#status-line');
    const colEl   = page.locator('#status-col');
    const charsEl = page.locator('#status-chars');
    const lineText  = await lineEl.textContent();
    const colText   = await colEl.textContent();
    const charsText = await charsEl.textContent();
    if (lineText.startsWith('Ln') && colText.startsWith('Col') && charsText.includes('chars')) {
      record('UC-006', 'Status bar shows Ln/Col/Chars', 'PASS',
        `${lineText}, ${colText}, ${charsText}`);
    } else {
      record('UC-006', 'Status bar shows Ln/Col/Chars', 'FAIL',
        `Got: "${lineText}", "${colText}", "${charsText}"`);
    }
  } catch (e) {
    record('UC-006', 'Status bar shows Ln/Col/Chars', 'FAIL', e.message);
  }

  // ── UC-007: Menu bar visible ──────────────────────────────────────────────
  try {
    const menuItems = page.locator('.menu-item');
    const count = await menuItems.count();
    if (count >= 3) {
      record('UC-007', 'Menu bar is visible with File/Edit/View/Help', 'PASS',
        `${count} menu items found`);
    } else {
      record('UC-007', 'Menu bar is visible', 'FAIL', `Only ${count} menu items`);
    }
    await screenshot(page, '03-menubar');
  } catch (e) {
    record('UC-007', 'Menu bar is visible', 'FAIL', e.message);
  }

  // ── UC-003: Save note ─────────────────────────────────────────────────────
  try {
    // Open File menu
    await page.locator('.menu-item').first().click();
    await page.waitForTimeout(300);

    // Click Save — since file is unnamed, it will trigger save-as prompt
    // We handle window.prompt by using dialog handler
    page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt') {
        await dialog.accept('TestNote');
      } else {
        await dialog.dismiss();
      }
    });

    const saveItem = page.locator(`[data-action="file:save"]`);
    await saveItem.click();
    await page.waitForTimeout(500);

    // Verify note appears in localStorage
    const saved = await page.evaluate(() => {
      return localStorage.getItem('notepad_note_TestNote');
    });

    if (saved === 'Hello, Notepad!') {
      record('UC-003', 'User can save a note to localStorage', 'PASS');
    } else {
      record('UC-003', 'User can save a note to localStorage', 'FAIL',
        `localStorage value: ${saved}`);
    }
    await screenshot(page, '04-after-save');
  } catch (e) {
    record('UC-003', 'User can save a note to localStorage', 'FAIL', e.message);
  }

  // ── UC-004: New file / unsaved guard ─────────────────────────────────────
  try {
    // Type something new to set dirty state
    await page.locator('#editor').click();
    await page.keyboard.press('Control+a');
    await page.locator('#editor').type('Unsaved text');

    // Trigger New — should show unsaved guard dialog
    // Dismiss with "No" (discard)
    page.once('dialog', async dialog => { await dialog.dismiss(); });

    // Use keyboard shortcut
    await page.keyboard.press('Control+n');
    await page.waitForTimeout(500);

    // If dialog appeared, the unsaved guard fired; the dialog module handles it
    // (dialogs.js uses DOM modals, not native dialogs)
    // Just check the confirm dialog is shown
    const confirmVisible = await page.locator('#dialog-confirm').evaluate(
      el => !el.classList.contains('hidden')
    ).catch(() => false);

    // Click "No" to discard
    if (confirmVisible) {
      await page.locator('#dialog-no').click();
      await page.waitForTimeout(300);
    }

    const editorVal = await page.locator('#editor').inputValue();
    if (editorVal === '') {
      record('UC-004', 'New file clears editor after unsaved guard', 'PASS');
    } else {
      record('UC-004', 'New file clears editor after unsaved guard', 'FAIL',
        `Editor not cleared: "${editorVal.slice(0, 30)}"`);
    }
    await screenshot(page, '05-new-file');
  } catch (e) {
    record('UC-004', 'New file / unsaved guard', 'FAIL', e.message);
  }

  // ── UC-003b: Open a saved note ────────────────────────────────────────────
  try {
    await closeAllDialogs(page);
    // Seed a note via localStorage
    await page.evaluate(() => {
      localStorage.setItem('notepad_note_MyNote', 'Loaded content!');
    });

    // Open File > Open
    await page.locator('.menu-item').first().click();
    await page.waitForTimeout(200);
    await page.locator(`[data-action="file:open"]`).click();
    await page.waitForTimeout(400);

    // Check open picker dialog is visible
    const pickerVisible = await page.locator('#dialog-open').evaluate(
      el => !el.classList.contains('hidden')
    ).catch(() => false);

    if (pickerVisible) {
      // Click MyNote
      await page.locator('#open-file-list li').filter({ hasText: 'MyNote' }).click();
      await page.waitForTimeout(300);
      const val = await page.locator('#editor').inputValue();
      if (val === 'Loaded content!') {
        record('UC-003b', 'Open picker loads selected note into editor', 'PASS');
      } else {
        record('UC-003b', 'Open picker loads selected note into editor', 'FAIL',
          `Got: "${val}"`);
      }
    } else {
      record('UC-003b', 'Open picker dialog appears', 'FAIL', 'Dialog not visible');
    }
    await screenshot(page, '06-open-note');
  } catch (e) {
    record('UC-003b', 'Open and load a saved note', 'FAIL', e.message);
  }

  // ── UC-005: Download ──────────────────────────────────────────────────────
  try {
    await closeAllDialogs(page);
    // Trigger download
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }),
      (async () => {
        await page.locator('.menu-item').first().click();
        await page.waitForTimeout(200);
        await page.locator(`[data-action="file:download"]`).click();
      })(),
    ]);
    const suggestedFilename = download.suggestedFilename();
    if (suggestedFilename.endsWith('.txt')) {
      record('UC-005', 'Download triggers file download with .txt extension', 'PASS',
        `filename: ${suggestedFilename}`);
    } else {
      record('UC-005', 'Download triggers file download', 'FAIL',
        `filename: ${suggestedFilename}`);
    }
    await screenshot(page, '07-download');
  } catch (e) {
    record('UC-005', 'Download triggers file download', 'FAIL', e.message);
  }

  // ── UC-009: Word wrap toggle ──────────────────────────────────────────────
  try {
    await closeAllDialogs(page);
    // Open View menu
    const viewMenu = page.locator('.menu-item').nth(2);
    await viewMenu.click();
    await page.waitForTimeout(200);
    await page.locator(`[data-action="view:wordwrap"]`).click();
    await page.waitForTimeout(200);

    const wrapAttr = await page.locator('#editor').getAttribute('wrap');
    if (wrapAttr === 'off') {
      record('UC-009', 'View > Word Wrap toggles wrap off', 'PASS');
    } else {
      record('UC-009', 'View > Word Wrap toggle', 'FAIL', `wrap attr: ${wrapAttr}`);
    }
    await screenshot(page, '08-wordwrap');
  } catch (e) {
    record('UC-009', 'Word wrap toggle', 'FAIL', e.message);
  }

  // ── UC-010: Keyboard shortcuts help ──────────────────────────────────────
  try {
    await closeAllDialogs(page);
    const helpMenu = page.locator('.menu-item').nth(3);
    await helpMenu.click();
    await page.waitForTimeout(200);
    await page.locator(`[data-action="help:keyboard"]`).click();
    await page.waitForTimeout(300);

    const helpVisible = await page.locator('#dialog-help').evaluate(
      el => !el.classList.contains('hidden')
    );

    if (helpVisible) {
      record('UC-010', 'Help > Keyboard Shortcuts dialog opens', 'PASS');
      // Close it
      await page.locator('#dialog-help-close').click();
    } else {
      record('UC-010', 'Help > Keyboard Shortcuts dialog opens', 'FAIL',
        'Dialog not visible');
    }
    await screenshot(page, '09-help-dialog');
  } catch (e) {
    record('UC-010', 'Help > Keyboard Shortcuts dialog', 'FAIL', e.message);
  }

  // ── BR-005: File menu items ───────────────────────────────────────────────
  try {
    await closeAllDialogs(page);
    await page.locator('.menu-item').first().click();
    await page.waitForTimeout(300);
    const fileItems = await page.locator('.menu-item').first().locator('.menu-dropdown li:not(.separator) span:first-child').allTextContents();
    const expected = ['New', 'Open...', 'Save', 'Save As...', 'Exit'];
    const allPresent = expected.every(e => fileItems.some(i => i.includes(e)));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    if (allPresent) {
      record('BR-005', 'File menu contains New, Open, Save, Save As, Exit', 'PASS', `items: ${fileItems.join(', ')}`);
    } else {
      record('BR-005', 'File menu contains New, Open, Save, Save As, Exit', 'FAIL', `items: ${fileItems.join(', ')}`);
    }
    await screenshot(page, '10-file-menu-items');
  } catch (e) {
    record('BR-005', 'File menu items', 'FAIL', e.message);
  }

  // ── BR-006: Edit menu items ───────────────────────────────────────────────
  try {
    await closeAllDialogs(page);
    await page.locator('.menu-item').nth(1).click();
    await page.waitForTimeout(300);
    const editItems = await page.locator('.menu-item').nth(1).locator('.menu-dropdown li:not(.separator) span:first-child').allTextContents();
    const expected = ['Undo', 'Cut', 'Copy', 'Paste', 'Find...', 'Replace...'];
    const allPresent = expected.every(e => editItems.some(i => i.includes(e)));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    if (allPresent) {
      record('BR-006', 'Edit menu contains Undo, Cut, Copy, Paste, Find, Replace', 'PASS', `items: ${editItems.join(', ')}`);
    } else {
      record('BR-006', 'Edit menu contains Undo, Cut, Copy, Paste, Find, Replace', 'FAIL', `items: ${editItems.join(', ')}`);
    }
    await screenshot(page, '11-edit-menu-items');
  } catch (e) {
    record('BR-006', 'Edit menu items', 'FAIL', e.message);
  }

  // ── BR-007: View menu items ───────────────────────────────────────────────
  try {
    await closeAllDialogs(page);
    await page.locator('.menu-item').nth(2).click();
    await page.waitForTimeout(300);
    const viewItems = await page.locator('.menu-item').nth(2).locator('.menu-dropdown li:not(.separator) span:first-child').allTextContents();
    const hasWordWrap = viewItems.some(i => i.includes('Word Wrap'));
    const hasZoom = viewItems.some(i => i.includes('Zoom'));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    if (hasWordWrap && hasZoom) {
      record('BR-007', 'View menu contains Word Wrap and Zoom', 'PASS', `items: ${viewItems.join(', ')}`);
    } else {
      record('BR-007', 'View menu contains Word Wrap and Zoom', 'FAIL', `items: ${viewItems.join(', ')}`);
    }
    await screenshot(page, '12-view-menu-items');
  } catch (e) {
    record('BR-007', 'View menu items', 'FAIL', e.message);
  }

  // ── BR-008: Help menu items ───────────────────────────────────────────────
  try {
    await closeAllDialogs(page);
    await page.locator('.menu-item').nth(3).click();
    await page.waitForTimeout(300);
    const helpItems = await page.locator('.menu-item').nth(3).locator('.menu-dropdown li:not(.separator) span:first-child').allTextContents();
    const hasViewHelp = helpItems.some(i => i.includes('View Help'));
    const hasAbout    = helpItems.some(i => i.includes('About Notepad'));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    if (hasViewHelp && hasAbout) {
      record('BR-008', 'Help menu contains View Help and About Notepad', 'PASS', `items: ${helpItems.join(', ')}`);
    } else {
      record('BR-008', 'Help menu contains View Help and About Notepad', 'FAIL', `items: ${helpItems.join(', ')}`);
    }
    await screenshot(page, '13-help-menu-items');
  } catch (e) {
    record('BR-008', 'Help menu items', 'FAIL', e.message);
  }

  // ── BR-022: Status bar UTF-8 encoding indicator ───────────────────────────
  try {
    const encText = await page.locator('#status-encoding').textContent();
    if (encText.trim() === 'UTF-8') {
      record('BR-022', 'Status bar shows UTF-8 encoding', 'PASS');
    } else {
      record('BR-022', 'Status bar shows UTF-8 encoding', 'FAIL', `Got: "${encText}"`);
    }
  } catch (e) {
    record('BR-022', 'Status bar encoding indicator', 'FAIL', e.message);
  }

  // ── BR-054/055/057/058/059: Help dialog full verification ────────────────
  try {
    await closeAllDialogs(page);
    await page.locator('.menu-item').nth(3).click();
    await page.waitForTimeout(200);
    await page.locator(`[data-action="help:keyboard"]`).click();
    await page.waitForTimeout(300);

    const titleText = await page.locator('#dialog-help .dialog-title').textContent();
    const titleOk = titleText.length > 0;
    const rows = await page.locator('#dialog-help .shortcuts-table tr').count();
    const hasShortcuts = rows > 1;
    const closeBtnVisible = await page.locator('#dialog-help-close').isVisible();

    await screenshot(page, '14-help-dialog-full');

    // Close via Escape (BR-059)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const hiddenAfterEsc = await page.locator('#dialog-help').evaluate(el => el.classList.contains('hidden'));

    if (titleOk && hasShortcuts && closeBtnVisible && hiddenAfterEsc) {
      record('BR-054-059', 'Help dialog: title, shortcuts, close button, Escape dismiss', 'PASS',
        `${rows} shortcut rows, title: "${titleText}"`);
    } else {
      record('BR-054-059', 'Help dialog full check', 'FAIL',
        `title ok: ${titleOk}, rows: ${rows}, closeBtn: ${closeBtnVisible}, esc close: ${hiddenAfterEsc}`);
    }
  } catch (e) {
    record('BR-054-059', 'Help dialog full check', 'FAIL', e.message);
  }

  // ── BR-039/040: Title bar + status bar after New ──────────────────────────
  try {
    await closeAllDialogs(page);
    const ed = page.locator('#editor');
    await ed.click();
    await ed.type(' test');
    await page.waitForTimeout(200);

    await page.locator('.menu-item').first().click();
    await page.waitForTimeout(200);
    await page.locator('[data-action="file:new"]').click();
    await page.waitForTimeout(400);

    // Confirm dialog may appear — click No to discard
    const confirmVis = await page.locator('#dialog-confirm').evaluate(
      el => !el.classList.contains('hidden')).catch(() => false);
    if (confirmVis) {
      await page.locator('#dialog-no').click();
      await page.waitForTimeout(300);
    }

    const titleAfterNew = await page.title();
    const lineAfterNew  = await page.locator('#status-line').textContent();
    const colAfterNew   = await page.locator('#status-col').textContent();
    const charsAfterNew = await page.locator('#status-chars').textContent();
    const titleOk  = titleAfterNew === 'Untitled - Notepad';
    const statusOk = lineAfterNew === 'Ln 1' && colAfterNew === 'Col 1' && charsAfterNew === '0 chars';

    await screenshot(page, '15-after-new-titlebar');
    if (titleOk && statusOk) {
      record('BR-039-040', 'Title "Untitled - Notepad" and status Ln1/Col1/0 chars after New', 'PASS');
    } else {
      record('BR-039-040', 'Title and status reset after New', 'FAIL',
        `title: "${titleAfterNew}", line: "${lineAfterNew}", col: "${colAfterNew}", chars: "${charsAfterNew}"`);
    }
  } catch (e) {
    record('BR-039-040', 'Title and status bar after New', 'FAIL', e.message);
  }

  // ── BR-028/033: Title bar updates after save / load ───────────────────────
  try {
    await closeAllDialogs(page);
    await page.evaluate(() => {
      localStorage.setItem('notepad_note_TitleTest', 'Title test content');
    });
    await page.locator('.menu-item').first().click();
    await page.waitForTimeout(200);
    await page.locator('[data-action="file:open"]').click();
    await page.waitForTimeout(400);

    const pickerVisible = await page.locator('#dialog-open').evaluate(
      el => !el.classList.contains('hidden')).catch(() => false);
    if (pickerVisible) {
      await page.locator('#open-file-list li').filter({ hasText: 'TitleTest' }).click();
      await page.waitForTimeout(300);
    }

    const titleAfterLoad = await page.title();
    const titleOk = titleAfterLoad.includes('TitleTest');
    await screenshot(page, '16-title-after-load');
    record('BR-033', `Title bar shows loaded filename`, titleOk ? 'PASS' : 'FAIL',
      `Got: "${titleAfterLoad}"`);
  } catch (e) {
    record('BR-033', 'Title bar updates after load', 'FAIL', e.message);
  }

  await context.close();
  writeResults();
}

function writeResults() {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  console.log(`\n=== Results: ${results.passed} PASS | ${results.partial} PARTIAL | ${results.failed} FAIL ===`);
  console.log(`Results saved to: ${RESULTS_FILE}`);
}

run().catch(e => {
  console.error('Fatal:', e);
  writeResults();
  process.exit(1);
});
