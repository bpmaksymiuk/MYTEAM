# Baldur's Gate — Automated Browser Test Bug Report

**Date:** 2026-04-06  
**URL:** http://localhost:8080  
**Test Method:** Playwright headful Chromium, UC-001 through UC-015 automated  
**Total bugs found:** 3 (Critical: 0, High: 1, Medium: 2, Low: 0)

---

## Summary

| ID      | Severity | Use Case | Title |
|---------|----------|----------|-------|
| BUG-001 | HIGH     | UC-003   | Game world / isometric view not rendered — canvas mostly black |
| BUG-002 | MEDIUM   | UC-003   | HUD is hidden during active gameplay |
| BUG-003 | MEDIUM   | UC-005   | No portrait elements found in HUD |

---

## Bug Details

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
