// DI-021: Character Factory — AD&D 2e character creation
'use strict';
import { rollD, roll4d6DropLowest } from './CombatEngine.js';

// CON hit-point modifier per CON score (index = CON-1, capped at 25)
const CON_HP_MOD = [
  -3,-3,-2,-2,-2,-1,-1,-1,-1,0,0,0,0,0,0,1,2,2,3,4,4,4,5,5,6
];
// DEX AC modifier (index = DEX-1)
const DEX_AC_MOD = [
  5,5,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,-1,-2,-3,-4,-4,-4,-4,-4
];

/**
 * Roll a new character's base stats using 4d6 drop lowest.
 * Returns { str, dex, con, int, wis, cha }
 */
export function rollStats() {
  return {
    str: roll4d6DropLowest(),
    dex: roll4d6DropLowest(),
    con: roll4d6DropLowest(),
    int: roll4d6DropLowest(),
    wis: roll4d6DropLowest(),
    cha: roll4d6DropLowest(),
  };
}

/**
 * Build a full player character entity from creation choices.
 * @param {string} name
 * @param {string} race  — key in window.GameData.races
 * @param {string} cls   — key in window.GameData.classes
 * @param {object} stats — { str, dex, con, int, wis, cha } base rolled values
 * @param {number} portraitIndex
 * @returns entity object
 */
export function createCharacter(name, race, cls, stats, portraitIndex = 0) {
  // races.json is an array — find by id
  const racesData = window.GameData.races;
  const raceData  = Array.isArray(racesData)
    ? racesData.find(r => r.id === race)
    : racesData[race];
  const classData = window.GameData.classes[cls];
  if (!raceData || !classData) throw new Error(`Unknown race "${race}" or class "${cls}"`);

  // Normalise stats to uppercase keys (accept both STR and str)
  const normalise = s => ({
    STR: s.STR ?? s.str ?? 10,
    DEX: s.DEX ?? s.dex ?? 10,
    CON: s.CON ?? s.con ?? 10,
    INT: s.INT ?? s.int ?? 10,
    WIS: s.WIS ?? s.wis ?? 10,
    CHA: s.CHA ?? s.cha ?? 10,
  });
  const finalStats = normalise(stats);

  // Apply racial stat modifiers (keys are uppercase in races.json)
  for (const [stat, mod] of Object.entries(raceData.statMods || {})) {
    const key = stat.toUpperCase();
    if (key in finalStats) finalStats[key] = (finalStats[key] || 0) + mod;
  }

  // Clamp to 3-25
  for (const k of ['STR','DEX','CON','INT','WIS','CHA']) {
    finalStats[k] = Math.max(3, Math.min(25, finalStats[k]));
  }

  const conMod = CON_HP_MOD[Math.min(finalStats.CON - 1, 24)];
  const maxHp  = Math.max(1, rollD(1, classData.hitDie) + conMod);
  const baseAC = 10 + (DEX_AC_MOD[Math.min(finalStats.DEX - 1, 24)] || 0);

  const entity = {
    id:           `pc-${Date.now()}`,
    name,
    race,
    class:        cls,
    level:        1,
    xp:           0,
    STR: finalStats.STR, DEX: finalStats.DEX, CON: finalStats.CON,
    INT: finalStats.INT, WIS: finalStats.WIS, CHA: finalStats.CHA,
    hp:           maxHp,
    maxHp,
    ac:           baseAC,
    thac0:        classData.thac0[0],
    faction:      'player',

    // Position (tile coords) — (30,10) centres the character on a 1280×800 canvas
    tileX: 30, tileY: 10,
    velX:  0,  velY:  0,
    path:  [],

    // Inventory
    equipment: { weapon: null, armour: null, helmet: null, cloak: null, boots: null, ring1: null, ring2: null, amulet: null, belt: null, bracers: null, gloves: null, ammo: null },
    inventory: [],        // up to 20 items (item id strings)

    // Spells memorised  { spellId: count }
    memorised: {},
    // Thief skill points (only relevant for thief/bard)
    thiefSkills: classData.thiefSkills ? { ...classData.thiefSkills } : null,

    // Status
    conditions: [],       // 'poisoned', 'held', 'invisible', ...
    isPlayer:   true,
    portrait:   portraitIndex,
    animDef: {
      sheet:   'sprite_player',
      frameW:  48,
      frameH:  64,
      rows: {
        idle:   { baseRow: 0,  frameCount: 2 },
        walk:   { baseRow: 8,  frameCount: 4 },
        attack: { baseRow: 16, frameCount: 3 },
      },
    },
  };

  // Apply starting equipment
  for (const itemId of (classData.startingEquipment || [])) {
    entity.inventory.push(itemId);
  }

  return entity;
}

/**
 * Level up a character to their next level. Mutates entity.
 */
export function levelUp(entity) {
  const classData = window.GameData.classes[entity.class];
  const nextLevel = entity.level + 1;
  if (nextLevel > 20) return; // cap
  const conMod = CON_HP_MOD[Math.min((entity.CON ?? entity.con ?? 10) - 1, 24)];
  const hpGain = Math.max(1, rollD(1, classData.hitDie) + conMod);
  entity.hp        = Math.min(entity.hp + hpGain, entity.maxHp + hpGain);
  entity.maxHp    += hpGain;
  entity.thac0     = classData.thac0[nextLevel - 1];
  entity.level     = nextLevel;
}

/**
 * Build a companion entity from companions.json entry.
 */
export function createCompanion(companionId) {
  const data = window.GameData.companions[companionId];
  if (!data) throw new Error(`Unknown companion "${companionId}"`);
  return {
    ...structuredClone(data),
    isPlayer: false,
    faction:  'player',
    conditions: [],
    memorised:  {},
    inventory:  [...(data.inventory || [])],
  };
}

/**
 * Create a hostile NPC entity (used by encounters).
 */
export function createEnemy(entityDef) {
  return {
    id:        `enemy-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    faction:   'enemy',
    conditions: [],
    memorised:  {},
    inventory:  [],
    behaviour:  entityDef.behaviour ?? 'aggressive',
    isPlayer:   false,
    ...structuredClone(entityDef),
    hp:        entityDef.hp,
    maxHp:     entityDef.hp,
  };
}

export default { rollStats, createCharacter, levelUp, createCompanion, createEnemy };
