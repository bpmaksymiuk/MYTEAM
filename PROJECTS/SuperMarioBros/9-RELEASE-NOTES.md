# Release Notes

## SMB-REL-2026-04-28-002

**Release ID:** SMB-REL-2026-04-28-002
**Date:** 2026-04-28
**Stage:** 9 + bug-fix rerun

### Summary

Applied post-Stage-10 runtime remediation to resolve Phaser bootstrap failure and unblock full verification rerun.

### Changed Files

- build/vendor/phaser.min.js (replace placeholder with official Phaser 3.90.0 minified bundle)
- build/index.html (CSP adjusted for Phaser loader compatibility while keeping same-origin restrictions)
- build/main.js (expose game handle for deterministic verification harness)
- build/scenes/BootScene.js (tileset loader compatibility adjustment)
- build/levels/level-01.json .. build/levels/level-08.json (regenerated valid tilemap structures)
- build/audio/*.ogg and build/audio/*.mp3 (replace zero-byte placeholders with generated valid media)
- build/assets-manifest.json (source metadata updated for generated local audio)

### Design Decisions Applied

- Kept vendor-local Phaser policy (no CDN) while using an official local package source.
- Preserved strict CSP intent but allowed the minimum directives required by Phaser asset internals (`connect-src 'self'`, `img-src ... blob:`).
- Regenerated levels with consistent schema to avoid Phaser tilemap parser runtime faults.

### Use Cases Implemented / Updated

- UC-001 startup/menu path restored
- UC-006 and UC-007 transition flows revalidated after runtime fix
- UC-010 audio runtime behavior restored with valid local media files

### Browser Requirements Covered

- Same-origin only script/style/media/connect policy retained.
- No external network endpoints introduced.

### Implementation Caveats

- Non-blocking warnings remain for some tileset frame references tied to question/hidden block visuals.
- Special platform variant behavior still requires deeper scripted traversal verification.

### Notes

This release is tied to Stage 10 rerun `T-PIPELINE-SMB-002`, which cleared prior blocking defect BUG-SMB-001.

---

## SMB-REL-2026-04-28-001

**Release ID:** SMB-REL-2026-04-28-001
**Date:** 2026-04-28
**Stage:** 9 — Implementation

### Summary

Implemented the Stage 9 browser game baseline under build with scene flow, gameplay entities, level loading, persistence, audio integration hooks, eight level JSON files, and complete build asset manifest coverage from DI-001 through DI-020.

### Changed Files

- build/index.html (DI-001, DI-020)
- build/main.js (DI-001, DI-002)
- build/config.js (DI-002)
- build/vendor/phaser.min.js (DI-001)
- build/scenes/BootScene.js (DI-003)
- build/scenes/MenuScene.js (DI-004)
- build/scenes/GameScene.js (DI-005)
- build/scenes/HUDScene.js (DI-010)
- build/scenes/PauseScene.js (DI-011)
- build/scenes/LevelCompleteScene.js (DI-012)
- build/scenes/GameOverScene.js (DI-013)
- build/entities/PlayerEntity.js (DI-006, DI-007)
- build/entities/GoombaEntity.js (DI-008)
- build/entities/KoopaEntity.js (DI-008)
- build/entities/KoopaShell.js (DI-008)
- build/systems/EntityFactory.js (DI-008, DI-009)
- build/systems/CollectibleSystem.js (DI-009)
- build/systems/LevelLoader.js (DI-014)
- build/systems/AudioManager.js (DI-015)
- build/systems/StorageManager.js (DI-016)
- build/assets-manifest.json (DI-017)
- build/levels/level-01.json .. build/levels/level-08.json (DI-018)
- build/audio/*.ogg and build/audio/*.mp3 placeholders (DI-003, DI-015)

### Design Decisions Applied

- Phaser scene stack implemented as Boot -> Menu -> Game with parallel HUD and overlay scenes for Pause, Level Complete, and Game Over.
- Player FSM and variable jump-cut gravity implemented to satisfy DI-006 and DI-007.
- Entity factory and level loader split from scene logic for DI traceability and maintenance clarity.
- localStorage schema under smb-save key used for highScore, unlockedLevel, and audioMuted.
- assets-manifest.json includes all image, audio, and level assets for BR-052 traceability.

### Use Cases Implemented / Updated

- UC-001 Launch and menu navigation
- UC-002 Character movement and jumping
- UC-003 Platform traversal baseline
- UC-004 Enemy interactions (stomp / shell)
- UC-005 Collectibles and power-up application
- UC-006 Level completion flow
- UC-007 Lives and game-over flow
- UC-008 Hidden block support in level objects
- UC-009 Pause/resume overlay
- UC-010 Audio control hooks and mute state persistence
- UC-011 HUD values for score, lives, level, timer

### Browser Requirements Covered

- Local-only asset loading under build with no CDN imports in index.html.
- CSP connect-src none is set in index.html.
- localStorage-only persistence path with no network transmission code paths.

### Implementation Caveats

- build/vendor/phaser.min.js is a placeholder stub and must be replaced with the official local Phaser 3 minified distribution to run gameplay in-browser.
- Audio files are placeholder zero-byte assets; replace with CC0 ogg/mp3 files before production verification.
- Level-02 through Level-08 are minimal baseline Tiled JSON maps and should be expanded for full gameplay progression balancing.

### Notes

This release establishes complete Stage 9 structural traceability and implementation scaffolding. A follow-up media/content hardening pass is required before declaring runtime production-ready.

---
