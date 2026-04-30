(Graphic Artist)

# Graphic Assets — Super Mario Bros Web Platformer

**Stage:** 8 — Graphic Assets
**Source:** `6-DESIGN-INSTRUCTIONS.md`, `3-CONCEPT-STORYBOARD.md`, `7-TEXT-CONTENT.md`
**Date:** 2026-04-28

---

## GA-001 : Player Character Spritesheet
- SUMMARY
  5-frame horizontal spritesheet (160×32 px) for the player character in SVG format. Frames: idle (0), run1 (1), run2 (2), jump (3), dead (4). Retro pixel-art aesthetic using red hat, blue overalls, and skin-tone face. Legally distinct from Nintendo IP — original character design.
- FILE
  `./build/images/ga-001-player.svg`
- FORMAT
  SVG, 160×32 viewBox, 5 frames at 32×32 each arranged left-to-right. Load in Phaser with `this.load.spritesheet('player', 'images/ga-001-player.svg', { frameWidth: 32, frameHeight: 32 })`.
- STYLE NOTES
  Pixel-art rectangle composition. Primary palette: red (#cc2200) hat, blue (#2244cc) overalls, skin (#f4a460) face, dark brown (#4a2000) shoes/moustache. Consistent with retro chiptune aesthetic from `2-NARRATIVE-VISION.md`.
- FLAVORS
  N/A — single canonical design.
- SELECTED FLAVOR
  N/A
- TRACEABILITY
  DI-006 → PlayerEntity sprite loading and animation binding
- RELATED
  UC-002, UC-004, UC-005 | BR-004, BR-006, BR-013, BR-016 | DI-001, DI-006

---

## GA-002 : Goomba Enemy Spritesheet
- SUMMARY
  3-frame horizontal spritesheet (96×32 px) for the Goomba-style enemy. Frames: walk1 (0), walk2 (1), defeated-flat (2). Brown mushroom-style enemy with angry eyebrows and small teeth. Original design inspired by generic fantasy mushroom creatures.
- FILE
  `./build/images/ga-002-goomba.svg`
- FORMAT
  SVG, 96×32 viewBox, 3 frames at 32×32. Load: `this.load.spritesheet('goomba', 'images/ga-002-goomba.svg', { frameWidth: 32, frameHeight: 32 })`.
- STYLE NOTES
  Brown palette (#8b4513, #4a1f00). White eyes with black pupils, angled brows for hostile expression. Defeated frame is a flat squish (only bottom 10 px height used).
- FLAVORS
  N/A
- SELECTED FLAVOR
  N/A
- TRACEABILITY
  DI-008 → GoombaEntity sprite and animation
- RELATED
  UC-004 | BR-011, BR-012, BR-013 | DI-008

---

## GA-003 : Koopa Enemy Spritesheet
- SUMMARY
  4-frame horizontal spritesheet (128×32 px) for the Koopa-style turtle enemy. Frames: walk1 (0), walk2 (1), shell-idle (2), shell-sliding (3). Green shell with lighter green limbs/head. Original turtle-inspired design.
- FILE
  `./build/images/ga-003-koopa.svg`
- FORMAT
  SVG, 128×32 viewBox, 4 frames at 32×32. Load: `this.load.spritesheet('koopa', 'images/ga-003-koopa.svg', { frameWidth: 32, frameHeight: 32 })`.
- STYLE NOTES
  Dark green (#228b22) shell with ridge lines (#1a6b1a). Light green (#adff2f) head and limbs. White eyes with black pupils. Shell-idle frame removes head/limbs, showing only the rounded shell.
- FLAVORS
  N/A
- SELECTED FLAVOR
  N/A
- TRACEABILITY
  DI-008 → KoopaEntity and KoopaShell sprite and animation
- RELATED
  UC-004 | BR-011, BR-012, BR-013 | DI-008

---

## GA-004 : Tileset Strip
- SUMMARY
  8-tile horizontal strip (256×32 px) providing all required tile types for the game world. Tiles: solid-ground (0), brick-platform (1), one-way-platform (2), question-block (3), used-block (4), sky-background (5), pipe-top (6), hidden-block (7).
- FILE
  `./build/images/ga-004-tiles.svg`
- FORMAT
  SVG, 256×32 viewBox, 8 tiles at 32×32. Used as a Tiled tileset image. Register in Tiled as tile size 32×32. Load in Phaser: `this.load.spritesheet('tiles', 'images/ga-004-tiles.svg', { frameWidth: 32, frameHeight: 32 })`. Tile index in level JSON maps to frame index in this strip.
- STYLE NOTES
  Ground tile: green grass cap on brown dirt. Brick: orange with dark mortar lines. One-way: light wood grain. Question block: yellow with black ? mark and raised border. Used block: grey. Sky: flat blue matching game background colour. Pipe-top: green with lighter lip. Hidden: transparent — identical to sky tile until activated.
- FLAVORS
  N/A
- SELECTED FLAVOR
  N/A
- TRACEABILITY
  DI-014 → LevelLoader tileset reference; DI-018 → Level data tileset
- RELATED
  UC-003, UC-008 | BR-008, BR-009, BR-026, BR-027 | DI-001, DI-014, DI-018

---

## GA-005 : Items / Collectibles Spritesheet
- SUMMARY
  9-item horizontal spritesheet (288×32 px) covering all collectible and hazard object types. Items: coin (0), mushroom (1), fire-flower (2), star (3), 1-up (4), koopa-shell-detached (5), spike-hazard (6), breakable-brick (7), coin-block (8).
- FILE
  `./build/images/ga-005-items.svg`
- FORMAT
  SVG, 288×32 viewBox, 9 items at 32×32. Load: `this.load.spritesheet('items', 'images/ga-005-items.svg', { frameWidth: 32, frameHeight: 32 })`.
- STYLE NOTES
  Coin: yellow ring. Mushroom: red cap, white dots, cream stem. Fire-flower: orange petals, yellow centre with face. Star: bright yellow 5-point. 1-up: green mushroom. Spike: grey metal points with dark base. Breakable brick: orange brick with crack marks. Coin block: orange block with coin emblem.
- FLAVORS
  N/A
- SELECTED FLAVOR
  N/A
- TRACEABILITY
  DI-009 → CollectibleSystem entity rendering
- RELATED
  UC-005, UC-008 | BR-015, BR-016, BR-017, BR-018, BR-025, BR-026, BR-027 | DI-009

---

## GA-006 : Menu Background
- SUMMARY
  Full-screen background image (800×480 px) for the MenuScene title screen. Shows a retro-style side-scrolling platformer world at dusk with sky gradient, blocky clouds, hills, ground, platforms, pipes, and question blocks in the distance.
- FILE
  `./build/images/ga-006-menu-bg.svg`
- FORMAT
  SVG, 800×480 viewBox. Load: `this.load.image('menu-bg', 'images/ga-006-menu-bg.svg')`. Used as a static background in MenuScene via `this.add.image(400, 240, 'menu-bg')`.
- STYLE NOTES
  Sky: blue gradient (#4488ee → #5c94fc). White pixel-style blocky clouds. Dark green rolling hills in background. Orange brick platforms. Green pipes. Yellow question blocks. Semi-transparent dark title card overlay. Text rendered in white/gold on the card.
- FLAVORS
  N/A
- SELECTED FLAVOR
  N/A
- TRACEABILITY
  DI-004 → MenuScene background image
- RELATED
  UC-001 | BR-001, BR-002 | DI-004

---

## Exit Gate Verification

| Gate | Status |
|------|--------|
| `./build/images/` has approved final assets for all image-bearing DIs | PASS — GA-001–GA-006 cover all image-bearing DIs (DI-004, DI-006, DI-008, DI-009, DI-014, DI-018) |
| Every GA record has a non-empty FILE path that exists | PASS — all 6 SVG files created in `./build/images/` |
| TRACEABILITY fields reference valid DI IDs | PASS — all DI references verified |
| Flavor selection resolved for all style-open assets | PASS — no style-open assets required flavor selection |
| No assets created for non-image DIs | PASS — purely code/logic DIs (DI-005, DI-007, DI-010–DI-013, DI-015–DI-017, DI-019–DI-020) have no GA records |

---

## Implementation Notes for Developer (Stage 9)

- All assets are SVG format. Phaser 3 can load SVG spritesheets via `load.spritesheet` — ensure `frameWidth` and `frameHeight` match values above.
- The `tiles` asset (GA-004) must be registered as a tileset in Tiled with tile size 32×32 and first GID = 1. Tile frame indices start at 0 in the SVG strip but at 1 in Tiled — adjust mapping accordingly in LevelLoader.
- For animation definitions, register animations in BootScene or GameScene using `this.anims.create()` referencing the frame indices listed above.
- SVG files are vector — they will scale cleanly at any canvas resolution. Phaser renders them at the requested `frameWidth`/`frameHeight` raster size.
