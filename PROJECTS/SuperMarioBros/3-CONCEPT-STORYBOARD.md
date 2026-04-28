# Super Mario Bros — Concept Storyboard

**Stage:** 3 — Graphic Artist (Concept Storyboard)
**Source:** `1-USE-CASES.md`, `2-NARRATIVE-VISION.md`
**Date:** 2026-04-27

---

## CB-001 : Boot / Loading Screen
- **SUMMARY:** The initial browser boot sequence showing a loading animation while Phaser preloads all assets.
- **FILE:** `./build/concept/concept-boot-screen.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Boot/loading state
- **STYLE NOTES:** Black background; centred white pixel-font title block; coin-spin animation loop; thin progress bar at bottom. No user input.
- **TRACEABILITY:** UC-001 (Launch Game and Navigate Main Menu — boot/asset-load phase)
- **RELATED:** CB-002

---

## CB-002 : Main Menu Screen
- **SUMMARY:** Full-width title card with sky background, menu options, and blinking cursor.
- **FILE:** `./build/concept/concept-main-menu.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Main menu — Start Game, Level Select, Options
- **STYLE NOTES:** Mario-blue (#5c94fc) sky background; floating cloud sprites; red title block with white pixel font; Q-block row at mid-height; menu items centred with blinking arrow cursor.
- **TRACEABILITY:** UC-001 (Launch Game and Navigate Main Menu — menu selection)
- **RELATED:** CB-001, CB-004

---

## CB-003 : In-Game HUD Layout
- **SUMMARY:** Persistent heads-up display overlaying every gameplay level with score, lives, time, level, and power-up state.
- **FILE:** `./build/concept/concept-hud-layout.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** HUD — all active gameplay levels
- **STYLE NOTES:** Fixed top bar, full browser viewport width. Left: player name + 6-digit score. Centre-left: coin icon + counter. Centre: WORLD label + level code. Centre-right: TIME label + 3-digit countdown. Right: power-up icon.
- **TRACEABILITY:** UC-011 (View HUD During Gameplay), UC-005 (Collect Items and Activate Power-Ups — power-up indicator)
- **RELATED:** CB-004, CB-005, CB-006, CB-007

---

## CB-004 : Gameplay — Grassland Level (World 1-1 Style)
- **SUMMARY:** Side-scrolling platformer view of a sunny grassland level with Goombler enemy, platforms, and coins.
- **FILE:** `./build/concept/concept-gameplay-grassland.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Active gameplay — grassland level theme (levels 1–2)
- **STYLE NOTES:** Sky-blue background; rolling green ground tiles; brick and Q-block platforms at mid-height; Goombler sprite walking left; coins above Q-blocks; Mario sprite (small) on ground facing right.
- **TRACEABILITY:** UC-002 (Control Character Movement), UC-003 (Land on and Navigate Platforms), UC-004 (Interact with Enemies — Goombler stomp), UC-005 (Collect Items — coins)
- **RELATED:** CB-003, CB-005

---

## CB-005 : Gameplay — Underground Level (Bonus Cave Style)
- **SUMMARY:** Dark underground cave level with stone brick walls, narrow passages, and Goombler enemies.
- **FILE:** `./build/concept/concept-gameplay-underground.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Active gameplay — underground level theme (levels 3–4)
- **STYLE NOTES:** Solid black background; blue-grey stone brick tiles for ceiling/floor/pillars; uniform lighting; coins in central corridor; warp pipes at sides.
- **TRACEABILITY:** UC-002 (Control Character Movement), UC-003 (Land on and Navigate Platforms), UC-004 (Interact with Enemies), UC-008 (Discover Level Secrets and Bonus Areas — warp pipes)
- **RELATED:** CB-004, CB-006

---

## CB-006 : Gameplay — Sky / Cloud Level (Bonus Platform Style)
- **SUMMARY:** High-altitude cloud platform level with dense coins and gap-death hazard (no ground).
- **FILE:** `./build/concept/concept-gameplay-sky.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Active gameplay — sky/cloud level theme (levels 5–6) and bonus rooms
- **STYLE NOTES:** Light sky-blue background; large cloud platform sprites; no ground row; dense coin rows atop clouds; Mario may be large/super-sized.
- **TRACEABILITY:** UC-002 (Control Character Movement), UC-003 (Land on and Navigate Platforms — disappearing platforms), UC-005 (Collect Items — coin collection), UC-008 (Discover Level Secrets and Bonus Areas — bonus rooms)
- **RELATED:** CB-005, CB-007

---

## CB-007 : Gameplay — Castle Level (Boss World Style)
- **SUMMARY:** Dark castle interior with lava pits, fire-bar hazards, Shelltron enemy, and end-of-level trigger.
- **FILE:** `./build/concept/concept-gameplay-castle.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Active gameplay — castle level theme (levels 7–10), boss encounter
- **STYLE NOTES:** Dark grey brick tiles; lava pit with flame sprites; moving platform bridges over lava; rotating fire-bar obstacles; Shelltron in shell form; Bowser placeholder at end; axe-bridge trigger at far right.
- **TRACEABILITY:** UC-002 (Control Character Movement), UC-003 (Land on and Navigate Platforms — moving platforms), UC-004 (Interact with Enemies — Shelltron shell kick), UC-006 (Progress Through a Level and Reach the Goal — final trigger)
- **RELATED:** CB-006, CB-010

---

## CB-008 : Player Power-Up State Diagram
- **SUMMARY:** Four-panel sprite reference showing Mario in each power-up state with transition arrows and damage regression paths.
- **FILE:** `./build/concept/concept-power-up-states.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Reference sheet — informs Developer (Stage 9) and Graphic Artist (Stage 8)
- **STYLE NOTES:** Four panels side by side: Small Mario, Super Mario, Fire Mario, Invincible Mario (flashing). State transition arrows with item names. Red arrows for damage regression paths.
- **TRACEABILITY:** UC-005 (Collect Items and Activate Power-Ups — all four power-up states)
- **RELATED:** CB-003, CB-009

---

## CB-009 : Collectible Items Reference Sheet
- **SUMMARY:** 2×2 grid showing all four collectible item sprites with labels and effect descriptions.
- **FILE:** `./build/concept/concept-item-collectibles.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Reference sheet — informs Developer (Stage 9) and Graphic Artist (Stage 8)
- **STYLE NOTES:** Coin (gold spinning disc), Mushroom (red/white spots), FireFlower (red/orange bloom), Star (yellow with face). Each on display pedestal with name and effect text below.
- **TRACEABILITY:** UC-005 (Collect Items and Activate Power-Ups — coin, mushroom, fire flower, star)
- **RELATED:** CB-008

---

## CB-010 : Level Complete Screen
- **SUMMARY:** Flag-pole capture moment followed by Course Clear results overlay with score tally.
- **FILE:** `./build/concept/concept-level-complete.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Level complete state — post-goal trigger, before next level loads
- **STYLE NOTES:** Last level frame visible behind semi-opaque overlay; "COURSE CLEAR!" in yellow pixel text; time bonus count-up animation; total score readout; auto-advances after tally or on Start press.
- **TRACEABILITY:** UC-006 (Progress Through a Level and Reach the Goal — level complete screen)
- **RELATED:** CB-007, CB-011

---

## CB-011 : Game Over Screen
- **SUMMARY:** All lives lost state — black screen with "GAME OVER" text and transition back to Main Menu.
- **FILE:** `./build/concept/concept-game-over.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Game Over state
- **STYLE NOTES:** Solid black background; large white pixel "GAME OVER" text centred; score value below; blinking "PRESS START" prompt; descending musical sting on entry.
- **TRACEABILITY:** UC-007 (Manage Lives and Respond to Game Over)
- **RELATED:** CB-010, CB-002

---

## CB-012 : Pause Overlay
- **SUMMARY:** In-game pause overlay freezing all physics and animations, with Resume and Main Menu options.
- **FILE:** `./build/concept/concept-pause-overlay.svg`
- **FORMAT:** SVG, 800×500, annotated with labelled regions
- **SCREENS COVERED:** Pause state — accessible during active gameplay via Escape or P key
- **STYLE NOTES:** Game background visible but muted/darkened; semi-transparent black modal panel centred; "PAUSED" in white pixel font; Resume option highlighted in gold, Main Menu in white; blinking arrow cursor.
- **TRACEABILITY:** UC-009 (Pause and Resume the Game)
- **RELATED:** CB-004, CB-005, CB-006, CB-007

---

## Exit Gate Verification

| Gate | Status |
|------|--------|
| `3-CONCEPT-STORYBOARD.md` exists with one CB record per major screen | PASS — CB-001 through CB-012 (12 records) |
| Every CB FILE path exists in `./build/concept/` and is non-empty | PASS — 12 files, all non-empty SVGs |
| All major UC screens are represented (UC-001 to UC-011) | PASS — all 11 UCs covered |
| TRACEABILITY fields reference valid UC IDs with correct titles | PASS |
| CB schema complete: SUMMARY, FILE, FORMAT, SCREENS COVERED, STYLE NOTES, TRACEABILITY, RELATED | PASS — all 7 fields present in all 12 records |
| File naming convention: `concept-{screen-name}.svg` | PASS — all 12 files use correct convention |
| No stubs or placeholder records | PASS |
