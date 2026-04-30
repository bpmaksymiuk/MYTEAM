(Writer)

# Text Content — Super Mario Bros Web Platformer

**Stage:** 7 — Text Content
**Source:** `6-DESIGN-INSTRUCTIONS.md`, `2-NARRATIVE-VISION.md`
**Date:** 2026-04-28

---

## GLOSSARY

| GL-ID | Term | Canonical Form | Definition | First Appears |
|-------|------|----------------|------------|---------------|
| GL-001 | New Game | New Game | The action that starts a fresh game session from level 1 with default lives. Always Title Case. | DI-004 |
| GL-002 | Level Select | Level Select | A menu option allowing the player to start at any previously reached level. Always Title Case. | DI-004 |
| GL-003 | High Score | High Score | The player's best score across all sessions, persisted in browser storage. Always Title Case in UI. | DI-005 |
| GL-004 | Lives | Lives | The count of remaining player attempts before game over. Capital L in HUD context. | DI-005, DI-010 |
| GL-005 | Level | Level | The current playable map index. Capital L in HUD and menu context. | DI-005, DI-010 |
| GL-006 | Time | Time | The countdown timer for the current level. Capital T in HUD. | DI-010 |
| GL-007 | Score | Score | The cumulative point total for the current session. Capital S in HUD. | DI-010 |
| GL-008 | Game Over | Game Over | The state reached when all lives are lost. Two words, title case. | DI-013 |
| GL-009 | Level Complete | Level Complete | The state reached when the player reaches the goal. Two words, title case. | DI-012 |
| GL-010 | Paused | Paused | The suspended-gameplay state. Single word, title case. | DI-011 |
| GL-011 | Main Menu | Main Menu | The title screen navigation destination. Two words, title case. | DI-004, DI-011, DI-013 |
| GL-012 | Resume | Resume | The action that returns from pause to active gameplay. Single word. | DI-011 |
| GL-013 | Retry | Retry | The action on the Game Over screen that resets lives to 3 and restarts from level 1. Single word. | DI-013 |
| GL-014 | Next Level | Next Level | The button on the Level Complete screen that advances to the subsequent level. Two words. | DI-012 |
| GL-015 | Mute | Mute | The state or action that silences all game audio. Single word. Used as toggle label. | DI-004, DI-015 |
| GL-016 | Unmute | Unmute | The state or action that restores game audio. Single word. Used as toggle label. | DI-004 |
| GL-017 | Loading | Loading | The boot/preload state shown on first page load. Single word. | DI-003 |
| GL-018 | Congratulations | Congratulations | The text displayed on completion of the final level. Full word, no abbreviation. | DI-012 |

---

## PHRASEBOOK

| Category | Tone | Voice | Avoid | Example |
|----------|------|-------|-------|---------|
| UI Buttons | Immediate, action-oriented | Second person imperative | Passive voice, question marks | "New Game", "Retry" |
| HUD Labels | Terse, informational | Third person label | Verbose phrases, punctuation | "SCORE: 0", "LIVES: 3" |
| Status / Result screens | Celebratory or neutral, brief | Second person | Lengthy text, paragraphs | "Level Complete!", "Game Over" |
| Loading/Boot | Neutral, progress-focused | Third person or absent | Marketing language | "Loading…" |
| Pause overlay | Neutral, minimal | Noun-only | Conversational filler | "Paused" |
| Victory/end | Warm, celebratory | Second person | Clichés | "Congratulations! You cleared all levels." |

---

## TC-001 : Menu Screen Button Labels
- SUMMARY
  All interactive text labels on the MenuScene title screen: New Game, Level Select, and the Mute/Unmute toggle. Must be immediately legible and unambiguous.
- FILE
  `./build/text/ui/tc-001-menu-labels.md`
- CATEGORY
  UI
- TONE NOTES
  Action-oriented imperative. Short. All title case. No punctuation on buttons.
- GLOSSARY REFERENCES
  GL-001 (New Game), GL-002 (Level Select), GL-011 (Main Menu), GL-015 (Mute), GL-016 (Unmute)
- VARIANTS
  - Mute toggle label variant A: "MUTE" / "UNMUTE" (current state label)
  - Mute toggle label variant B: "🔊 SOUND ON" / "🔇 SOUND OFF"
- SELECTED VARIANT
  Variant A — no emoji dependency, consistent with chiptune retro aesthetic.
- TRACEABILITY
  DI-004 → MenuScene button labels
- RELATED
  UC-001, UC-010 | BR-001, BR-035 | DI-004

---

## TC-002 : HUD Display Labels
- SUMMARY
  The four persistent HUD label prefixes and their initial display strings rendered by HUDScene. Always visible during active gameplay.
- FILE
  `./build/text/ui/tc-002-hud-labels.md`
- CATEGORY
  UI
- TONE NOTES
  Terse. All-caps labels, colon separator, no punctuation after value. Monospace or pixel font for retro aesthetic.
- GLOSSARY REFERENCES
  GL-004 (Lives), GL-005 (Level), GL-006 (Time), GL-007 (Score)
- VARIANTS
  None — labels are fixed.
- SELECTED VARIANT
  N/A
- TRACEABILITY
  DI-010 → HUDScene text elements
- RELATED
  UC-011 | BR-036, BR-037, BR-038 | DI-010

---

## TC-003 : Pause Screen Text
- SUMMARY
  Text content for the PauseScene overlay: the "PAUSED" header and two interactive options.
- FILE
  `./build/text/ui/tc-003-pause-labels.md`
- CATEGORY
  UI
- TONE NOTES
  Minimal. The pause state should feel calm and temporary. Short labels only.
- GLOSSARY REFERENCES
  GL-010 (Paused), GL-012 (Resume), GL-011 (Main Menu)
- VARIANTS
  None — standard labels only.
- SELECTED VARIANT
  N/A
- TRACEABILITY
  DI-011 → PauseScene text elements
- RELATED
  UC-009 | BR-029, BR-031 | DI-011

---

## TC-004 : Level Complete Screen Text
- SUMMARY
  Text content for the LevelCompleteScene: header, score label, time-remaining label, and the Next Level button. Also includes the game-complete congratulations message.
- FILE
  `./build/text/ui/tc-004-level-complete-labels.md`
- CATEGORY
  UI
- TONE NOTES
  Celebratory but concise. Numeric result lines follow the HUD terse style. The congratulations message is warmer.
- GLOSSARY REFERENCES
  GL-009 (Level Complete), GL-014 (Next Level), GL-018 (Congratulations)
- VARIANTS
  - Game-complete variant A: "Congratulations! You cleared all levels!"
  - Game-complete variant B: "You Win! All levels cleared."
- SELECTED VARIANT
  Variant A — more celebratory; fits the upbeat tone established in `2-NARRATIVE-VISION.md`.
- TRACEABILITY
  DI-012 → LevelCompleteScene text elements
- RELATED
  UC-006 | BR-019, BR-021 | DI-012

---

## TC-005 : Game Over Screen Text
- SUMMARY
  Text content for GameOverScene: header and two interactive options.
- FILE
  `./build/text/ui/tc-005-game-over-labels.md`
- CATEGORY
  UI
- TONE NOTES
  Neutral. Not punishing or discouraging. Clear next-action options.
- GLOSSARY REFERENCES
  GL-008 (Game Over), GL-013 (Retry), GL-011 (Main Menu)
- VARIANTS
  None — standard labels.
- SELECTED VARIANT
  N/A
- TRACEABILITY
  DI-013 → GameOverScene text elements
- RELATED
  UC-007 | BR-024 | DI-013

---

## TC-006 : Boot / Loading Screen Text
- SUMMARY
  The minimal text shown during BootScene asset preloading: a loading indicator.
- FILE
  `./build/text/ui/tc-006-boot-labels.md`
- CATEGORY
  UI
- TONE NOTES
  Neutral, progress-indicating. No marketing copy. The progress bar conveys state visually; text is minimal.
- GLOSSARY REFERENCES
  GL-017 (Loading)
- VARIANTS
  - Variant A: "LOADING…" (static text above progress bar)
  - Variant B: No text — progress bar only
- SELECTED VARIANT
  Variant A — provides screen-reader context and fills the screen gracefully.
- TRACEABILITY
  DI-003 → BootScene loading text
- RELATED
  UC-001 | BR-003, BR-041 | DI-003

---

## Exit Gate Verification

| Gate | Status |
|------|--------|
| GLOSSARY present and approved | PASS — 18 GL entries covering all canonical terms |
| PHRASEBOOK present and approved | PASS — 6 tone/voice categories defined |
| Every text-bearing DI has a TC record | PASS — DI-003, DI-004, DI-010, DI-011, DI-012, DI-013 each have a TC |
| Every TC has a non-empty file at its canonical path | PASS — 6 files written under `./build/text/ui/` |
| TRACEABILITY and GLOSSARY REFERENCES valid | PASS — all DI IDs and GL IDs exist in this document |
| Variant decisions recorded | PASS — TC-001, TC-004, TC-006 include variant selection notes |
