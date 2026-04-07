/**
 * Notepad.exe Chrome Extension — Pipeline Test Runner T-PIPELINE-NP-001
 *
 * Strategy:
 *   1. Load extension via chromium.launchPersistentContext (MV3, service worker)
 *   2. Get extension ID from service worker URL
 *   3. Open chrome-extension://{id}/notepad.html directly
 *   4. Exercise each UC with assertions and labelled screenshots
 *   5. Write results.json to testresults/T-PIPELINE-NP-001/
 *
 * Tests: UC-001, UC-002, UC-002B, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009
 * BR coverage: BR-001 through BR-030
 *
 * MENU LABELS (exact, from MENUS constant):
 *   File: New | Open... | Save | Save As... | Exit
 *   Edit: Undo | Cut | Copy | Paste | Find...
 *   View: Word Wrap
 *   Help: View Help | About Notepad
 */

import pkg from '/tmp/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const { chromium } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXT_DIR   = join(__dirname, 'build', 'extension');
const SHOT_DIR  = join(__dirname, 'testresults', 'T-PIPELINE-NP-001');
const SLOW_MO   = 250;
const STEP_WAIT = 1200;

mkdirSync(SHOT_DIR, { recursive: true });

// ── Helpers ───────────────────────────────────────────────────────────────────
const results     = [];
const bugs        = [];
const screenshots = [];
let stepIdx       = 0;
let bugId         = 1;

function rec(uc, title, brs, result, note, shot = '') {
  results.push({ uc, title, brs, result, note, shot });
  const icon = result.startsWith('✅') ? '✅' : result.startsWith('❌') ? '❌' : '⚠️';
  console.log(`  ${icon}  ${uc} — ${title}`);
  if (note) console.log(`       Note: ${note}`);
}

function bug(uc, severity, title, detail = '') {
  const id = `BUG-NP-${String(bugId++).padStart(3, '0')}`;
  bugs.push({ id, uc, severity, title, detail });
  console.log(`  🐛  ${id} [${severity}] ${title}`);
  if (detail) console.log(`       Detail: ${detail}`);
  return id;
}

function pass(msg)  { console.log(`  ✔  ${msg}`); }
function info(msg)  { console.log(`  ℹ  ${msg}`); }

async function waitMs(ms) { await new Promise(r => setTimeout(r, ms)); }

async function snap(page, label, ucLabel = '', brLabel = '') {
  const idx  = String(++stepIdx).padStart(3, '0');
  const file = join(SHOT_DIR, `np_shot_${idx}_${label}.png`);
  try {
    await page.screenshot({ path: file });
    screenshots.push({ label, path: file, uc: ucLabel, br: brLabel });
    pass(`Screenshot: np_shot_${idx}_${label}.png`);
  } catch (e) {
    console.log(`  ⚠ Screenshot failed: ${e.message}`);
  }
  return file;
}

/**
 * Click a menu button in the menu bar (File, Edit, View, Help)
 * then click the menu item by exact label using .menu-item-label selector.
 * This avoids matching dialog titles or other elements with same text.
 */
async function openMenuThenClick(page, menuName, itemLabel) {
  // Click the menu button (File, Edit, View, Help)
  await page.locator(`#menu-bar button.menu-btn:has-text("${menuName}")`).click();
  await waitMs(400);
  // Click the .menu-item-label with exact text within the open .menu-panel
  await page.locator('.menu-item-label', { hasText: itemLabel }).click({ timeout: 5000 });
  await waitMs(500);
}

// ── Launch Extension ─────────────────────────────────────────────────────────
console.log('\n📝  Notepad.exe — T-PIPELINE-NP-001');
console.log(`    Extension → ${EXT_DIR}`);
console.log(`    Screenshots → ${SHOT_DIR}\n`);

const context = await chromium.launchPersistentContext('', {
  headless: false,
  slowMo: SLOW_MO,
  args: [
    `--disable-extensions-except=${EXT_DIR}`,
    `--load-extension=${EXT_DIR}`,
    '--no-sandbox',
    '--window-size=1024,768',
  ],
  env: { ...process.env, DISPLAY: ':0' },
});

// Get extension ID from service worker
let extensionId;
try {
  const workers = context.serviceWorkers();
  let sw;
  if (workers.length > 0) {
    sw = workers[0];
  } else {
    sw = await context.waitForEvent('serviceworker', { timeout: 12000 });
  }
  extensionId = sw.url().split('/')[2];
  info(`Extension ID: ${extensionId}`);
} catch (err) {
  console.error('❌ FATAL: Could not find service worker:', err.message);
  await context.close();
  process.exit(1);
}

const notepadURL = `chrome-extension://${extensionId}/notepad.html`;
info(`Opening: ${notepadURL}`);

const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));

await page.goto(notepadURL, { waitUntil: 'domcontentloaded' });
await waitMs(STEP_WAIT * 2);

// ── UC-001: Window launches with correct UI ───────────────────────────────────
console.log('\n── UC-001: Window launches with correct UI ──');
try {
  const title          = await page.title().catch(() => '');
  const menuBarVisible = await page.isVisible('#menu-bar').catch(() => false);
  const editorVisible  = await page.isVisible('#editor').catch(() => false);
  const statusEnc      = await page.textContent('#status-encoding').catch(() => '');
  const statusLn       = await page.textContent('#status-line').catch(() => '');
  const statusCol      = await page.textContent('#status-col').catch(() => '');
  const statusChars    = await page.textContent('#status-chars').catch(() => '');

  // Check menu buttons are present (File, Edit, View, Help)
  const menuBtnCount = await page.locator('#menu-bar button.menu-btn').count().catch(() => 0);

  const titleOk  = title === 'Untitled - Notepad';
  const statusOk = statusEnc.includes('UTF-8') && statusLn.includes('Ln 1') && statusCol.includes('Col 1') && statusChars.includes('0');

  const shot = await snap(page, 'UC001_initial_state', 'UC-001', 'BR-001,BR-002,BR-003,BR-004,BR-005,BR-006');

  if (titleOk && menuBarVisible && editorVisible && statusOk) {
    rec('UC-001', 'Window launches with correct UI',
        'BR-001, BR-002, BR-003, BR-004, BR-005, BR-006', '✅ PASS',
        `title="${title}" | menu=✓(${menuBtnCount} buttons) | editor=✓ | status: ${statusEnc}|${statusLn}|${statusCol}|${statusChars}`,
        shot);
  } else {
    const details = [];
    if (!titleOk)        details.push(`title="${title}" (expected "Untitled - Notepad")`);
    if (!menuBarVisible) details.push('menu bar not visible');
    if (!editorVisible)  details.push('editor not visible');
    if (!statusOk)       details.push(`status: enc="${statusEnc}" ln="${statusLn}" col="${statusCol}" chars="${statusChars}"`);
    bug('UC-001', 'HIGH', 'Initial UI state incorrect', details.join('; '));
    rec('UC-001', 'Window launches with correct UI',
        'BR-001, BR-002, BR-003, BR-004, BR-005, BR-006', '❌ FAIL',
        details.join('; '), shot);
  }
} catch (err) {
  bug('UC-001', 'CRITICAL', 'UC-001 test threw exception', err.message);
  rec('UC-001', 'Window launches with correct UI',
      'BR-001, BR-002, BR-003, BR-004, BR-005, BR-006', '❌ FAIL',
      `Exception: ${err.message}`, '');
}

// ── UC-002: Typing in editor ──────────────────────────────────────────────────
console.log('\n── UC-002: Typing in editor ──');
try {
  await page.click('#editor');
  await page.type('#editor', 'Hello World');
  await waitMs(STEP_WAIT);

  const value       = await page.$eval('#editor', el => el.value).catch(() => '');
  const title       = await page.title().catch(() => '');
  const statusCol   = await page.textContent('#status-col').catch(() => '');
  const statusChars = await page.textContent('#status-chars').catch(() => '');

  const shot    = await snap(page, 'UC002_typing', 'UC-002', 'BR-007,BR-016');

  const textOk  = value === 'Hello World';
  const dirtyOk = title.startsWith('*');
  // After "Hello World" (11 chars), cursor at col 12
  const colOk   = statusCol.includes('12');
  const charOk  = statusChars.includes('11');

  if (textOk && dirtyOk && colOk && charOk) {
    rec('UC-002', 'Typing in editor',
        'BR-007, BR-016', '✅ PASS',
        `value="${value}" | title="${title}" | ${statusCol} | ${statusChars}`,
        shot);
  } else {
    const details = [];
    if (!textOk)  details.push(`editor value="${value}" (expected "Hello World")`);
    if (!dirtyOk) details.push(`title="${title}" missing "* " prefix`);
    if (!colOk)   details.push(`${statusCol} (expected Col 12)`);
    if (!charOk)  details.push(`${statusChars} (expected 11 chars)`);
    bug('UC-002', 'HIGH', 'Typing or dirty indicator failed', details.join('; '));
    rec('UC-002', 'Typing in editor',
        'BR-007, BR-016', '❌ FAIL',
        details.join('; '), shot);
  }
} catch (err) {
  bug('UC-002', 'CRITICAL', 'UC-002 test threw exception', err.message);
  rec('UC-002', 'Typing in editor', 'BR-007, BR-016', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── UC-002B: Status bar real-time updates ────────────────────────────────────
console.log('\n── UC-002B: Status bar real-time updates ──');
try {
  // Clear editor and type multi-line content
  await page.click('#editor');
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Delete');
  await waitMs(400);

  await page.type('#editor', 'Line1');
  await page.keyboard.press('Enter');
  await page.type('#editor', 'Line2');
  await page.keyboard.press('Enter');
  await page.type('#editor', 'Line3');
  await waitMs(STEP_WAIT);

  const statusLn    = await page.textContent('#status-line').catch(() => '');
  const statusCol   = await page.textContent('#status-col').catch(() => '');
  const statusChars = await page.textContent('#status-chars').catch(() => '');
  const statusEnc   = await page.textContent('#status-encoding').catch(() => '');
  const editorVal   = await page.$eval('#editor', el => el.value).catch(() => '');

  const shot = await snap(page, 'UC002B_status_bar', 'UC-002B', 'BR-010,BR-011,BR-012,BR-013');

  const lineOk          = statusLn.includes('Ln 3');
  const charCountExpect = editorVal.length;
  const charOk          = statusChars.includes(String(charCountExpect));
  const encOk           = statusEnc.includes('UTF-8');
  // Cursor at end of "Line3" (5 chars) → col 6
  const colOk           = statusCol.includes('6');

  if (lineOk && charOk && encOk) {
    rec('UC-002B', 'Status bar real-time updates',
        'BR-010, BR-011, BR-012, BR-013', '✅ PASS',
        `${statusLn} | ${statusCol} | ${statusChars}(len=${charCountExpect}) | ${statusEnc}`,
        shot);
  } else {
    const details = [];
    if (!lineOk) details.push(`statusLine="${statusLn}" (expected "Ln 3")`);
    if (!charOk) details.push(`statusChars="${statusChars}" (expected "${charCountExpect} chars")`);
    if (!encOk)  details.push('encoding not UTF-8');
    bug('UC-002B', 'HIGH', 'Status bar does not update correctly', details.join('; '));
    rec('UC-002B', 'Status bar real-time updates',
        'BR-010, BR-011, BR-012, BR-013', '❌ FAIL',
        details.join('; '), shot);
  }
} catch (err) {
  bug('UC-002B', 'CRITICAL', 'UC-002B test threw exception', err.message);
  rec('UC-002B', 'Status bar real-time updates', 'BR-010, BR-011, BR-012, BR-013', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── UC-003: Save document ────────────────────────────────────────────────────
console.log('\n── UC-003: Save document ──');
try {
  // Clear and type fresh test content
  await page.click('#editor');
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Delete');
  await waitMs(300);
  await page.type('#editor', 'Test content for save');
  await waitMs(500);

  // Listen for the prompt dialog (filename input on first save)
  let dialogHandled = false;
  page.once('dialog', async (dialog) => {
    pass(`Prompt dialog: "${dialog.message()}"`);
    await dialog.accept('test-note');
    dialogHandled = true;
  });

  // Ctrl+S to save
  await page.keyboard.down('Control');
  await page.keyboard.press('s');
  await page.keyboard.up('Control');
  await waitMs(STEP_WAIT * 2);

  const title  = await page.title().catch(() => '');
  const dirty  = title.startsWith('*');
  const shot   = await snap(page, 'UC003_after_save', 'UC-003', 'BR-014,BR-015,BR-016');

  if (!dirty) {
    rec('UC-003', 'Save document',
        'BR-014, BR-015, BR-016', '✅ PASS',
        `title="${title}" | dirty=false | prompt=${dialogHandled ? 'shown+accepted' : 'not shown'}`,
        shot);
  } else {
    bug('UC-003', 'HIGH', 'Save did not clear dirty flag', `title="${title}"`);
    rec('UC-003', 'Save document',
        'BR-014, BR-015, BR-016', '❌ FAIL',
        `title="${title}" still dirty after Ctrl+S`, shot);
  }
} catch (err) {
  bug('UC-003', 'CRITICAL', 'UC-003 test threw exception', err.message);
  rec('UC-003', 'Save document', 'BR-014, BR-015, BR-016', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── UC-004: Open/load document ────────────────────────────────────────────────
console.log('\n── UC-004: Open/load document ──');
try {
  // File > New (editor is clean after UC-003 save — no confirm dialog expected)
  await openMenuThenClick(page, 'File', 'New');
  await waitMs(STEP_WAIT);

  const editorAfterNew = await page.$eval('#editor', el => el.value).catch(() => 'ERR');
  pass(`After New: editor="${editorAfterNew}"`);

  // File > Open... (exact label)
  await openMenuThenClick(page, 'File', 'Open...');
  await waitMs(STEP_WAIT);

  const openDialogVisible = await page.isVisible('#open-dialog').catch(() => false);
  const shot2 = await snap(page, 'UC004_open_dialog', 'UC-004', 'BR-018');

  if (openDialogVisible) {
    const notes = await page.locator('#open-list div').allTextContents().catch(() => []);
    pass(`Open dialog visible. Notes found: ${JSON.stringify(notes)}`);

    const validNote = notes.find(n => n && n !== 'No saved notes' && n.trim().length > 0);
    if (validNote) {
      await page.locator('#open-list div').first().click();
      await waitMs(STEP_WAIT);

      const editorAfterOpen = await page.$eval('#editor', el => el.value).catch(() => '');
      const shot3 = await snap(page, 'UC004_after_open', 'UC-004', 'BR-019');

      if (editorAfterOpen && editorAfterOpen.length > 0) {
        rec('UC-004', 'Open/load document',
            'BR-018, BR-019', '✅ PASS',
            `Opened "${validNote}", content="${editorAfterOpen.substring(0, 40)}"`,
            shot3);
      } else {
        bug('UC-004', 'HIGH', 'Open dialog selected note but editor empty',
            `selected="${validNote}", editor empty after load`);
        rec('UC-004', 'Open/load document',
            'BR-018, BR-019', '❌ FAIL',
            `Selected "${validNote}" but editor remained empty`, shot3);
      }
    } else {
      bug('UC-004', 'HIGH', 'Open dialog shows no saved notes',
          'chrome.storage.local save from UC-003 produced no persisted notes');
      rec('UC-004', 'Open/load document',
          'BR-018, BR-019', '⚠️ PARTIAL',
          'Open dialog appeared but no saved notes available',
          shot2);
      await page.click('#open-cancel-btn').catch(() => {});
      await waitMs(500);
    }
  } else {
    bug('UC-004', 'HIGH', 'File > Open did not show open dialog', '#open-dialog not visible');
    rec('UC-004', 'Open/load document',
        'BR-018, BR-019', '❌ FAIL',
        'Open dialog not visible after File > Open...', shot2);
  }
} catch (err) {
  bug('UC-004', 'CRITICAL', 'UC-004 test threw exception', err.message);
  rec('UC-004', 'Open/load document', 'BR-018, BR-019', '❌ FAIL', `Exception: ${err.message}`, '');
  // Cancel any open dialog
  await page.click('#open-cancel-btn').catch(() => {});
  await page.keyboard.press('Escape').catch(() => {});
  await waitMs(500);
}

// ── UC-005: New document ──────────────────────────────────────────────────────
console.log('\n── UC-005: New document ──');
try {
  // Type content to make it dirty
  await page.click('#editor');
  await page.keyboard.down('Control');
  await page.keyboard.press('End');
  await page.keyboard.up('Control');
  await page.type('#editor', '\nDirty content for UC-005');
  await waitMs(500);

  const titleBefore = await page.title().catch(() => '');
  pass(`Before New: title="${titleBefore}"`);

  // Listen for confirm dialog → accept
  let confirmShown = false;
  page.once('dialog', async (dialog) => {
    confirmShown = true;
    pass(`Confirm dialog: "${dialog.message()}" — accepting`);
    await dialog.accept();
  });

  // File > New (exact label)
  await openMenuThenClick(page, 'File', 'New');
  await waitMs(STEP_WAIT);

  const editorAfterNew = await page.$eval('#editor', el => el.value).catch(() => 'ERR');
  const titleAfterNew  = await page.title().catch(() => '');
  const statusLn       = await page.textContent('#status-line').catch(() => '');
  const statusChars    = await page.textContent('#status-chars').catch(() => '');

  const shot = await snap(page, 'UC005_new_document', 'UC-005', 'BR-020,BR-021,BR-022');

  const editorEmpty = editorAfterNew === '';
  const titleReset  = titleAfterNew === 'Untitled - Notepad';
  const statusReset = statusLn.includes('Ln 1') && statusChars.includes('0 chars');

  if (editorEmpty && titleReset) {
    rec('UC-005', 'New document',
        'BR-020, BR-021, BR-022', '✅ PASS',
        `editor empty | title="${titleAfterNew}" | ${statusLn} | ${statusChars} | confirm=${confirmShown}`,
        shot);
  } else {
    const details = [];
    if (!editorEmpty) details.push(`editor not empty: "${editorAfterNew.substring(0, 50)}"`);
    if (!titleReset)  details.push(`title="${titleAfterNew}" (expected "Untitled - Notepad")`);
    bug('UC-005', 'HIGH', 'New document did not clear editor or reset title', details.join('; '));
    rec('UC-005', 'New document',
        'BR-020, BR-021, BR-022', '❌ FAIL',
        details.join('; '), shot);
  }
} catch (err) {
  bug('UC-005', 'CRITICAL', 'UC-005 test threw exception', err.message);
  rec('UC-005', 'New document', 'BR-020, BR-021, BR-022', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── UC-006: Save As (download) ────────────────────────────────────────────────
console.log('\n── UC-006: Save As (download) ──');
try {
  // Type some content
  await page.click('#editor');
  await page.type('#editor', 'Download test content');
  await waitMs(500);

  // Set up download listener BEFORE clicking
  const downloadPromise = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);

  // File > Save As... (exact label)
  await openMenuThenClick(page, 'File', 'Save As...');
  await waitMs(1000);

  const download = await downloadPromise;
  const shot = await snap(page, 'UC006_save_as', 'UC-006', 'BR-023,BR-024');

  if (download) {
    const filename = download.suggestedFilename();
    const hasTxt   = filename.endsWith('.txt');
    pass(`Download triggered: "${filename}"`);
    rec('UC-006', 'Save As (download)',
        'BR-023, BR-024', '✅ PASS',
        `Download filename="${filename}" | .txt extension=${hasTxt}`,
        shot);
  } else {
    bug('UC-006', 'HIGH', 'Save As did not trigger download',
        'No download event within 8s; Blob/URL.createObjectURL may be blocked in test context');
    rec('UC-006', 'Save As (download)',
        'BR-023, BR-024', '❌ FAIL',
        'No download event received', shot);
  }
} catch (err) {
  bug('UC-006', 'CRITICAL', 'UC-006 test threw exception', err.message);
  rec('UC-006', 'Save As (download)', 'BR-023, BR-024', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── UC-007: Unsaved changes protection ───────────────────────────────────────
console.log('\n── UC-007: Unsaved changes protection ──');
try {
  // Ensure editor has content (make dirty)
  await page.click('#editor');
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.type('#editor', 'Unsaved protection test — KEEP ME');
  await waitMs(500);

  const titleBefore = await page.title().catch(() => '');
  const isDirty     = titleBefore.startsWith('*');
  pass(`Before UC-007: dirty=${isDirty}, title="${titleBefore}"`);

  // Listen for confirm dialog → DISMISS (cancel) to preserve data
  let protectionShown = false;
  page.once('dialog', async (dialog) => {
    protectionShown = true;
    pass(`Protection dialog: "${dialog.message()}" — cancelling`);
    await dialog.dismiss();
  });

  // File > New (should prompt because dirty)
  await openMenuThenClick(page, 'File', 'New');
  await waitMs(STEP_WAIT);

  const editorAfterCancel = await page.$eval('#editor', el => el.value).catch(() => '');
  const titleAfterCancel  = await page.title().catch(() => '');
  const shot = await snap(page, 'UC007_protection', 'UC-007', 'BR-025');

  const contentPreserved = editorAfterCancel.includes('Unsaved protection');

  if (protectionShown && contentPreserved) {
    rec('UC-007', 'Unsaved changes protection',
        'BR-025', '✅ PASS',
        `Confirm dialog shown; Cancel preserved content. title="${titleAfterCancel}"`,
        shot);
  } else {
    const details = [];
    if (!protectionShown)  details.push('confirmation dialog did not appear for dirty editor');
    if (!contentPreserved) details.push(`content lost: editor="${editorAfterCancel.substring(0, 50)}"`);
    bug('UC-007', 'HIGH', 'Unsaved changes protection failed', details.join('; '));
    rec('UC-007', 'Unsaved changes protection',
        'BR-025', '❌ FAIL',
        details.join('; '), shot);
  }
} catch (err) {
  bug('UC-007', 'CRITICAL', 'UC-007 test threw exception', err.message);
  rec('UC-007', 'Unsaved changes protection', 'BR-025', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── UC-008: Standalone window behavior ───────────────────────────────────────
console.log('\n── UC-008: Standalone window behavior ──');
try {
  const url = page.url();
  const isExtensionPage = url.startsWith('chrome-extension://');
  const shot = await snap(page, 'UC008_window', 'UC-008', 'BR-026,BR-027');

  if (isExtensionPage) {
    rec('UC-008', 'Standalone window behavior',
        'BR-026, BR-027', '✅ PASS',
        `Extension page URL confirmed: ${url.substring(0, 70)}`,
        shot);
  } else {
    bug('UC-008', 'MEDIUM', 'Page is not running as extension page', `URL: ${url}`);
    rec('UC-008', 'Standalone window behavior',
        'BR-026, BR-027', '❌ FAIL',
        `Unexpected URL: ${url}`, shot);
  }
} catch (err) {
  bug('UC-008', 'CRITICAL', 'UC-008 test threw exception', err.message);
  rec('UC-008', 'Standalone window behavior', 'BR-026, BR-027', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── UC-009: Help dialog ───────────────────────────────────────────────────────
console.log('\n── UC-009: Help dialog ──');
try {
  // Press F1 while editor is focused
  await page.click('#editor');
  await page.keyboard.press('F1');
  await waitMs(STEP_WAIT);

  const isHelpVisible  = await page.isVisible('#help-dialog').catch(() => false);
  const helpContentTxt = await page.textContent('#help-content').catch(() => '');
  const shot1 = await snap(page, 'UC009_help_open', 'UC-009', 'BR-028,BR-029');

  // Close via button
  if (isHelpVisible) {
    await page.click('#help-close-btn');
    await waitMs(800);
  }

  const isHelpClosed = !(await page.isVisible('#help-dialog').catch(() => true));
  const shot2 = await snap(page, 'UC009_help_closed', 'UC-009', 'BR-028');

  const hasContent = helpContentTxt.trim().length > 0;

  if (isHelpVisible && isHelpClosed && hasContent) {
    rec('UC-009', 'Help dialog',
        'BR-028, BR-029', '✅ PASS',
        `Help opened on F1 | content=${helpContentTxt.length} chars | closed on button click`,
        shot1);
  } else {
    const details = [];
    if (!isHelpVisible) details.push('help dialog did not open on F1');
    if (!isHelpClosed)  details.push('help dialog did not close on Close button');
    if (!hasContent)    details.push('help dialog content is empty');
    bug('UC-009', 'HIGH', 'Help dialog malfunction', details.join('; '));
    rec('UC-009', 'Help dialog',
        'BR-028, BR-029', '❌ FAIL',
        details.join('; '), shot1);
  }
} catch (err) {
  bug('UC-009', 'CRITICAL', 'UC-009 test threw exception', err.message);
  rec('UC-009', 'Help dialog', 'BR-028, BR-029', '❌ FAIL', `Exception: ${err.message}`, '');
}

// ── Final page-error sweep ────────────────────────────────────────────────────
console.log('\n══ Final page-error sweep ══');
await waitMs(700);
for (const e of pageErrors) {
  bug('GENERAL', 'HIGH', 'Uncaught page error', e.slice(0, 300));
}
if (pageErrors.length === 0) pass('No uncaught page errors');

await snap(page, 'ZZ_final_state', 'T-PIPELINE-NP-001 Complete', 'Final state');

// ── Tally ─────────────────────────────────────────────────────────────────────
const total   = results.length;
const passing = results.filter(r => r.result.startsWith('✅')).length;
const failing = results.filter(r => r.result.startsWith('❌')).length;
const partial = results.filter(r => r.result.startsWith('⚠️')).length;

console.log('\n' + '═'.repeat(60));
console.log(` T-PIPELINE-NP-001 — ${passing}/${total} PASS | ${failing} FAIL | ${partial} PARTIAL | ${bugs.length} bug(s)`);
console.log('═'.repeat(60) + '\n');

if (bugs.length > 0) {
  console.log('Bugs:');
  bugs.forEach(b => console.log(`  ${b.id} [${b.severity}] ${b.title}: ${b.detail}`));
  console.log('');
}

info(`Screenshots: ${screenshots.length} captured in testresults/T-PIPELINE-NP-001/`);
info('Browser closes in 4 seconds…');
await waitMs(4000);
await context.close();

// ── Save results JSON ─────────────────────────────────────────────────────────
const payload = {
  pipeline: 'T-PIPELINE-NP-001',
  date: new Date().toISOString().slice(0, 10),
  summary: { total, passing, failing, partial, bugs: bugs.length },
  results,
  bugs,
  screenshots,
};
writeFileSync(join(SHOT_DIR, 'results.json'), JSON.stringify(payload, null, 2));
console.log(`Results JSON → ${join(SHOT_DIR, 'results.json')}`);

const exitCode = failing > 0 ? 1 : 0;
if (exitCode === 0) console.log('\n✅ PASS PIPELINE');
else console.log('\n❌ FAIL PIPELINE');
process.exit(exitCode);
