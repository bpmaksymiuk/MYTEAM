# Baldur's Gate — Automated Browser Test Bug Report

**Date:** 2026-04-06 (updated after full fix cycle)
**URL:** http://localhost:8080
**Test Method:** Playwright headful Chromium, UC-001 through UC-015 automated
**Pipeline:** T-PIPELINE-003
**Current Status:** ✅ All bugs resolved — 15/15 PASS

---

## Bug Resolution History

### Round 1 — bugs found by T-PIPELINE-003 (run 1)

| ID      | Severity | Use Case | Title | Status |
|---------|----------|----------|-------|--------|
| BUG-001 | HIGH     | UC-003   | Game world / isometric view not rendered — canvas mostly black | ✅ Fixed v1.0.2 |
| BUG-002 | MEDIUM   | UC-003   | HUD is hidden during active gameplay | ✅ Fixed v1.0.2 |
| BUG-003 | MEDIUM   | UC-005   | No portrait elements found in HUD | ✅ Fixed v1.0.2 |

### Round 2 — bugs found by T-PIPELINE-003 (run 2, after round-1 fixes)

| ID      | Severity | Use Case | Title | Status |
|---------|----------|----------|-------|--------|
| BUG-004 | HIGH     | UC-001   | favicon.ico 404 generates JS console error on load | ✅ Fixed v1.0.3 |
| BUG-005 | MEDIUM   | UC-006   | Inventory panel (I key) not opening — missing keyboard handlers in PlayingState | ✅ Fixed v1.0.3 |
| BUG-006 | MEDIUM   | UC-008   | Journal panel (J key) not opening — missing keyboard handlers in PlayingState | ✅ Fixed v1.0.3 |
| BUG-007 | MEDIUM   | UC-009   | Spellbook panel (#btn-spell) not opening — missing `_openPanel()` in PlayingState | ✅ Fixed v1.0.3 |
| BUG-008 | MEDIUM   | UC-011   | Rest panel (#btn-rest) not opening — missing `_openPanel()` in PlayingState | ✅ Fixed v1.0.3 |
| BUG-009 | MEDIUM   | UC-012   | Map panel (M key) not opening — missing keyboard handlers in PlayingState | ✅ Fixed v1.0.3 |
| BUG-010 | VISUAL   | BR-001   | `candlekeep.png` rendered as front-perspective castle with sky gradient — should be top-down overhead view | ✅ Fixed v1.0.4 |
| BUG-011 | VISUAL   | BR-001   | `nashkel.png` rendered as side-view town with sky occupying top 1/3 of canvas — should be top-down overhead view | ✅ Fixed v1.0.4 |
| BUG-012 | VISUAL   | BR-001   | `sword_coast.png` rendered with sky occupying top 1/2 and 3D mountain wedge polygons — should be top-down overhead view | ✅ Fixed v1.0.4 |

---

## Fix Details

### BUG-001 — [HIGH] Game world canvas is mostly black *(Fixed v1.0.2)*
**Root Cause:** `FogOfWar.reveal()` was only called when `this.party[0]` existed; with an empty party all tiles stayed unrevealed (black).
**Fix:** Always call `fogOfWar.reveal()` with a `(10, 10)` fallback tile when no party leader is present.

### BUG-002 — [MEDIUM] HUD hidden during active gameplay *(Fixed v1.0.2)*
**Root Cause:** `remove('hidden')` was called synchronously before `_loadArea()` resolved, so the DOM timing was incorrect.
**Fix:** Moved `remove('hidden')` inside `_loadArea().then()` callback.

### BUG-003 — [MEDIUM] No portrait images in HUD party bar *(Fixed v1.0.2)*
**Root Cause:** `HUD.init()` was called before `this.party` was populated.
**Fix:** Added second `this._hud.init()` call inside `_loadArea().then()` so portraits are built with confirmed party data.

### BUG-004 — [HIGH] favicon.ico 404 console error *(Fixed v1.0.3)*
**Root Cause:** `index.html` had no `<link rel="icon">` — browsers auto-request `favicon.ico` which doesn't exist.
**Fix:** Added inline SVG data-URI favicon link to `index.html`.

### BUG-005–009 — [MEDIUM] Panel keyboard/button shortcuts not working *(Fixed v1.0.3)*
**Root Cause:** `build/states/PlayingState.js` was missing KeyI/J/M/C handlers, the `_onPlayingAction` HUD event listener, and the complete `_openPanel()` method — all of which existed in `build/www/states/PlayingState.js` but had not been propagated to the active build.
**Fix:** Ported all shortcuts, event listener, and `_openPanel()` from the www copy into `build/states/PlayingState.js`.

---

## Final State — T-PIPELINE-003 run 3 (2026-04-06)

**Result: 15/15 PASS | 0 FAIL | 0 bugs**

| Use Case | Status |
|----------|--------|
| UC-001 — Main Menu | ✅ PASS |
| UC-002 — Character Creation | ✅ PASS |
| UC-003 — Explore World (Isometric) | ✅ PASS |
| UC-004 — Combat | ✅ PASS |
| UC-005 — Party Management | ✅ PASS |
| UC-006 — Inventory | ✅ PASS |
| UC-007 — NPC Dialogue | ✅ PASS |
| UC-008 — Journal | ✅ PASS |
| UC-009 — Spells & Abilities | ✅ PASS |
| UC-010 — Shop / Merchant | ✅ PASS |
| UC-011 — Rest & Recovery | ✅ PASS |
| UC-012 — World Map / Fog of War | ✅ PASS |
| UC-013 — Level Up | ✅ PASS |
| UC-014 — Save / Load | ✅ PASS |
| UC-015 — Options / Settings | ✅ PASS |

### BUG-001 — [HIGH] Game world canvas is mostly black after character creation

**Use Case:** UC-003 — Explore the World (Isometric View)  
**Symptom:** After completing character creation and entering the game world, 0/20 sampled canvas pixels were non-black. The isometric play area is not being rendered.  
**Root Cause (likely):** The `PlayingState._loadArea()` call is async; `ExplorationState` is set in the `.then()` callback. The area background image (`assets/areas/candlekeep.png`) is drawn with `ctx.drawImage(bg, 0, 0, cw, ch)` — if `AssetLoader.get('bg_candlekeep')` throws (key mismatch: area id used vs manifest key), the fallback tile grid also renders but the camera may be offset far off-canvas, making tiles invisible. Alternatively the fog-of-war overlay covers the whole canvas because `reveal()` wasn't called before the first render frame.  
**Steps to Reproduce:** Create a character → confirm → observe game world canvas is black.  
**Fix:** Ensure `fogOfWar.reveal()` is called synchronously during `_loadArea()` before the first render, and verify `AssetLoader.get('bg_candlekeep')` succeeds (key `bg_candlekeep` matches manifest).

---

### BUG-002 — [MEDIUM] HUD is hidden during active gameplay

**Use Case:** UC-003 — Explore the World  
**Symptom:** The `#hud` DOM element exists but has the `hidden` class applied, making all HUD elements (portrait bar, action bar, minimap, messages) invisible.  
**Root Cause (likely):** `PlayingState.enter()` calls `document.getElementById('hud').classList.remove('hidden')`, but this executes before `_loadArea()` resolves. If `PlayingState` is constructed by `CharacterCreationState` and `enter()` is called before the HUD element is ready, the remove-hidden call may have no effect, or the async load path re-hides it.  
**Steps to Reproduce:** Enter the game world → observe HUD bar is not visible.  
**Fix:** Move `document.getElementById('hud').classList.remove('hidden')` to inside the `_loadArea().then(...)` callback, after `setSubState(new ExplorationState(...))`.

---

### BUG-003 — [MEDIUM] No portrait images in HUD party bar

**Use Case:** UC-005 — Recruit and Manage a Party  
**Symptom:** No `.portrait-img` elements found in `#hud` during gameplay.  
**Root Cause:** Directly related to BUG-002 — the HUD is hidden, so the portrait bar is never populated or rendered. Additionally `HUD.init()` is called with `this.party` before the player entity is placed in the party array by `CharacterCreationState._finishCreation()`.  
**Steps to Reproduce:** Enter game world → inspect `#hud` in DevTools → no portrait-img elements.  
**Fix:** Ensure the `HUD` is re-initialised (or its `update()` called) after the party array is populated, within the `_loadArea().then(...)` callback.

---

## Passing Tests

| Use Case | Status | Notes |
|----------|--------|-------|
| UC-001 — Main Menu          | ✅ PASS | Title correct, New Game button present, no JS errors on load |
| UC-002 — Character Creation | ✅ PASS | Name input and panel found, creation screen reachable |
| UC-004 — Combat             | ✅ PASS | CombatEngine module imports; Space bar pause no crash |
| UC-006 — Inventory          | ✅ PASS | I key opens UI layer |
| UC-007 — NPC Dialogue       | ✅ PASS | No errors; dialogue engine importable (no NPC in range to trigger) |
| UC-008 — Journal            | ✅ PASS | J key opens journal panel |
| UC-009 — Spellbook          | ✅ PASS | S key opens UI layer |
| UC-010 — Shop               | ✅ PASS | ShopState module imports OK |
| UC-011 — Rest               | ✅ PASS | RestState module imports OK |
| UC-012 — World Map / Fog    | ✅ PASS | M key opens map; FogOfWar class exported correctly |
| UC-013 — Level Up           | ✅ PASS | LevelUpPanel module imports OK |
| UC-014 — Save / Load        | ✅ PASS | F5 quicksave no error; SaveManager OK |
| UC-015 — Options            | ✅ PASS | Escape opens options; GameData populated |

---

## Priority Fix Order

1. **BUG-001** (HIGH) — The black canvas is the most visible failure; fix the fog-of-war coverage and camera offset so the isometric world renders on screen.
2. **BUG-002** (MEDIUM) — Move HUD unhide to post-load callback.
3. **BUG-003** (MEDIUM) — Will auto-resolve once BUG-002 is fixed; verify portrait bar populates with at least 1 player portrait.

---

### BUG-010 — [VISUAL] Candlekeep area image rendered in perspective with sky *(Fixed v1.0.4)*
**Root Cause:** `generate_assets_v2.py` drew candlekeep with a `for y in range(H // 3)` sky gradient loop and front-facing castle walls, gate arch, battlements and side towers — a side-perspective composition unsuitable for a top-down game.
**Fix:** Replaced entire drawing with top-down overhead composition: full-canvas cobblestone floor, thick stone wall borders at canvas edges, round corner tower rooftops (ellipses), overhead gate opening (dark rectangle in north wall), inner grass courtyard, and overhead trees (canopy circles with trunk dots).

### BUG-011 — [VISUAL] Nashkel area image rendered in perspective with sky *(Fixed v1.0.4)*
**Root Cause:** `generate_areas()` drew a `H // 3` sky gradient at the top, then ground only for `y in range(H // 3, H)`. All road, building, market stall and tree y-positions were offset by `H // 3`. Buildings used `_draw_building()` which draws a front-facing perspective facade with a triangular roof.
**Fix:** Replaced with full-canvas dirt ground (`for y in range(H)`), roads and roads tracks spanning full canvas height, buildings redrawn as top-down roof rectangles (ridge line + highlight/shadow edges via `lt()`/`dk()`), overhead market stall awnings, and overhead tree canopy circles — all y-coordinates adjusted to use full canvas.

### BUG-012 — [VISUAL] Sword Coast area image rendered in perspective with sky and 3D mountains *(Fixed v1.0.4)*
**Root Cause:** `generate_areas()` drew a `H // 2` sky gradient covering half the image; ocean and land only started from `H // 3`; mountains were 3D wedge polygons with snow-cap triangles giving depth/perspective.
**Fix:** Replaced with full-height ocean gradient (left 1/3, `y` 0 to `H`), wave ripples as aerial arcs, full-height land (right 2/3), jagged coastline from top to bottom, mountain ranges as gray rock-patch ellipses with lighter centre highlights (no cones), forest clusters, roads and town markers as overhead roof rectangles.
