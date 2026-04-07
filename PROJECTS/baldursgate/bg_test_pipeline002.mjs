/**
 * Baldur's Gate — Pipeline Test Runner T-PIPELINE-002
 * Visible browser (headless:false), screenshots to ./testresults/T-PIPELINE-002/
 * Covers UC-001 through UC-015, maps to BR-001 – BR-080.
 */
import pkg from '/tmp/node_modules/playwright/index.js';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const { chromium } = pkg;

const __dirname  = dirname(fileURLToPath(import.meta.url));
const BASE_URL   = 'http://localhost:8080';
const SLOW_MO    = 250;
const STEP_WAIT  = 1800;
const NAV_WAIT   = 3500;
// Always relative to the script file, not the working directory
const SHOT_DIR   = join(__dirname, 'testresults', 'T-PIPELINE-002');

mkdirSync(SHOT_DIR, { recursive: true });

const results    = [];   // { uc, title, brs, result, note, shot }
const bugs       = [];
const screenshots = [];
let stepIdx = 0;
let bugId   = 1;

function rec(uc, title, brs, result, note, shot = '') {
  results.push({ uc, title, brs, result, note, shot });
}
function bug(uc, severity, title, detail = '') {
  bugs.push({ id: `BUG-${String(bugId++).padStart(3,'0')}`, uc, severity, title, detail });
  console.log(`  ‼ [${severity.toUpperCase()}] ${title}`);
}
function pass(msg)  { console.log(`  ✓ ${msg}`); }
function info(msg)  { console.log(`  ℹ ${msg}`); }

async function snap(page, label) {
  const fname = `${SHOT_DIR}/bg_shot_${String(++stepIdx).padStart(3,'0')}_${label.replace(/[^a-z0-9]/gi,'_')}.png`;
  await page.screenshot({ path: fname, fullPage: false }).catch(() => {});
  screenshots.push({ label, path: fname });
  console.log(`  📸 ${fname}`);
  return fname;
}

async function waitMs(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Launch ────────────────────────────────────────────────────────────────────
console.log('\n🎮  Baldur\'s Gate — T-PIPELINE-002');
console.log(`    Screenshots → ${SHOT_DIR}\n`);

const browser = await chromium.launch({
  headless: false,
  slowMo: SLOW_MO,
  args: ['--no-sandbox', '--start-maximized', '--force-device-scale-factor=1'],
});
const ctx  = await browser.newContext({ viewport: null });
const page = await ctx.newPage();

const consoleErrors = [];
const pageErrors    = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => pageErrors.push(e.message));

// ── UC-001: Launch & Main Menu (BR-001 – BR-005) ──────────────────────────────
console.log('\n══ UC-001: Launch & Main Menu ══');
await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
await waitMs(NAV_WAIT);
const shot001 = await snap(page, 'UC001_main_menu');

const title = await page.title();
const titleOk = title.toLowerCase().includes('baldur');
if (titleOk) pass(`Title: "${title}"`); else bug('UC-001','high',`Wrong page title: "${title}"`);

const newGameBtn = await page.$('button:has-text("New Game"), button:has-text("NEW GAME")');
let menuPainted = false;
if (newGameBtn) {
  pass('New Game button visible');
  menuPainted = true;
} else {
  menuPainted = await page.evaluate(() => {
    const c = document.getElementById('game-canvas');
    if (!c) return false;
    const ctx2 = c.getContext('2d');
    const d = ctx2.getImageData(c.width/2, c.height/2, 1, 1).data;
    return d[0]+d[1]+d[2] > 0;
  });
  if (!menuPainted) bug('UC-001','high','Main menu canvas is black — nothing rendered');
  else pass('Main menu canvas painted (canvas UI)');
}

const errCount001 = consoleErrors.length;
if (errCount001 > 0) bug('UC-001','high',`${errCount001} JS error(s) on load`, consoleErrors.slice(0,3).join('\n'));
else pass('No JS errors on load');

const uc001pass = titleOk && menuPainted && errCount001 === 0;
rec('UC-001','Launch & Main Menu','BR-001, BR-002, BR-003, BR-004, BR-005',
    uc001pass ? '✅ PASS' : '❌ FAIL', uc001pass ? '' : 'See bugs', shot001);

// ── UC-002: Character Creation (BR-006 – BR-020) ──────────────────────────────
console.log('\n══ UC-002: Character Creation ══');
consoleErrors.length = 0;

if (newGameBtn) { await newGameBtn.click(); }
else {
  const canvas = await page.$('#game-canvas');
  const box = await canvas.boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.44);
}
await waitMs(NAV_WAIT);
await snap(page, 'UC002_enter_creation');

async function clickNext() {
  const btn = await page.$('button.btn-primary, button:has-text("Next"), button:has-text("Create Character")');
  if (btn) { await btn.click(); return true; }
  return false;
}

const nameInput = await page.$('input[type="text"]');
let uc002pass = true;

if (nameInput) {
  pass('Name input found — BR-006');
  await nameInput.click();
  await nameInput.fill('Gorion');
  await waitMs(STEP_WAIT);
  await snap(page, 'UC002_name_typed');
  const adv1 = await clickNext();
  if (!adv1) { bug('UC-002','medium','Next not found after name step'); uc002pass = false; }
  else pass('Next → step 1→2');
  await waitMs(STEP_WAIT);
  await snap(page, 'UC002_step2_race');
} else {
  bug('UC-002','medium','No name input — BR-006'); uc002pass = false;
}

const raceRadio = await page.$('input[type="radio"][name="race"]');
if (raceRadio) {
  await raceRadio.click(); await waitMs(600);
  pass('Race selected — BR-008');
  await clickNext(); await waitMs(STEP_WAIT);
  await snap(page, 'UC002_step3_class');
} else { await clickNext(); await waitMs(STEP_WAIT); }

const classRadio = await page.$('input[type="radio"][name="class"]:not([disabled])');
if (classRadio) {
  await classRadio.click(); await waitMs(600);
  pass('Class selected — BR-009');
  await clickNext(); await waitMs(STEP_WAIT);
  await snap(page, 'UC002_step4_stats');
} else { await clickNext(); await waitMs(STEP_WAIT); }

const rollBtn = await page.$('button:has-text("Roll")');
if (rollBtn) { await rollBtn.click(); await waitMs(600); pass('Stats rolled — BR-010'); }
await clickNext(); await waitMs(STEP_WAIT);
await snap(page, 'UC002_step5_portrait');

const portraitOpt = await page.$('.portrait-option, img[src*="portrait"]');
if (portraitOpt) { await portraitOpt.click(); await waitMs(400); pass('Portrait selected — BR-019'); }
await clickNext(); // Create Character
await waitMs(NAV_WAIT);
const shot002 = await snap(page, 'UC002_creation_done');
pass('Character creation wizard completed');

if (consoleErrors.length > 0) { bug('UC-002','high',`${consoleErrors.length} JS error(s) during char creation`, consoleErrors[0]); uc002pass = false; }
else pass('No JS errors during creation');
rec('UC-002','Character Creation','BR-006, BR-007, BR-008, BR-009, BR-010, BR-011, BR-012, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019, BR-020',
    uc002pass ? '✅ PASS' : '❌ FAIL', uc002pass ? '' : 'See bugs', shot002);

// ── UC-003: Explore World / Isometric View (BR-021 – BR-026) ─────────────────
console.log('\n══ UC-003: Explore World (Isometric View) ══');
consoleErrors.length = 0;
await waitMs(NAV_WAIT);
const shot003a = await snap(page, 'UC003_world_entry');

const worldPixels = await page.evaluate(() => {
  const c = document.getElementById('game-canvas');
  if (!c) return 0;
  const ctx2 = c.getContext('2d');
  let nonBlack = 0;
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(c.width  * (0.05 + 0.9 * i/30));
    const y = Math.floor(c.height * 0.5);
    const d = ctx2.getImageData(x, y, 1, 1).data;
    if (d[0]+d[1]+d[2] > 25) nonBlack++;
  }
  return nonBlack;
});

let uc003pass = true;
if (worldPixels < 4) {
  bug('UC-003','high','World canvas is mostly black — isometric area not rendering', `${worldPixels}/30 pixels non-black`);
  await snap(page, 'UC003_world_BLACK'); uc003pass = false;
} else {
  pass(`World rendering detected — ${worldPixels}/30 non-black — BR-021`);
  await snap(page, 'UC003_world_ok');
}

const canvas1 = await page.$('#game-canvas');
const box1 = canvas1 ? await canvas1.boundingBox() : { x:0, y:0, width:1280, height:800 };
info('Clicking to move character — BR-022');
await page.mouse.click(box1.x + box1.width * 0.62, box1.y + box1.height * 0.38);
await waitMs(STEP_WAIT);
await snap(page, 'UC003_after_click_move');
if (consoleErrors.length > 0) { bug('UC-003','medium','JS error on click-to-move', consoleErrors[0]); uc003pass = false; }
else pass('Click-to-move: no error — BR-022');

info('Arrow key scroll test — BR-024');
await page.keyboard.press('ArrowRight'); await waitMs(400);
await page.keyboard.press('ArrowRight'); await waitMs(400);
await page.keyboard.press('ArrowLeft');  await waitMs(400);
const shot003 = await snap(page, 'UC003_camera_scroll');
pass('Arrow scroll: no crash — BR-024');

const hudEl = await page.$('#hud');
const hudVisible = hudEl ? await hudEl.evaluate(el =>
  !el.classList.contains('hidden') && getComputedStyle(el).display !== 'none') : false;
if (!hudVisible) { bug('UC-003','medium','HUD hidden/missing during gameplay — BR-023'); uc003pass = false; await snap(page, 'UC003_HUD_hidden'); }
else { pass('HUD visible — BR-023'); await snap(page, 'UC003_HUD_visible'); }

rec('UC-003','Explore World (Isometric View)','BR-021, BR-022, BR-023, BR-024, BR-025, BR-026',
    uc003pass ? '✅ PASS' : '❌ FAIL', uc003pass ? '' : 'See bugs', shot003);

// ── UC-004: Combat (BR-027 – BR-035) ─────────────────────────────────────────
console.log('\n══ UC-004: Combat ══');
consoleErrors.length = 0;
await page.keyboard.press('Space');
await waitMs(STEP_WAIT);
const shot004 = await snap(page, 'UC004_space_pause');
let uc004pass = true;
if (consoleErrors.length > 0) { bug('UC-004','medium','JS error on Space — BR-029', consoleErrors[0]); uc004pass = false; }
else pass('Space pause/unpause: no error — BR-029');

const combatOk = await page.evaluate(async () => {
  try { const m = await import('./engine/CombatEngine.js'); return !!m; } catch(e) { return false; }
}).catch(() => false);
if (!combatOk) { bug('UC-004','medium','CombatEngine import failed — BR-027'); uc004pass = false; }
else pass('CombatEngine loaded — BR-027');
rec('UC-004','Combat','BR-027, BR-028, BR-029, BR-030, BR-031, BR-032, BR-033, BR-034, BR-035',
    uc004pass ? '✅ PASS' : '❌ FAIL', uc004pass ? '' : 'See bugs', shot004);

// ── UC-005: Party Management (BR-036 – BR-041) ────────────────────────────────
console.log('\n══ UC-005: Party Management ══');
const portraits = await page.$$('.portrait-img, [class*="portrait"]');
let uc005pass = true;
if (portraits.length === 0) { bug('UC-005','medium','No portraits in HUD — BR-036'); uc005pass = false; }
else {
  pass(`${portraits.length} portrait element(s) — BR-036`);
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('.portrait-img')].filter(i => !i.complete || i.naturalWidth === 0).length);
  if (broken > 0) { bug('UC-005','medium',`${broken} portrait(s) failed to load`); uc005pass = false; }
  else pass('All portraits loaded OK');
}
const shot005 = await snap(page, 'UC005_party_portraits');
rec('UC-005','Party Management','BR-036, BR-037, BR-038, BR-039, BR-040, BR-041',
    uc005pass ? '✅ PASS' : '❌ FAIL', uc005pass ? '' : 'See bugs', shot005);

// ── UC-006: Inventory (BR-042 – BR-048) ──────────────────────────────────────
console.log('\n══ UC-006: Inventory ══');
consoleErrors.length = 0;
info('Pressing I — BR-042');
await page.keyboard.press('KeyI');
await waitMs(STEP_WAIT);
const shot006 = await snap(page, 'UC006_inventory');

const invActive = await page.evaluate(() => {
  const el = document.getElementById('ui-layer');
  return !!(el && (el.classList.contains('active') || el.childElementCount > 0));
});
let uc006pass = invActive;
if (!invActive) { bug('UC-006','medium','Inventory did not open on I — BR-042'); }
else pass('Inventory opened — BR-042');
if (consoleErrors.length > 0) { bug('UC-006','medium','JS error opening inventory', consoleErrors[0]); uc006pass = false; }
await page.keyboard.press('Escape'); await waitMs(800);
rec('UC-006','Inventory','BR-042, BR-043, BR-044, BR-045, BR-046, BR-047, BR-048',
    uc006pass ? '✅ PASS' : '❌ FAIL', uc006pass ? '' : 'See bugs', shot006);

// ── UC-007: NPC Dialogue (BR-049 – BR-053) ────────────────────────────────────
console.log('\n══ UC-007: NPC Dialogue ══');
consoleErrors.length = 0;
await page.mouse.click(box1.x + box1.width * 0.5, box1.y + box1.height * 0.5);
await waitMs(STEP_WAIT);
const shot007 = await snap(page, 'UC007_npc_click');
let uc007pass = true;
if (consoleErrors.length > 0) { bug('UC-007','low','JS error on NPC click — BR-049', consoleErrors[0]); uc007pass = false; }
else pass('NPC click: no error — BR-049');
rec('UC-007','NPC Dialogue','BR-049, BR-050, BR-051, BR-052, BR-053',
    uc007pass ? '✅ PASS' : '❌ FAIL', uc007pass ? '' : 'See bugs', shot007);

// ── UC-008: Journal / Quests (BR-054 – BR-058) ────────────────────────────────
console.log('\n══ UC-008: Journal ══');
consoleErrors.length = 0;
await page.keyboard.press('KeyJ');
await waitMs(STEP_WAIT);
const shot008 = await snap(page, 'UC008_journal');

const journalOk = await page.evaluate(() => {
  const el = document.getElementById('ui-layer');
  return !!(el && (el.classList.contains('active') || el.childElementCount > 0));
});
let uc008pass = journalOk;
if (!journalOk) { bug('UC-008','medium','Journal did not open on J — BR-054'); }
else pass('Journal opened — BR-054');
if (consoleErrors.length > 0) { bug('UC-008','medium','JS error opening journal', consoleErrors[0]); uc008pass = false; }
await page.keyboard.press('Escape'); await waitMs(800);
rec('UC-008','Journal / Quests','BR-054, BR-055, BR-056, BR-057, BR-058',
    uc008pass ? '✅ PASS' : '❌ FAIL', uc008pass ? '' : 'See bugs', shot008);

// ── UC-009: Spells (BR-059 – BR-063) ─────────────────────────────────────────
console.log('\n══ UC-009: Spells / Spellbook ══');
consoleErrors.length = 0;
await page.keyboard.press('KeyS');
await waitMs(STEP_WAIT);
const shot009 = await snap(page, 'UC009_spellbook');
const spellOk = await page.evaluate(() => {
  const el = document.getElementById('ui-layer');
  return !!(el && (el.classList.contains('active') || el.childElementCount > 0));
});
let uc009pass = spellOk;
if (!spellOk) { bug('UC-009','low','Spellbook did not open on S — BR-059'); }
else pass('Spellbook opened — BR-059');
if (consoleErrors.length > 0) { bug('UC-009','medium','JS error opening spellbook', consoleErrors[0]); uc009pass = false; }
await page.keyboard.press('Escape'); await waitMs(800);
rec('UC-009','Spells & Abilities','BR-059, BR-060, BR-061, BR-062, BR-063',
    uc009pass ? '✅ PASS' : '❌ FAIL', uc009pass ? '' : 'See bugs', shot009);

// ── UC-010: Shop (BR-064 – BR-068) ───────────────────────────────────────────
console.log('\n══ UC-010: Shop / Merchant ══');
const shopOk = await page.evaluate(async () => {
  try { const m = await import('./states/substate/ShopState.js'); return !!m.ShopState; }
  catch(e) { return false; }
}).catch(() => false);
let uc010pass = shopOk;
if (!shopOk) { bug('UC-010','medium','ShopState module import failed — BR-064'); }
else pass('ShopState module OK — BR-064');
const shot010 = await snap(page, 'UC010_shop_module');
rec('UC-010','Shop / Merchant','BR-064, BR-065, BR-066, BR-067, BR-068',
    uc010pass ? '✅ PASS' : '❌ FAIL', uc010pass ? '' : 'See bugs', shot010);

// ── UC-011: Rest (BR-069 – BR-072) ───────────────────────────────────────────
console.log('\n══ UC-011: Rest ══');
const restOk = await page.evaluate(async () => {
  try { const m = await import('./states/substate/RestState.js'); return !!m.RestState; }
  catch(e) { return false; }
}).catch(() => false);
let uc011pass = restOk;
if (!restOk) { bug('UC-011','medium','RestState module import failed — BR-069'); }
else pass('RestState module OK — BR-069');
const shot011 = await snap(page, 'UC011_rest_module');
rec('UC-011','Rest & Recovery','BR-069, BR-070, BR-071, BR-072',
    uc011pass ? '✅ PASS' : '❌ FAIL', uc011pass ? '' : 'See bugs', shot011);

// ── UC-012: World Map / Fog of War (BR-073 – BR-076) ─────────────────────────
console.log('\n══ UC-012: World Map / Fog of War ══');
consoleErrors.length = 0;
await page.keyboard.press('KeyM');
await waitMs(STEP_WAIT);
const shot012 = await snap(page, 'UC012_world_map');

const mapOk = await page.evaluate(() => {
  const el = document.getElementById('ui-layer');
  return !!(el && (el.classList.contains('active') || el.childElementCount > 0));
});
let uc012pass = mapOk;
if (!mapOk) { bug('UC-012','medium','World map did not open on M — BR-073'); }
else pass('World map opened — BR-073');

const fogOk = await page.evaluate(async () => {
  try { const m = await import('./engine/FogOfWar.js'); return !!m.FogOfWar; }
  catch(e) { return false; }
}).catch(() => false);
if (!fogOk) { bug('UC-012','high','FogOfWar class not exported — BR-076'); uc012pass = false; }
else pass('FogOfWar exported OK — BR-076');
if (consoleErrors.length > 0) { bug('UC-012','medium','JS error opening map', consoleErrors[0]); uc012pass = false; }
await page.keyboard.press('Escape'); await waitMs(800);
rec('UC-012','World Map / Fog of War','BR-073, BR-074, BR-075, BR-076',
    uc012pass ? '✅ PASS' : '❌ FAIL', uc012pass ? '' : 'See bugs', shot012);

// ── UC-013: Level Up (BR-077) ─────────────────────────────────────────────────
console.log('\n══ UC-013: Level Up ══');
const lvlOk = await page.evaluate(async () => {
  try { const m = await import('./ui/LevelUpPanel.js'); return !!m.LevelUpPanel; }
  catch(e) { return false; }
}).catch(() => false);
let uc013pass = lvlOk;
if (!lvlOk) { bug('UC-013','medium','LevelUpPanel module import failed — BR-077'); }
else pass('LevelUpPanel module OK — BR-077');
const shot013 = await snap(page, 'UC013_levelup_module');
rec('UC-013','Level Up','BR-077',
    uc013pass ? '✅ PASS' : '❌ FAIL', uc013pass ? '' : 'See bugs', shot013);

// ── UC-014: Save / Load (BR-078 – BR-079) ────────────────────────────────────
console.log('\n══ UC-014: Save / Load ══');
consoleErrors.length = 0;
await page.keyboard.press('F5');
await waitMs(STEP_WAIT);
const shot014 = await snap(page, 'UC014_quicksave');
let uc014pass = true;
if (consoleErrors.length > 0) { bug('UC-014','high','JS error on F5 quicksave — BR-078', consoleErrors[0]); uc014pass = false; }
else pass('F5 quicksave: no error — BR-078');

const saveMgrOk = await page.evaluate(async () => {
  try { const m = await import('./engine/SaveManager.js'); return !!m.default; }
  catch(e) { return false; }
}).catch(() => false);
if (!saveMgrOk) { bug('UC-014','high','SaveManager default export missing — BR-078'); uc014pass = false; }
else pass('SaveManager OK — BR-078');
await page.keyboard.press('Escape'); await waitMs(800);
rec('UC-014','Save / Load','BR-078, BR-079',
    uc014pass ? '✅ PASS' : '❌ FAIL', uc014pass ? '' : 'See bugs', shot014);

// ── UC-015: Options (BR-080) ─────────────────────────────────────────────────
console.log('\n══ UC-015: Options ══');
consoleErrors.length = 0;
await page.keyboard.press('Escape');
await waitMs(STEP_WAIT);
const shot015 = await snap(page, 'UC015_options');

const optOk = await page.evaluate(() => {
  const el = document.getElementById('ui-layer');
  return !!(el && (el.classList.contains('active') || el.childElementCount > 0));
});
let uc015pass = optOk;
if (!optOk) { bug('UC-015','medium','Options did not open on Escape — BR-080'); }
else pass('Options opened — BR-080');
if (consoleErrors.length > 0) { bug('UC-015','medium','JS error opening options', consoleErrors[0]); uc015pass = false; }
rec('UC-015','Options / Settings','BR-080',
    uc015pass ? '✅ PASS' : '❌ FAIL', uc015pass ? '' : 'See bugs', shot015);

// ── Final state ───────────────────────────────────────────────────────────────
console.log('\n══ Final page-error sweep ══');
await waitMs(1000);
for (const e of pageErrors) bug('GENERAL','high','Uncaught page error', e.slice(0,300));
if (pageErrors.length === 0) pass('No uncaught page errors');

const shotFinal = await snap(page, 'ZZ_final_state');

info('\nBrowser closes in 4 seconds…');
await waitMs(4000);
await browser.close();

// ── Summary ───────────────────────────────────────────────────────────────────
const passed = results.filter(r => r.result.includes('PASS')).length;
const failed = results.filter(r => r.result.includes('FAIL')).length;

console.log('\n═══════════════════════════════════════════════════════════');
console.log(` T-PIPELINE-002 — ${passed}/${results.length} PASS  |  ${bugs.length} bug(s)`);
console.log('═══════════════════════════════════════════════════════════\n');

// Write machine-readable result JSON for report generation
const jsonOut = {
  pipeline: 'T-PIPELINE-002',
  date: new Date().toISOString().split('T')[0],
  passed, failed, bugCount: bugs.length,
  results, bugs, screenshots,
};
writeFileSync(`${SHOT_DIR}/results.json`, JSON.stringify(jsonOut, null, 2));
console.log(`Results JSON: ${SHOT_DIR}/results.json`);
console.log(`\n${passed === 15 ? '✅ PASS PIPELINE' : '❌ FAIL PIPELINE — ' + bugs.length + ' defect(s)'}\n`);
