# Implementation Release Notes

**Project:** Baldur's Gate (Recreation)
**Stage:** 5 — Implementation
**Version:** 1.0.1

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
