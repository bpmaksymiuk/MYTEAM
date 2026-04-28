# Approved Use Cases — Super Mario Bros Web Platformer

> **Stage 1 — Approved pipeline intent.** This file is the single source of truth for all downstream stages. Changes here trigger a full pipeline rerun from Stage 2.

---

## UC-001 : PLAYER - Launch Game and Navigate Main Menu
- **STEPS**
  1. Player opens the game URL in a web browser.
  2. The Boot scene preloads all assets (sprites, audio, level data).
  3. The Menu scene displays a title screen with options: Start Game, Level Select, Options.
  4. Player selects "Start Game".
  5. The game transitions to the first level and gameplay begins.
- **ACCEPTANCE CRITERIA**
  1. Game loads without errors in a modern web browser within 5 seconds on a standard connection.
  2. Menu screen is visible with at minimum: Start Game and Options buttons.
  3. Selecting Start Game launches Level 1 within 2 seconds.
  4. Level Select option allows choosing any previously reached level.
- **NOTES**
  - Tech: Phaser 3 BootScene and MenuScene.
  - All assets must be legally permissible (CC0 or custom).
- **RELATED** — UC-002, UC-010

---

## UC-002 : PLAYER - Control Character Movement
- **STEPS**
  1. Player is in an active gameplay level.
  2. Player presses the left arrow (or A) key; the character moves left.
  3. Player presses the right arrow (or D) key; the character moves right.
  4. Player releases direction keys; the character decelerates and stops.
  5. Player presses Space or W; the character jumps.
  6. Player holds the jump key longer; the character jumps higher.
  7. Player releases the jump key early; the character's jump arc is shorter.
- **ACCEPTANCE CRITERIA**
  1. Left/right movement responds within one animation frame of keypress.
  2. Acceleration and deceleration produce smooth, non-instant speed changes.
  3. Maximum horizontal speed does not exceed ~200 px/sec.
  4. Jump velocity is ~350 px/sec upward; gravity pulls at ~500 px/sec².
  5. Variable jump height is observable: a held jump is visibly taller than a tapped jump.
  6. Character animations (walk cycle, jump, fall, idle) play corresponding to the active state.
- **NOTES**
  - Phaser Arcade physics controls movement.
  - Player states: idle, running, jumping, falling, dead.
- **RELATED** — UC-003, UC-005

---

## UC-003 : PLAYER - Land on and Navigate Platforms
- **STEPS**
  1. Player is airborne (jumping or falling).
  2. Player falls onto a static platform; downward motion stops on contact with the top surface.
  3. Player walks to the edge of a platform; character does not fall through the sides.
  4. Player walks off the edge; character enters the falling state and gravity applies.
  5. Player navigates moving platforms; character moves with the platform while standing on it.
  6. Player strikes a breakable platform from above; it breaks after the required number of contacts.
  7. Player encounters a disappearing platform; it vanishes after a brief delay once stepped on.
- **ACCEPTANCE CRITERIA**
  1. Player lands correctly on all static platform types without clipping or jitter.
  2. Moving platforms carry the player smoothly in sync with platform motion.
  3. Breakable platforms visually indicate damage and disappear after correct contact count.
  4. Disappearing platforms play a warning animation before vanishing.
  5. Gaps with no platform below cause the player to fall into a pit (triggering death/damage).
- **NOTES**
  - Phaser Arcade physics tile collision handles static platforms.
  - Moving, breakable, and disappearing platforms are custom entity types.
- **RELATED** — UC-002, UC-005, UC-008

---

## UC-004 : PLAYER - Interact with Enemies
- **STEPS**
  1. A Goomba-style enemy patrols a platform, reversing direction at edges.
  2. Player jumps and lands on top of the Goomba; the enemy is defeated with a stomp.
  3. Player touches a Goomba from the side or below; the player takes damage.
  4. A Koopa-style enemy walks toward the player; player stomps it and it retreats into its shell.
  5. Player kicks the Koopa shell; the shell slides and defeats other enemies it contacts.
  6. Player contacts a spike/hazard obstacle; the player takes instant damage.
  7. Player with an active power-up defeats an enemy; the corresponding effect applies (e.g., fire projectile).
- **ACCEPTANCE CRITERIA**
  1. Stomping a Goomba defeats it and awards points; a defeat sound plays.
  2. Side or bottom contact with a Goomba reduces player health/lives by one.
  3. Koopa transitions to shell state on stomp; a second contact kicks the shell.
  4. A moving shell defeats enemies it contacts and bounces off walls.
  5. Spike hazards remove one life/health on any contact.
  6. Enemy defeat awards the correct point value and increments the HUD score.
- **NOTES**
  - Minimum two enemy types for MVP: Goomba-style and Koopa-style.
  - Hazard obstacles may be stationary or move on predefined tracks.
- **RELATED** — UC-002, UC-006, UC-007

---

## UC-005 : PLAYER - Collect Items and Activate Power-Ups
- **STEPS**
  1. Player walks over or into a coin; the coin is collected.
  2. HUD score increments by 10 points; a coin sound plays.
  3. Player contacts a Mushroom power-up; the character grows to large size.
  4. Player contacts a Fire Flower power-up; the fire-projectile ability activates for 10–15 seconds.
  5. Player contacts a Star power-up; the invincibility effect activates for 5–10 seconds.
  6. Player presses the fire key while holding Fire Flower power-up; a projectile is launched.
  7. Power-up timer expires; character returns to default state.
- **ACCEPTANCE CRITERIA**
  1. Collecting a coin increments the score by 10 and plays the coin sound effect.
  2. Mushroom visually changes the player sprite to large size and adjusts the collision box.
  3. Fire Flower enables projectile firing; projectiles travel forward and defeat enemies on contact.
  4. Star activates invincibility: player cannot take damage and defeats enemies on contact for 5–10 seconds.
  5. All power-up effects expire correctly after their defined duration.
  6. HUD power-up indicator reflects the active power-up state.
- **NOTES**
  - Only one power-up can be active at a time; a new pickup replaces the current one.
- **RELATED** — UC-004, UC-007

---

## UC-006 : PLAYER - Progress Through a Level and Reach the Goal
- **STEPS**
  1. Player starts a level at the defined spawn point.
  2. Player navigates platforms, defeats or avoids enemies, and collects items.
  3. A countdown timer is visible on the HUD; it decrements in real time.
  4. Player reaches the level goal (flag or end marker).
  5. A Level Complete screen displays: score earned, time remaining, and a "Next Level" button.
  6. Player selects "Next Level"; the next level loads.
  7. After completing the final level, a victory/credits screen is shown.
- **ACCEPTANCE CRITERIA**
  1. Level goal trigger reliably detects player contact and halts gameplay.
  2. Level Complete screen shows correct score and remaining time.
  3. "Next Level" transitions to the correct subsequent level.
  4. Time running to zero before reaching the goal triggers the Game Over state.
  5. Completing the last level (level 8–10) shows a unique end-game screen.
- **NOTES**
  - Default time limit per level: 300 seconds.
  - Level progression order is 1 → N sequentially.
- **RELATED** — UC-001, UC-007, UC-010

---

## UC-007 : PLAYER - Manage Lives and Respond to Game Over
- **STEPS**
  1. Player starts with 3 lives displayed on the HUD.
  2. Player takes damage (enemy contact, hazard, or pit fall); one life is lost.
  3. Player respawns at the level start with remaining lives.
  4. Player loses all lives; the Game Over screen is displayed.
  5. Game Over screen offers: Retry (restart level with new lives) or Main Menu.
  6. Player selects Retry; lives reset and the current level restarts.
  7. Player selects Main Menu; the title screen is shown.
- **ACCEPTANCE CRITERIA**
  1. HUD lives counter decrements correctly on each death.
  2. Player respawns at level start within 2 seconds after losing a life.
  3. Game Over screen appears immediately after the last life is lost.
  4. Retry resets lives to the starting value and restarts the current level.
  5. Main Menu returns to the title screen and clears in-progress game state.
- **NOTES**
  - Starting lives may be configurable (default: 3).
  - Invincibility frames apply briefly after respawn to prevent immediate re-death.
- **RELATED** — UC-004, UC-006

---

## UC-008 : PLAYER - Discover Level Secrets and Bonus Areas
- **STEPS**
  1. Player moves through a level and notices a hidden or unmarked block.
  2. Player strikes the block from below; a hidden item (coin or power-up) is revealed.
  3. Player finds a pipe entrance; pressing down enters a bonus area.
  4. Player collects bonus items in the hidden area.
  5. Player exits the bonus area and returns to the main level at the entry pipe.
- **ACCEPTANCE CRITERIA**
  1. At least one level contains a secret block with a concealed item.
  2. Striking a secret block from below reveals the item with a pop-up animation.
  3. At least one level contains a pipe that transitions to a bonus area.
  4. Bonus area loads correctly and returns the player to the correct re-entry point.
- **NOTES**
  - Bonus areas are optional bonus content; not required in every level.
- **RELATED** — UC-003, UC-005, UC-006

---

## UC-009 : PLAYER - Pause and Resume the Game
- **STEPS**
  1. Player is in an active gameplay level.
  2. Player presses the Escape or P key.
  3. Gameplay freezes; a Pause overlay appears with options: Resume, Main Menu.
  4. Player selects Resume; gameplay continues from the paused state.
  5. Player selects Main Menu; game returns to the title screen.
- **ACCEPTANCE CRITERIA**
  1. Pause key reliably freezes all game entities (physics, animations, timers) immediately.
  2. Pause overlay is visible and legible over the game canvas.
  3. Resuming restores exact game state (position, score, timer) from before the pause.
  4. Main Menu from pause screen clears game state and shows the title screen.
- **NOTES**
  - Pause must not be accessible during death or transition animations.
- **RELATED** — UC-006, UC-007

---

## UC-010 : PLAYER - Experience Audio Feedback
- **STEPS**
  1. Player starts a level; background chiptune music begins looping.
  2. Player collects a coin; a coin sound effect plays.
  3. Player jumps; a jump sound effect plays.
  4. Player stomps an enemy; a defeat sound effect plays.
  5. Player activates a power-up; a power-up sound effect plays.
  6. Player takes damage; a damage sound effect plays.
  7. Player completes a level; a level-complete fanfare plays.
  8. Player triggers Game Over; a game-over sound plays.
- **ACCEPTANCE CRITERIA**
  1. Background music plays and loops seamlessly throughout gameplay.
  2. Each game event (coin, jump, stomp, power-up, damage, level complete, game over) triggers the correct sound effect.
  3. Sound effects do not overlap in a way that causes audio distortion.
  4. All audio assets are from legally permissible sources (CC0, CC-BY with attribution, or royalty-free).
- **NOTES**
  - Audio sources: Freesound.org, OpenGameArt.org, Incompetech.
  - Web Audio API or Phaser's built-in audio manager handles playback.
- **RELATED** — UC-002, UC-004, UC-005, UC-006

---

## UC-011 : PLAYER - View HUD During Gameplay
- **STEPS**
  1. Player is in an active gameplay level.
  2. Player collects coins; the score on the HUD increments in real time.
  3. Player loses a life; the lives counter on the HUD decrements immediately.
  4. Timer counts down; the time display on the HUD updates each second.
  5. Player activates a power-up; the power-up indicator on the HUD changes to reflect the active item.
  6. Player advances to a new level; the level indicator updates.
- **ACCEPTANCE CRITERIA**
  1. HUD is permanently visible during gameplay without obscuring critical play area.
  2. Score, lives, time, level, and power-up indicator all display correct values at all times.
  3. HUD updates are immediate (within one frame) on any triggering event.
  4. HUD elements do not overlap each other or critical game elements.
- **NOTES**
  - HUD layout: score and lives top-left, time top-center, level top-right.
- **RELATED** — UC-005, UC-006, UC-007

---

*End of Approved Use Cases — Stage 1 complete.*
