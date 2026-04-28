(Writer)

# Narrative / Thematic Vision — Super Mario Bros Web Platformer

---

## OVERVIEW

**Project:** Super Mario Bros Web Platformer
**Stage:** 2 — Narrative Vision
**Source of Truth:** `1-USE-CASES.md` (UC-001 through UC-011)

This project is a browser-playable, legally original 2D side-scrolling platformer that faithfully recreates the *feel* and mechanical depth of the 1983 Nintendo NES title *Super Mario Bros.* — without copying copyrighted artwork, audio, or code. The player embodies a small, agile character navigating tiled worlds full of moving hazards, stomapble enemies, collectible power-ups, and hidden secrets. The experience is complete in a browser tab, instant to load, and satisfying in 5-minute play sessions.

The product delivers:
- A boot-to-play loop in under 5 seconds.
- Precise, responsive platformer controls.
- Escalating challenge across 8–10 distinct levels.
- Classic power-up fantasy: grow large, throw fire, turn invincible.
- An upbeat retro-chiptune audio atmosphere.

---

## COMPETITIVE & CREATIVE RESEARCH

### Similar Browser-Based Platformers

**1. Open Mario (openMario.com) / SuperMarioBros.online**
Several fan projects recreate Mario-like gameplay in browsers using Phaser or vanilla Canvas. Common observations:
- Controls that feel "floaty" are the #1 complaint — precise Arcade physics tuning (gravity 500, jump velocity 350) is the differentiator.
- Many ship only one or two levels; 8–10 levels sets this project apart for completeness.
- Lack of audio polish is a frequent gap — looping chiptune music and per-event SFX should be treated as first-class.

**2. Phaser 3 Platformer Demos (labs.phaser.io)**
- Demonstrate that Phaser's Arcade physics can deliver tight, sub-frame-latency collision at 60fps.
- Tilemaps from Tiled (.json export) enable rapid level design iteration.
- Phaser's built-in WebAudio integration handles spatial and timing audio without extra libraries.

**3. Kenney Platformer Assets (kenney.nl/assets/platformer-pack-redux)**
- CC0 licensed tile-set and sprite sheets at 32×32px resolution.
- Used by hundreds of browser games; visually distinct from Nintendo IP while evoking the same genre.
- Palette limited to ~16 colours per sprite set — authentic retro aesthetic.

**4. OpenGameArt.org Chiptune Collections**
- CC0/CC-BY chiptune loops by composers such as Juhani Junkala and Eric Matyas.
- Loopable 8-bit tracks at 120–140 BPM match the energetic platformer pace.

### Genre Precedents and Design Lessons
- **Variable jump height** (hold = higher arc) is non-negotiable for skill expression — UC-002.
- **Enemy stomp + shell kick** creates emergent combo moments that generate memorable gameplay beats — UC-004.
- **Hidden blocks** reward curiosity and replayability — UC-008.
- **Lives + Game Over reset** creates stakes; modern convention allows generous starting lives (3–5) — UC-007.
- **HUD legibility**: score/lives/time must be always-readable without blocking the play field — UC-011.

---

## THEMES AND TONE

### Thematic Pillars

| Pillar | Expression |
|--------|-----------|
| **Mastery through precision** | Every jump, stomp, and dodge rewards practiced input. The physics model is unforgiving but fair. |
| **Joyful discovery** | Hidden blocks, secret pipes, and bonus rooms exist to reward curious players. |
| **Escalating challenge** | Early levels teach mechanics gently; later levels demand mastery of everything learned. |
| **Nostalgic optimism** | Bright colours, upbeat chiptunes, and clean pixel art evoke the golden age of gaming with zero cynicism. |
| **Instant accessibility** | Zero install, zero login. The game opens in a browser and is playable in under 10 seconds. |

### Tone

- **Visual tone:** Vivid, clean, retro pixel art. Primary palette of reds, blues, greens, and earth tones. No gritty or dark realism.
- **Audio tone:** Energetic 8-bit chiptune loops. Punchy, satisfying sound effects for every interaction (coin, stomp, power-up, damage).
- **UI tone:** Friendly, legible, minimal. HUD is informational not decorative. Menu copy is short and action-oriented ("Start Game", "Try Again").
- **Difficulty tone:** Fair challenge. The player always has agency — deaths feel earned, not unfair.

---

## WORLD-BUILDING / CONCEPTS

### The World

The game takes place across a series of hand-crafted levels that evoke the classic world archetypes of the genre:

| Level Range | Environment | Visual Character |
|-------------|-------------|-----------------|
| 1–2 | Grasslands | Blue sky, green platforms, bright tiles |
| 3–4 | Underground / Caves | Dark background, stone tiles, glow accents |
| 5–6 | Sky / Cloud World | White cloud platforms, pastel sky |
| 7–8 | Castle / Fortress | Grey stone, fire hazards, lava pits |
| 9–10 | Final Challenge | Mixed themes, highest enemy density |

### The Player Character

A small humanoid figure (32×32 px sprite, 4–6 frame walk cycle) with the following states:
- **Small** (default): standard collision box
- **Large** (Mushroom active): taller sprite, larger collision box
- **Fire** (Fire Flower active): equipped with a projectile ability
- **Invincible** (Star active): blinking/flashing animation, immunity to damage
- **Dead**: brief death animation before respawn

### Enemies

| Name (Working) | Behaviour | Defeat Condition |
|----------------|-----------|-----------------|
| **Goombler** (Goomba-style) | Walks left/right, reverses at edges | Stomp from above; fire projectile |
| **Shelltron** (Koopa-style) | Walks left/right; retreats to shell on stomp | Kick shell; fire projectile |
| **Spike Trap** | Stationary or moving on track | Cannot be defeated — avoid |

### Items & Power-Ups

| Item | Effect | Duration |
|------|--------|----------|
| Coin | +10 score | Instant |
| Mushroom | Player grows large | Until next hit |
| Fire Flower | Enables fire projectile | 10–15 seconds |
| Star | Invincibility + contact defeat | 5–10 seconds |

### Level Structure

Each level is defined as a Tiled-exported `.json` tilemap with layers:
- **Ground** (collision-solid tiles)
- **Decoration** (non-solid background tiles)
- **Objects** (enemies, items, pipes, goal flags — spawned from object layer)

Secrets and bonus areas are embedded as object-layer metadata pointing to sub-scenes.

### HUD Layout

```
[SCORE: 000000]  [LIVES: ♥♥♥]    [TIME: 300]    [LEVEL: 1-1]
                                                  [POWER: —]
```

### Audio Identity

- One looping chiptune track per world theme (grasslands, underground, sky, castle).
- 8 one-shot sound effects: jump, land, coin, stomp, power-up, damage, level-complete, game-over.
- Sources: OpenGameArt.org (CC0/CC-BY), Freesound.org (CC0). Attribution tracked in `7-TEXT-CONTENT.md`.

---

## TRACEABILITY

| UC | Narrative Element Addressed |
|----|-----------------------------|
| UC-001 | Boot/Menu flow, instant accessibility |
| UC-002 | Player character states, movement precision |
| UC-003 | Platform variety (static, moving, breakable, disappearing) |
| UC-004 | Goombler, Shelltron, Spike Trap enemies |
| UC-005 | Coin, Mushroom, Fire Flower, Star items |
| UC-006 | 8–10 levels, goal flag, level-complete screen |
| UC-007 | Lives system, Game Over screen |
| UC-008 | Hidden blocks, bonus pipe areas |
| UC-009 | Pause overlay |
| UC-010 | Audio identity: chiptune + 8 SFX |
| UC-011 | HUD layout |

---

*Stage 2 exit gate: All UC IDs referenced. Schema sections OVERVIEW, COMPETITIVE RESEARCH, THEMES AND TONE, WORLD-BUILDING all present. — PASS*
