# Implementation Release Notes

**Project:** Baldur's Gate (Recreation)
**Stage:** 5 — Implementation
**Version:** 1.0.4

---

## v1.0.4 — 2026-04-06

**Summary:** Area background images redrawn as pure top-down overhead views; all sky gradients and perspective elements removed.

**Files changed:**
- `/tmp/generate_assets_v2.py`
  - **BUG-010 (VISUAL)** — `candlekeep.png`: Replaced front-perspective sky gradient + castle walls/gate/battlements/towers with full-canvas cobblestone ground, thick overhead wall borders, round corner tower rooftops (circles), gate as overhead doorway, inner grass courtyard and trees viewed from directly above.
  - **BUG-011 (VISUAL)** — `nashkel.png`: Replaced warm-afternoon sky gradient with full-canvas dirt ground; repositioned all road/building y-coordinates to span full canvas (removed `H // 3` offset); replaced perspective building facades with top-down roof rectangles; market stalls and trees drawn as overhead shapes.
  - **BUG-012 (VISUAL)** — `sword_coast.png`: Replaced half-canvas sky with full-height ocean (left 1/3) and land (right 2/3) spanning the entire image; replaced 3D mountain wedge polygons with gray rock-patch ellipses seen from above; forest and town marker buildings all drawn overhead.
- `build/assets/areas/` and `build/www/assets/areas/` — regenerated `candlekeep.png`, `nashkel.png`, `sword_coast.png`

**Design Reference:** All gameplay area backgrounds must be top-down overhead views (no sky, no horizon, no perspective).

**Business Requirements:** BR-001 (game world authenticity)

---

## v1.0.3 — 2026-04-06

**Summary:** Six bugs found by T-PIPELINE-003 (run 2) fixed. Pipeline now runs 15/15 PASS.

**Files changed:**
- `build/index.html`
  - **BUG-004 (HIGH)** — Added inline SVG data-URI `<link rel="icon">` to eliminate the `favicon.ico` 404 browser console error.
- `build/states/PlayingState.js`
  - **BUG-005–009 (MEDIUM)** — Added missing keyboard shortcut handlers (KeyI → inventory, KeyJ → journal, KeyM → map, KeyC → character) inside `_onKeyDown`, added `_onPlayingAction` event listener for HUD button events (`btn-spell`, `btn-rest`, etc.), added complete `_openPanel(type)` method, and added `removeEventListener` for `playing:action` in `exit()`.

**Use Cases fixed:** UC-001, UC-006, UC-008, UC-009, UC-011, UC-012
**Business Requirements:** BR-001, BR-042, BR-054, BR-059, BR-069, BR-073

---

## v1.0.2 — 2026-04-06

**Summary:** Three bugs found by automated browser testing (7-BUG-REPORT.md) fixed in `PlayingState.js`.

**Files changed:**
- `build/states/PlayingState.js`
  - **BUG-001 (HIGH)** — `_loadArea()`: `FogOfWar.reveal()` was only called when `this.party[0]` existed; canvas was entirely black when party was empty or entity creation failed. Fixed by always revealing tiles around a start position, falling back to `(10, 10)` when no party leader is present.
  - **BUG-002 (MEDIUM)** — `enter()`: `document.getElementById('hud').classList.remove('hidden')` was executed synchronously before `_loadArea()` resolved. Moved this call inside the `_loadArea().then()` callback so the HUD is guaranteed visible only once the area has fully loaded.
  - **BUG-003 (MEDIUM)** — `enter()`: HUD portrait bar was built with `this.party` before the area loaded and the party array was confirmed. Added `this._hud.init()` call inside `_loadArea().then()` so portraits are rebuilt with confirmed party data after load completes.

**Use Cases affected:** UC-003 (Explore World), UC-005 (Party Management)
**Business Requirements:** BR-021 – BR-026, BR-036 – BR-041

---

## v1.0.1 — 2026-04-05

**Summary:** Bug fix identified by T-PIPELINE-003. World map panel now correctly uses `MapState.js` instead of an inline stub.

**Files changed:**
- `build/www/states/PlayingState.js` — `_openPanel('map')` replaced inline `div` implementation with `import('./substate/MapState.js')`, creating a proper `#map-panel` with "World Map" and "Local Map" buttons and a minimap canvas.

**Use Cases implemented:** UC-012 (World Map / Fog of War)
**Business Requirements:** BR-073, BR-074, BR-075
**Architecture Decisions applied:** Existing MapState.js already implemented per design; wiring corrected.

**Version:** 1.0.0
**Date:** 2026-04-05

---

## Overview

Stage 5 (Developer) is complete. All files specified in `4-DESIGN-INSTRUCTIONS.md` (DI-001 – DI-042) have been implemented. The game now has a complete, runnable codebase under `build/`.

---

## Files Created This Release

### Shell / Entry
| File | Design Ref | Description |
|------|-----------|-------------|
| `build/index.html` | DI-001 | Game shell with canvas, HUD overlay, UI layer, module script entry |
| `build/index.css` | DI-001 | Full-viewport canvas layout, CSS custom properties, panel/button/tab base classes |
| `build/main.js` | DI-002 | Parallel JSON data loading, singleton init, asset loading with progress bar, game loop |
| `build/StateManager.js` | DI-003 | Finite state machine: setState, update, render, onResize |

### Missing Engine Files
| File | Design Ref | Description |
|------|-----------|-------------|
| `build/engine/SettingsManager.js` | DI-025 | localStorage-backed settings with defaults and live merge |
| `build/engine/AssetLoader.js` | DI-026 | Manifest-driven image/audio loader with 404 fallbacks |
| `build/engine/AudioManager.js` | DI-027 | Web Audio API manager with crossfade music, SFX playback, volume gains |

### States
| File | Design Ref | Description |
|------|-----------|-------------|
| `build/states/MainMenuState.js` | DI-004 | Title screen with New/Load/Options/Quit buttons |
| `build/states/CharacterCreationState.js` | DI-005 | 5-step wizard: Name → Race → Class → Ability Scores → Portrait |
| `build/states/PlayingState.js` | DI-006 | Root game state: area loading, fog of war, party, quick save/load (F5/F9) |
| `build/states/LoadScreenState.js` | — | Slot list from SaveManager; click to restore PlayingState |
| `build/states/SaveScreenState.js` | — | Slot list + text input; writes to SaveManager |

### Substates
| File | Design Ref | Description |
|------|-----------|-------------|
| `build/states/substate/ExplorationState.js` | DI-007 | Mouse-driven movement via PathFinder, entity hover, fog reveal, minimap tick |
| `build/states/substate/CombatState.js` | DI-008 | Pause-toggleable RTwP loop, action queues, CombatEngine resolution, AI dispatch |
| `build/states/substate/DialogueState.js` | DI-009 | DialogueEngine-driven node/response panel with condition filtering |
| `build/states/substate/InventoryState.js` | DI-010 | Drag-and-drop equipment slots and bag grid with weight tracking |
| `build/states/substate/ShopState.js` | DI-011 | Buy/sell/identify with charisma sell modifier |
| `build/states/substate/JournalState.js` | DI-012 | Tabbed active/completed/failed quest viewer |
| `build/states/substate/MapState.js` | DI-013 | World map with travel/encounter roll + local fog-of-war minimap |
| `build/states/substate/RestState.js` | DI-014 | Watch assignment, HP/spell restoration, encounter interrupt chance |
| `build/states/substate/OptionsState.js` | DI-015 | Volume sliders, difficulty/subtitles/scroll-speed selectors, live SettingsManager sync |

### UI
| File | Design Ref | Description |
|------|-----------|-------------|
| `build/ui/HUD.js` | DI-028 | Portrait bar, HP bars, action bar, minimap canvas, PAUSED indicator, status flash messages |
| `build/ui/SpellbookPanel.js` | DI-029 | Spell level accordion with memorisation slot drag-and-drop |
| `build/ui/LevelUpPanel.js` | DI-030 | Level-up panel with HP roll animation, new spell slots, thief skill allocation |

### Renderer
| File | Design Ref | Description |
|------|-----------|-------------|
| `build/renderer/AreaRenderer.js` | DI-031 | Full-frame pipeline: clear → background → ground items → depth-sorted entities → FoW overlay |
| `build/renderer/SpriteAnimation.js` | DI-032 | 8-directional spritesheet animation with coloured rectangle fallback |

---

## Files Pre-Existing (Stage 4 carry-over, not modified)

**Engine:** `CombatEngine.js`, `DialogueEngine.js`, `QuestEngine.js`, `PathFinder.js`, `AIController.js`, `CharacterFactory.js`, `IsoMath.js`, `FogOfWar.js`, `SaveManager.js`

**Data:** `races.json`, `classes.json`, `spells.json`, `items.json`, `areas.json`, `dialogue.json`, `quests.json`, `companions.json`, `encounters.json`

---

## Architecture Highlights

- **ES Modules throughout** — all files use `import`/`export`; no CommonJS.
- **`window.GameData`** — frozen object holding all JSON data, set once in `main.js`, read-only everywhere else.
- **State lifecycle** — `enter()` / `exit()` strictly own DOM panels they create; no leaked event listeners.
- **Asset fallbacks** — missing image assets render as coloured rectangles; missing audio plays silent buffers. Game runs without any actual asset files.
- **Security** — no `innerHTML` with dynamic content; all user-facing text set via `textContent`; IndexedDB (not cookies) for save data; no external network requests.

---

## Known Limitations (v1.0.0)

- Collision maps are loaded as image URLs but parsed as flat arrays; true tile-level collision detection requires real collision map assets or procedural generation (post v1.0).
- Spritesheet animation requires real sprite assets; placeholder rectangles are used until art is provided.
- Audio crossfade requires actual audio files; the AudioContext is created but muted gracefully without them.
- LoadScreenState / SaveScreenState are functional but minimal in styling (no theming beyond base CSS).
