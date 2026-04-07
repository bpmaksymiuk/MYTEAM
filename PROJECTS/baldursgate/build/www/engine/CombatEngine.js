// DI-016: Combat Engine — pure AD&D 2e rule resolver. No DOM/canvas dependencies.
'use strict';

// AD&D 2e STR bonus table [index = STR score - 1]
const STR_HIT_BONUS  = [-3,-3,-3,-2,-2,-1,-1,-1,0,0,0,0,0,1,1,1,1,2,3,3,3,3,3,3,3,3];
const STR_DMG_BONUS  = [-3,-3,-3,-1,-1,0,0,0,0,0,0,0,0,0,0,1,1,2,7,8,9,10,11,12,13,14];
const DEX_AC_BONUS   = [5,5,4,4,4,3,3,2,1,0,0,0,-1,-2,-2,-3,-3,-4,-4,-4];

function strHitBonus(str)  { return STR_HIT_BONUS[Math.min(str, 25) - 1] || 0; }
function strDmgBonus(str)  { return STR_DMG_BONUS[Math.min(str, 25) - 1] || 0; }
export function dexACBonus(dex) { return DEX_AC_BONUS[Math.min(dex, 19) - 1] || 0; }

/**
 * Roll count×d(sides), return sum.
 */
export function rollD(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
}

/**
 * Roll 4d6 drop lowest — ability score generation.
 */
export function roll4d6DropLowest() {
  const rolls = [rollD(1,6), rollD(1,6), rollD(1,6), rollD(1,6)];
  rolls.sort((a,b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

/**
 * Resolve an attack roll.
 * Returns { result: 'CRITICAL'|'HIT'|'MISS', roll }
 */
export function resolveAttack(attacker, defender) {
  const roll = rollD(1, 20);
  if (roll === 20) return { result: 'CRITICAL', roll };
  if (roll === 1)  return { result: 'MISS', roll };

  const needed = attacker.thac0 - defender.ac;
  return { result: roll >= needed ? 'HIT' : 'MISS', roll };
}

/**
 * Calculate damage for a hit.
 * Returns integer damage value.
 */
export function resolveDamage(attacker, weapon) {
  if (!weapon || !weapon.damageDice) return 1;
  const { count, sides } = weapon.damageDice;
  let dmg = rollD(count, sides);
  // Melee adds STR bonus
  if (!weapon.properties?.ranged) dmg += strDmgBonus(attacker.stats.STR);
  return Math.max(1, dmg);
}

/**
 * Look up the character's saving throw target for a given category.
 */
function getSavingThrowTarget(entity, category) {
  // GameData is a global loaded in main.js
  const classDef = window.GameData?.classes?.[entity.class];
  if (!classDef) return 15;
  const levels = Object.keys(classDef.savingThrows).map(Number).sort((a,b) => b - a);
  for (const lvl of levels) {
    if (entity.level >= lvl) return classDef.savingThrows[lvl][category] ?? 15;
  }
  return classDef.savingThrows[levels[levels.length - 1]]?.[category] ?? 15;
}

/**
 * Resolve a saving throw.
 * Returns true if the entity saves (roll meets or exceeds target).
 */
export function resolveSavingThrow(entity, category) {
  const roll = rollD(1, 20);
  const target = getSavingThrowTarget(entity, category);
  return roll >= target;
}

/**
 * Apply a spell effect to targets.
 * Returns array of { target, effectType, amount, saved }.
 */
export function applySpellEffect(spell, targets, caster) {
  const results = [];
  for (const target of targets) {
    let saved = false;
    let amount = 0;

    if (spell.saveCategory) {
      saved = resolveSavingThrow(target, spell.saveCategory);
    }

    if (spell.effectType === 'damage' && spell.damageDice) {
      const { count, sides, bonus = 0 } = spell.damageDice;
      amount = rollD(count, sides) + bonus;
      if (saved) amount = Math.floor(amount / 2);
    } else if (spell.effectType === 'heal' && spell.damageDice) {
      const { count, sides, bonus = 0 } = spell.damageDice;
      amount = rollD(count, sides) + bonus;
    }

    results.push({ target: target.id, effectType: spell.effectType, amount, saved });
  }
  return results;
}

export default { rollD, roll4d6DropLowest, resolveAttack, resolveDamage, resolveSavingThrow, applySpellEffect, dexACBonus };
