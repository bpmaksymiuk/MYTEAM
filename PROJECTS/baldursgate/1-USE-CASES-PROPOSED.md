# Baldur's Gate — Proposed Use Cases

---

## UC-001: Launch Game and Main Menu

**Actor:** Player
**Goal:** Start the application and access the main menu.
**Scenario:** The player opens the game. A main menu is displayed with options: New Game, Load Game, Options, and Quit. The player selects an option and the game responds accordingly.

---

## UC-002: Create a Character

**Actor:** Player
**Goal:** Define the player character's identity and attributes before starting a new game.
**Scenario:** The player selects New Game. A character creation screen presents choices for name, gender, race (Human, Elf, Dwarf, Halfling, Gnome, Half-Elf, Half-Orc), class (Fighter, Mage, Thief, Cleric, etc.), and ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma). The player confirms their choices and enters the game world.

---

## UC-003: Explore the World (Isometric View)

**Actor:** Player
**Goal:** Navigate the player character and party through 2D isometric areas.
**Scenario:** The player clicks a destination on the game world map. The party pathfinds and moves to the location. The player can scroll the camera, zoom, and click to move around towns, dungeons, and wilderness areas.

---

## UC-004: Engage in Combat

**Actor:** Player
**Goal:** Defeat enemies using real-time-with-pause combat mechanics.
**Scenario:** The player's party encounters a hostile creature. Combat begins. The game proceeds in real-time and the player can pause at any time to issue orders. Each character attacks, casts spells, or uses abilities according to the player's commands. Hit rolls, damage, and saving throws are calculated using AD&D 2nd Edition rules. Combat ends when enemies are defeated or the party retreats.

---

## UC-005: Recruit and Manage a Party

**Actor:** Player
**Goal:** Assemble a party of up to 6 characters including NPCs with distinct personalities.
**Scenario:** The player encounters recruitable NPC companions across the world. The player invites a companion to join. The party panel updates to show all active members. The player can dismiss party members, view their stats, and assign them AI behaviour modes (aggressive, defensive, etc.).

---

## UC-006: Manage Inventory

**Actor:** Player
**Goal:** Equip items, organise loot, and manage the party's carried weight.
**Scenario:** The player opens a character's inventory screen. A grid displays equipped slots (helmet, armour, weapon, ring, etc.) and a bag of carried items. The player drags items between characters or drops them. Weight capacity is enforced per character. Identified items display their name and properties.

---

## UC-007: Talk to NPCs and Make Dialogue Choices

**Actor:** Player
**Goal:** Interact with non-player characters through branching conversation trees.
**Scenario:** The player clicks on an NPC. A dialogue window opens displaying the NPC's speech and a list of player response options. The player selects a response. The conversation continues or ends based on the choice, potentially influencing reputation, faction standing, or triggering quests.

---

## UC-008: Accept and Track Quests

**Actor:** Player
**Goal:** Receive quests from NPCs and track objectives in a journal.
**Scenario:** An NPC gives the player a quest during dialogue. The quest is added to the journal with a description and objectives. The player opens the journal at any time to review active, completed, and failed quests. Objectives update as the player progresses.

---

## UC-009: Cast Spells and Use Abilities

**Actor:** Player
**Goal:** Use class-specific spells, special abilities, and thief skills during exploration and combat.
**Scenario:** The player selects a spell-casting character and opens their spellbook. The player prepares (memorises) spells from known spells. During play, the player selects a prepared spell and designates a target. The spell fires and its effect is applied. Mages must rest to re-memorise spells. Thieves have passive and active abilities such as Stealth, Pick Pocket, and Detect Traps.

---

## UC-010: Visit Merchants and Shops

**Actor:** Player
**Goal:** Buy, sell, and identify items at merchant NPCs.
**Scenario:** The player enters a shop and speaks to the merchant. A shop interface shows items for sale with gold costs and the player's current inventory. The player buys or sells items. Gold is deducted or added accordingly. The merchant may offer item identification for a fee.

---

## UC-011: Rest and Recover

**Actor:** Player
**Goal:** Camp to recover hit points and re-memorise spells.
**Scenario:** The player selects the Rest option. If in a safe area, the party camps until morning, recovering HP based on Constitution and re-memorising previously prepared spells. In dangerous areas, random encounters may interrupt rest. The player can set watch order for party members.

---

## UC-012: Navigate the Area Map and World Map

**Actor:** Player
**Goal:** Travel between areas using a world map and manage fog of war within areas.
**Scenario:** The player opens the world map. Discovered areas are shown; undiscovered areas are hidden until visited. The player clicks a destination to travel there. Within each area, a local map shows explored zones (lit) and unexplored zones (fog of war). The minimap in the HUD reflects the local map.

---

## UC-013: Level Up Characters

**Actor:** Player
**Goal:** Improve characters upon earning sufficient experience points.
**Scenario:** A character accumulates experience points from combat, quests, and exploration. Upon reaching an XP threshold, the game notifies the player that the character can level up. The player opens the character screen and confirms the level-up. Hit points increase (dice roll + Constitution modifier), and new spells, proficiencies, or thief skill points are awarded per class rules.

---

## UC-014: Save and Load the Game

**Actor:** Player
**Goal:** Preserve progress and restore a prior game state.
**Scenario:** The player opens the save menu and enters a save name or overwrites an existing slot. The current game state (area, party, inventory, quests, flags) is written to a save file. The player can later load any save from the main menu or in-game load screen, restoring the exact state.

---

## UC-015: Configure Options

**Actor:** Player
**Goal:** Adjust graphics, audio, and gameplay settings.
**Scenario:** The player opens the Options screen from the main menu or in-game pause menu. Settings include: master volume, music volume, sound effects volume, scroll speed, difficulty (Easy, Normal, Hard, Insane), subtitles on/off, and display resolution. Changes take effect immediately or on next launch as appropriate.
