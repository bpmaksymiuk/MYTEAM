# Baldur's Gate — Use Cases

---

## UC-001: Launch Game and Main Menu

**Actor:** Player
**Goal:** Start the application and access the main menu.
**Scenario:** The player opens the game. A main menu is displayed with options: New Game, Load Game, Options, and Quit. The player selects an option and the game responds accordingly.

---

## UC-002: Create a Character

**Actor:** Player
**Goal:** Define the player character's identity and attributes before starting a new game.
**Scenario:** The player selects New Game. A character creation screen presents choices for name, gender, race (Human, Elf, Dwarf, Halfling, Gnome, Half-Elf, Half-Orc), class (Fighter, Mage, Thief, Cleric, etc.), and ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma). The player confirms their choices and enters the game world. Upon entering the starting area, a pre-formed party of five companions immediately joins (see UC-023), giving the player a fully-operational group of six from the first moment of play.

---

## UC-003: Explore the World (Isometric View)

**Actor:** Player
**Goal:** Navigate the player character and party through 2D isometric areas, including areas that contain hostile enemies.
**Scenario:** The player clicks a destination on the game world map. The party pathfinds and moves to the location. The player can scroll the camera, zoom, and click to move around towns, dungeons, and wilderness areas. Enemy sprites are visible within exploration areas; the player can click directly on an enemy to command the party to approach it. When the party moves within detection range of a hostile enemy, or the player clicks an enemy to attack, combat is automatically initiated and the game transitions to the turn-based combat sequence (see UC-004 and UC-016). The cursor changes shape and label to indicate the action that a click will perform (see UC-018). Party members can be selected and commanded individually by clicking their sprites (see UC-017). Defeated enemies leave lootable corpses in place; the player clicks them to retrieve items (see UC-019).

---

## UC-004: Engage in Combat (Turn-Based)

**Actor:** Player
**Goal:** Defeat enemies using turn-based combat mechanics governed by AD&D 2nd Edition rules.
**Scenario:**

**Initiation:** Combat begins when the party enters enemy detection range or the player clicks an enemy. All combatants (party members and enemies) roll initiative (d20 + DEX modifier). The initiative order is sorted descending and displayed in the **Initiative Tracker** — a panel along the top of the screen showing portrait icons with HP bars in turn order, with the active combatant highlighted.

**Turn Structure:** Each combatant acts once per round in initiative order. On a player character's turn:
- The character's portrait pulses gold in the Initiative Tracker.
- The **Action Panel** appears at the bottom of the screen with buttons: **Move**, **Attack**, **Cast Spell**, **Use Item**, **Special Ability**, **Wait**, and **End Turn**.
- Selecting **Move** overlays a blue movement-range indicator on reachable tiles; the player clicks a tile to move there.
- Selecting **Attack** overlays a red attack-range highlight on valid targets; the player clicks a target to execute the attack.
- Selecting **Cast Spell** opens a quick-spell picker filtered to prepared spells; the player picks a spell and designates a target tile or character.
- Selecting **Use Item** opens a quick-item slot strip for consumables.
- **End Turn** immediately passes control to the next combatant.

**Resolution:** Attack rolls, damage, saving throws, and ability checks are calculated using AD&D 2nd Edition rules. Results are shown as floating combat text above the target (e.g. "d20+4 = 17 → HIT", "6 damage", "MISS", "SAVED"). Each combatant's HP bar updates in real time above their sprite and in the Initiative Tracker.

**Enemy Turns:** Enemy turns are animated automatically; the active enemy is highlighted with a red indicator. Enemy actions (movement, attacks, spells) play out visibly so the player can follow the sequence.

**End of Combat:** Combat ends when all enemies are defeated or all party members are incapacitated. A brief results summary (XP gained, loot available) is displayed. Surviving party members retain their current HP; the Initiative Tracker and Action Panel are dismissed.

---

## UC-016: Travel to and Enter an Enemy Encounter

**Actor:** Player
**Goal:** Navigate from the current location to a hostile area and begin a fight sequence with enemies.
**Scenario:**

**Step 1 — World Travel:** The player opens the World Map (UC-012). Areas known to contain enemies are marked with a hostile indicator (red skull icon). The player clicks a hostile destination. The party travels there and the area loads with fog of war applied.

**Step 2 — Area Exploration:** The player navigates the isometric area (UC-003). Enemy sprites are visible within line of sight as the fog of war lifts. The player can see enemies patrolling or standing in place before engaging.

**Step 3 — Engagement:** The player initiates combat by either:
  - Moving the party close enough that an enemy's detection radius is triggered (automatic engagement), or
  - Clicking directly on a visible enemy sprite to command the party to engage (manual engagement).

A "Combat!" announcement overlay appears briefly, and the turn-based combat sequence starts (UC-004).

**Step 4 — Fight Sequence:** The Initiative Tracker populates at the top of the screen. The player manages each party member's turn using the Action Panel: moving into position, selecting attack targets, casting spells, and using items. Enemy turns play out visibly between player turns.

**Step 5 — Conclusion:** When all enemies in the encounter are defeated:
  - XP is distributed among party members.
  - Corpses appear in place; the player can loot them by clicking.
  - If a character levelled up, a level-up notification is shown (UC-013).
  - The player may continue exploring the area or return to the World Map.

**Alternative — Retreat:** If the party is losing, the player may move all party members to the area edge to flee. Combat ends, and the party returns to the World Map with current HP intact.

---

## UC-005: Recruit and Manage a Party

**Actor:** Player
**Goal:** Assemble a party of up to 6 characters including NPCs with distinct personalities.
**Scenario:** The player begins the game with a full party of six already formed (see UC-023). Beyond the starter companions, the player encounters additional recruitable NPC companions across the world. The player invites a companion to join. The party panel updates to show all active members. The player can dismiss party members, view their stats, and assign them AI behaviour modes (aggressive, defensive, etc.).

---

## UC-006: Manage Inventory

**Actor:** Player
**Goal:** Equip items, organise loot, and manage the party's carried weight.
**Scenario:** The player opens a character's inventory screen. A grid displays equipped slots (helmet, armour, weapon, ring, etc.) and a bag of carried items. The player drags items between characters or drops them. Weight capacity is enforced per character. Identified items display their name and properties.

---

## UC-007: Talk to NPCs and Make Dialogue Choices

**Actor:** Player
**Goal:** Interact with non-player characters through branching conversation trees.
**Scenario:** The player clicks on an NPC sprite on the map (the cursor shows the Talk icon when hovering — see UC-018). A dialogue window opens displaying the NPC's speech and a list of player response options. The player selects a response. The conversation continues or ends based on the choice, potentially influencing reputation, faction standing, or triggering quests. The player may also right-click the NPC to access Talk, Examine, or other context actions (see UC-017).

---

## UC-008: Accept and Track Quests

**Actor:** Player
**Goal:** Receive quests from NPCs and track objectives in a journal.
**Scenario:** An NPC gives the player a quest during dialogue. The quest is added to the journal with a title, description, and a list of numbered objectives. The player opens the journal at any time to review active, completed, and failed quests. Each objective shows a checkbox; as the player performs the required action in the world the corresponding completion flag is set automatically and the checkbox is ticked. When all objectives are ticked the quest is marked complete and XP is awarded (see UC-020). Failed quests are listed under a separate tab with the reason recorded.

---

## UC-009: Cast Spells and Use Abilities

**Actor:** Player
**Goal:** Use class-specific spells, special abilities, and thief skills during exploration and combat.
**Scenario:** The player selects a spell-casting character and opens their spellbook. The player prepares (memorises) spells from known spells. During play, the player selects a prepared spell and designates a target. The spell fires and its effect is applied. Mages must rest to re-memorise spells. Thieves have passive and active abilities such as Stealth, Pick Pocket, and Detect Traps.

---

## UC-010: Visit Merchants and Shops

**Actor:** Player
**Goal:** Buy, sell, and identify items at merchant NPCs.
**Scenario:** The player clicks a merchant NPC on the map (the cursor shows the Trade icon when hovering — see UC-018) or selects Trade from the right-click context menu (see UC-017). A shop interface shows items for sale with gold costs and the player's current inventory. The player buys or sells items. Gold is deducted or added accordingly. The merchant may offer item identification for a fee.

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

---

## UC-017: Select and Command Individual Party Members

**Actor:** Player
**Goal:** Control party members individually by clicking their sprites on the map.
**Scenario:**

**Single selection:** The player clicks a party member's sprite on the isometric map. A green selection ring appears beneath that character's feet; their portrait in the HUD bottom bar is highlighted with a gold border. Subsequent ground clicks move only the selected member independently of the rest of the party.

**Multi-selection:** Shift-clicking additional party members adds them to the active selection. Clicking an empty area of ground deselects all. All selected members move together when the player clicks a destination.

**Double-click:** Double-clicking a party member's sprite opens their character sheet overlay, showing stats, equipment, and level information — equivalent to clicking their portrait.

**Right-click context menu:** Right-clicking any character sprite on the map opens an inline context menu with options appropriate to that character type:
- On a **party member**: "Open Inventory", "Open Character Sheet", "Cast Spell At…", "Dismiss from Party"
- On a **friendly NPC**: "Talk", "Examine" (shows name and brief description)
- On a **merchant NPC**: "Trade", "Talk", "Examine"
- On a **recruitable companion**: "Invite to Party", "Talk", "Examine"
- On an **enemy** (outside combat): "Attack", "Examine"
- On a **corpse or container**: "Loot", "Examine"

Selecting any context menu option triggers the appropriate action. Pressing Escape or clicking elsewhere dismisses the menu.

**Portrait bar shortcut:** Clicking a portrait in the HUD bottom bar selects that party member on the map and centres the camera on them, identical to clicking their sprite.

---

## UC-018: Context-Sensitive Cursor

**Actor:** Player
**Goal:** Understand at a glance what a left-click will do by inspecting the cursor shape and tooltip.
**Scenario:** As the player moves the mouse over different objects on the isometric map, the cursor icon and a small tooltip label update to reflect the default action that a left-click will perform:

| Target hovered | Cursor icon | Tooltip label |
|---|---|---|
| Empty ground | Walk (footsteps) | Move here |
| Party member | Select (arrow) | Select \<Name\> |
| Recruitable companion | Talk (speech bubble) | Talk to \<Name\> |
| Friendly / Quest NPC | Talk (speech bubble) | Talk to \<Name\> |
| Merchant NPC | Trade (coin bag) | Trade with \<Name\> |
| Enemy (outside combat) | Attack (crossed swords) | Attack \<Name\> |
| Enemy (during own turn in combat) | Attack (crossed swords, red) | Attack \<Name\> |
| Reachable tile (during Move action) | Move (blue circle) | Move here |
| Corpse | Loot (open hand) | Loot \<Name\> |
| Container (chest, barrel) | Loot (open hand) | Open \<Object\> |
| Door / area transition | Door (archway) | Enter \<Destination\> |
| Interactive object | Interact (gear) | Use \<Object\> |

A single left-click executes the indicated default action immediately. For ambiguous targets (e.g. a merchant who also gives a quest) the primary action is used; the full option list is available via right-click (UC-017).

---

## UC-019: Loot Defeated Enemies and Containers

**Actor:** Player
**Goal:** Retrieve items from enemy corpses, chests, and other containers found in the world.
**Scenario:**

**Looting a corpse:** After an enemy is defeated its sprite is replaced by a corpse graphic on the ground. The loot cursor (UC-018) appears when the player hovers over it. Clicking the corpse opens the **Loot Panel** — a floating overlay showing the enemy's carried items in a grid alongside the active party member's inventory. The player drags individual items across, or clicks **Take All** to transfer everything at once. Closing the panel leaves remaining items on the corpse; the corpse persists until the area is reloaded.

**Looting a container:** Clicking a chest, barrel, crate, or similar object opens the Loot Panel in the same way. If the container is locked, the game checks whether the active party member is a Thief with sufficient Pick Locks skill. If so, a lock-picking attempt is made (skill roll vs. lock difficulty). On failure, the player is notified and may try again or use a Knock spell. On success, or if the container is already unlocked, the Loot Panel opens normally. Trapped containers trigger a trap effect before opening unless a Thief has already detected and disarmed the trap.

**Weight enforcement:** Items cannot be moved to a character whose carry weight would be exceeded. The item snaps back with a brief "Too heavy!" notice.

**Auto-sort:** The player may press the **Sort** button in the Loot Panel to alphabetically sort items by type for easier scanning.

**Gold stacks:** Gold pieces in a corpse or container are automatically added to the party's shared gold total without dragging; they are listed in the Loot Panel with a note "Gold added automatically."

---

## UC-020: Progress and Complete Quest Objectives

**Actor:** Player
**Goal:** Advance through a quest's objectives by performing actions in the world, then receive rewards on completion.
**Scenario:**

**Objective tracking:** Each quest has an ordered list of objectives, each with an associated completion flag (e.g. `reached_nashkel`, `talked_mayor`, `entered_mines`, `mines_cleared`). When the player performs the triggering action — entering an area, speaking to an NPC, defeating an enemy group — the engine sets the matching flag and the corresponding checkbox in the Journal ticks automatically. A brief on-screen notification reads "Objective complete: \<objective text\>".

**Journal update:** The Journal panel (KeyJ) reflects the new state immediately. The active objective is shown in bold; completed objectives are struck through and greyed. If a new objective unlocks as a result of completing a prior one, it appears beneath with the label "New Objective".

**Quest completion:** When the final objective's flag is set the quest status changes to Complete. A prominent "Quest Complete" banner overlays the screen for 3 seconds showing the quest title and XP reward. The full XP value (e.g. 1 000 XP for The Iron Crisis) is divided equally among living party members and applied immediately. If a character's XP crosses a level threshold, a level-up notification prompts the player to open their character screen (see UC-013).

**Reward variants:** Some quests additionally grant gold or a specific item on completion; these are transferred directly into the party inventory and listed in the completion banner.

**Quest failure:** If a required NPC dies before a flag is set, or a time-limited condition expires, the quest is marked Failed. The Journal moves it to the Failed tab and records the reason. Failure does not grant XP.

---

## UC-021: Random Wilderness Encounter

**Actor:** Player (and game engine)
**Goal:** Encounter a randomly selected group of enemies while travelling through or resting in wilderness areas.
**Scenario:**

**Trigger:** While the party moves through a wilderness area (or while resting — see UC-011), the engine rolls against a per-step (or per-hour) encounter chance. On a positive roll, an encounter group is chosen from the area's weighted encounter table. Higher-weight entries appear more frequently (e.g. Gibberlings × 4 at weight 3, Wolves × 2 at weight 2, Xvarts × 6 at weight 1 in low-difficulty wilderness).

**Spawn:** The selected enemy group spawns at a randomised position near the party's current location — not on top of them, leaving at least 3 tiles of separation. If the encounter is triggered during rest, the resting animation ends abruptly with a "Rest interrupted!" notification.

**Surprise check:** Each side rolls a d6; on a 1 the opposing side is surprised and loses their first turn. A surprised party member cannot act and is shown with a "!" icon overhead.

**Combat:** The standard turn-based combat sequence begins (UC-004). All normal combat rules apply. On victory, XP is distributed per enemy and loot is placed on corpses.

**Post-encounter:** If the encounter was triggered during rest, the player may attempt to rest again (with another encounter-chance roll). Wilderness encounter tables differ by area; deeper areas and higher difficulty settings raise encounter frequency and enemy tier.

---

## UC-022: Scripted Area Encounter

**Actor:** Player (and game engine)
**Goal:** Trigger a predetermined enemy encounter when entering a specific zone, advancing quest objectives as a result.
**Scenario:**

**Trigger:** Certain areas have scripted encounter zones tied to quest progression. Entering the zone — such as descending into the Nashkel Mines — spawns a fixed encounter group defined for that area (e.g. Kobolds × 5 from the `mines-encounters` table) at predetermined positions in the room, regardless of the random encounter roll.

**Distinction from random encounters:** Scripted encounters always spawn the same enemy type and count. They occur exactly once per zone entry (or once per quest stage); clearing them does not re-trigger on re-entry unless the quest design requires it.

**Quest flag linkage:** Clearing all enemies in a scripted encounter may set a quest completion flag automatically (e.g. `mines_cleared`), advancing the active quest without requiring a separate NPC conversation (see UC-020).

**Ambush variant:** Some scripted encounters are flagged as ambushes — the party is considered surprised on round 1 (no initiative roll; enemies act first). A "Ambush!" overlay is shown. This rewards the player for using Thief-class Detect Traps / Stealth scouting before entering the zone.

**Boss encounters:** Named bosses (e.g. the Kobold Commander in the Nashkel Mines) appear in scripted encounters with higher stats, unique loot, and a nameplate above their sprite. Defeating a boss always sets its associated quest flag and yields bonus XP beyond the standard per-enemy value.

---

## UC-023: Start the Game with a Pre-Formed Party

**Actor:** Player
**Goal:** Begin play immediately with a fully balanced party of six, without having to recruit companions manually.
**Scenario:**

**Context:** When a new game starts, the player's character (created in UC-002) enters the starting area of Candlekeep. Rather than exploring alone, five named companions are already present and join the party in quick succession during the opening sequence, bringing the group to the maximum size of six.

**The five starter companions and their roles:**

| Name | Class | Role | Key Strengths |
|---|---|---|---|
| **Imoen** | Thief | Scout & Utility | DEX 18 — detects/disarms traps, picks locks, backstabs, high DEX saves |
| **Khalid** | Fighter | Frontline Tank | CON 17 — absorbs damage, highest HP pool, melee frontliner |
| **Jaheira** | Druid | Healer & Support | WIS 14, CON 17 — Cure Wounds, Entangle, Hold Animal, natural armour buffs |
| **Minsc** | Ranger | Ranged & Melee DPS | STR 18 — two-handed melee or shortbow, Favoured Enemy bonus vs. humanoids |
| **Dynaheir** | Mage | Arcane Damage & Control | INT 17 — Magic Missile, Sleep, Charm Person, Fireball at higher levels |

This composition covers all core AD&D roles: arcane caster, divine caster/healer, melee tank, scout/thief, and ranged damage. The player character fills the sixth slot and determines whether the group has redundancy or a gap in any role.

**Join sequence:** Each companion approaches the player character sprite in turn. A brief dialogue line plays (drawn from their `joinDialogueNodeId`). Their portrait appears in the HUD party bar from left to right as they join. The full join sequence completes within 30 seconds of the first area loading.

**Party panel state:** Once all five have joined, the party bar shows six portraits with HP bars. Each companion's starting equipment (see `companions.json`) is already in their inventory and equipped where applicable.

**Player control:** The player retains full control at all times during the join sequence and may skip individual dialogue lines. Companions can be dismissed later via UC-005 if the player prefers a different composition.

**Save state:** After the join sequence completes the game auto-saves to a dedicated "New Game" slot so the player can restart from a full party at any time.
