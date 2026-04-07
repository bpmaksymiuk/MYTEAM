// DI-024: Save Manager — IndexedDB with 10 slots + quicksave
'use strict';

const DB_NAME    = 'bg_saves';
const STORE_NAME = 'slots';
const DB_VERSION = 1;
const MAX_SLOTS  = 10;
export const QUICKSAVE_SLOT = 'quicksave';

let _db = null;

function _open() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE_NAME, { keyPath: 'slot' });
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror   = e => reject(e.target.error);
  });
}

function _tx(mode) {
  return _db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

function _wrap(req) {
  return new Promise((res, rej) => { req.onsuccess = e => res(e.target.result); req.onerror = e => rej(e.target.error); });
}

/**
 * Save the current game state to a slot.
 * @param {string|number} slot — 1-10 or 'quicksave'
 * @param {object} gameState   — full serialisable state snapshot
 */
export async function save(slot, gameState) {
  await _open();
  const record = {
    slot:      String(slot),
    savedAt:   new Date().toISOString(),
    areaId:    gameState.areaId,
    partyName: gameState.party?.[0]?.name ?? 'Unknown',
    payload:   JSON.stringify(gameState),
  };
  await _wrap(_tx('readwrite').put(record));
}

/**
 * Load a save slot. Returns the game state object or null.
 */
export async function load(slot) {
  await _open();
  const record = await _wrap(_tx('readonly').get(String(slot)));
  if (!record) return null;
  return JSON.parse(record.payload);
}

/**
 * List all save slot metadata (without payload).
 * Returns array of { slot, savedAt, areaId, partyName } sorted by slot.
 */
export async function listSlots() {
  await _open();
  const all = await _wrap(_tx('readonly').getAll());
  return all
    .map(({ slot, savedAt, areaId, partyName }) => ({ slot, savedAt, areaId, partyName }))
    .sort((a, b) => String(a.slot).localeCompare(String(b.slot)));
}

/**
 * Delete a save slot.
 */
export async function deleteSave(slot) {
  await _open();
  await _wrap(_tx('readwrite').delete(String(slot)));
}

/**
 * Returns next available numeric slot (1-10) or null if all full.
 */
export async function nextFreeSlot() {
  const used = new Set((await listSlots()).map(s => s.slot));
  for (let i = 1; i <= MAX_SLOTS; i++) {
    if (!used.has(String(i))) return i;
  }
  return null;
}

export default { save, load, listSlots, deleteSave, nextFreeSlot, QUICKSAVE_SLOT };
