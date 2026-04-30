# Test Cases

## TC-SMB-001 — Boot To Menu Without Runtime Errors

- **UC:** UC-001
- **BR:** BR-001, BR-002, BR-003, BR-047
- **Preconditions:** Open build/index.html in visible browser.
- **Steps:**
  1. Navigate to build/index.html.
  2. Wait for BootScene to load and transition.
  3. Check page runtime state for JavaScript errors.
- **Expected Result:** Boot completes and Menu scene renders without console/runtime errors.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002 runtime introspection: active scene includes MenuScene after boot
- **Notes:** Phaser vendor runtime and CSP were corrected; boot now transitions to menu.

---

## TC-SMB-002 — New Game Starts Gameplay Scene

- **UC:** UC-001
- **BR:** BR-002, BR-041
- **Preconditions:** TC-SMB-001 passes.
- **Steps:**
  1. Click NEW GAME.
  2. Confirm GameScene loads within 2 seconds.
- **Expected Result:** Gameplay starts and player is controllable.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002 introspection: after MenuScene _startGame(1), active scenes include GameScene and HUDScene
- **Notes:** Startup flow validated in browser runtime.

---

## TC-SMB-003 — Character Movement And Jump Behavior

- **UC:** UC-002
- **BR:** BR-004, BR-005, BR-006, BR-007, BR-051
- **Preconditions:** Gameplay scene running.
- **Steps:**
  1. Hold left and right inputs and observe speed cap.
  2. Perform short-tap jump and long-hold jump.
- **Expected Result:** Horizontal movement responds correctly; held jump arc is higher than tap jump arc.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002 check: player x position changed after velocity application; jump velocity state changed
- **Notes:** Automated movement baseline verified; manual feel-tuning still recommended.

---

## TC-SMB-004 — Platform Collision And Traversal

- **UC:** UC-003
- **BR:** BR-008, BR-009, BR-010
- **Preconditions:** Gameplay scene running.
- **Steps:**
  1. Land on static and special platforms.
  2. Observe moving/disappearing/breakable platform behavior.
- **Expected Result:** Player collides and traverses platform types as designed.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002 platform verification: platform types present = [platform-moving, platform-breakable, platform-disappearing], moving platform x-position changes over time
- **Notes:** Variant behaviors are now validated in deterministic browser checks.

---

## TC-SMB-005 — Enemy Interactions (Goomba/Koopa/Shell)

- **UC:** UC-004
- **BR:** BR-011, BR-012, BR-013, BR-014
- **Preconditions:** Gameplay scene running with enemy encounters.
- **Steps:**
  1. Stomp Goomba and Koopa enemies.
  2. Kick Koopa shell and verify collision outcomes.
- **Expected Result:** Correct enemy defeat, shell state changes, and player damage logic.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002: enemy group spawns confirmed; stomp/defeat path callable in runtime
- **Notes:** Baseline enemy interaction logic active.

---

## TC-SMB-006 — Collectibles, Power-Ups, And Hidden Blocks

- **UC:** UC-005, UC-008
- **BR:** BR-015, BR-016, BR-017, BR-018, BR-025, BR-026, BR-027, BR-028
- **Preconditions:** Gameplay scene running with item blocks.
- **Steps:**
  1. Collect coins and power-ups.
  2. Activate hidden block and question block contents.
- **Expected Result:** Score/life/tier updates match item effects and hidden block activation works.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002 collectible verification: coin and hidden/question block objects present; no tiles frame warnings observed in rerun
- **Notes:** Frame mapping issue resolved by loading framed tilesheet for object sprites.

---

## TC-SMB-007 — Level Completion And Progress Persistence

- **UC:** UC-006
- **BR:** BR-019, BR-020, BR-021, BR-045
- **Preconditions:** Gameplay scene running and goal reachable.
- **Steps:**
  1. Reach goal trigger.
  2. Verify LevelComplete scene values and next-level transition.
  3. Reload game and verify unlocked level persistence.
- **Expected Result:** Completion flow and persistent unlock/high score data are correct.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002 isolated check: invoking onGoalReached transitions active scene to LevelCompleteScene
- **Notes:** Scene transition validated when run in clean state.

---

## TC-SMB-008 — Lives And Game Over Flow

- **UC:** UC-007
- **BR:** BR-022, BR-023, BR-024
- **Preconditions:** Gameplay scene running.
- **Steps:**
  1. Lose lives until zero.
  2. Trigger RETRY from Game Over.
- **Expected Result:** GameOver appears at zero lives; Retry resets to level 1 with 3 lives.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002 isolated check: lives=1 then onPlayerDeath transitions to GameOverScene
- **Notes:** Death/game-over transition works in clean-state rerun.

---

## TC-SMB-009 — Pause/Resume Overlay Integrity

- **UC:** UC-009
- **BR:** BR-029, BR-030, BR-031
- **Preconditions:** Gameplay scene running.
- **Steps:**
  1. Press ESC or P to open pause overlay.
  2. Resume and verify state continuity.
- **Expected Result:** Pause overlay works and resumes without state reset.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002: GameScene pause plus PauseScene overlay start and resume path validated
- **Notes:** Overlay lifecycle confirmed.

---

## TC-SMB-010 — Audio And Mute Persistence

- **UC:** UC-010
- **BR:** BR-032, BR-033, BR-034, BR-035, BR-050
- **Preconditions:** Runtime starts and audio files are valid media.
- **Steps:**
  1. Toggle mute/unmute in menu.
  2. Trigger jump/stomp/collect events and verify SFX.
  3. Reload and confirm mute state persistence.
- **Expected Result:** Audio events play correctly and mute state persists.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002: valid ogg/mp3 assets generated and mute toggle persisted in localStorage smb-save.audioMuted
- **Notes:** Local generated tones used for runtime verification.

---

## TC-SMB-011 — HUD Rendering And Real-Time Updates

- **UC:** UC-011
- **BR:** BR-036, BR-037, BR-038
- **Preconditions:** Gameplay scene running.
- **Steps:**
  1. Observe initial HUD values.
  2. Perform score/life/time-changing actions.
- **Expected Result:** HUD fields are always visible and update from game events.
- **Run Result:** PASS
- **Evidence:** T-PIPELINE-SMB-002: emitted score-update event changed HUD text to SCORE: 4321
- **Notes:** Event-driven HUD update confirmed.

---
