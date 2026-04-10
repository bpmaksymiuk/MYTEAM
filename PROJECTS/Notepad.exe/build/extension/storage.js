// DI-004: storage.js — Storage Abstraction Module (PT-006)
// Wraps chrome.storage.local with named async helpers.

const KEY_PREFIX_NOTE = 'note_';
const KEY_GEOMETRY    = 'windowGeometry';
const KEY_LAST_NOTE   = 'lastNoteName';

export async function saveNote(name, content) {
  const key = KEY_PREFIX_NOTE + name;
  await chrome.storage.local.set({ [key]: content, [KEY_LAST_NOTE]: name });
}

export async function loadNote(name) {
  const key = KEY_PREFIX_NOTE + name;
  const result = await chrome.storage.local.get(key);
  return Object.prototype.hasOwnProperty.call(result, key) ? result[key] : null;
}

export async function listNotes() {
  const all = await chrome.storage.local.get(null);
  return Object.keys(all)
    .filter(k => k.startsWith(KEY_PREFIX_NOTE))
    .map(k => ({ name: k.slice(KEY_PREFIX_NOTE.length), key: k }));
}

export async function loadLastNoteName() {
  const result = await chrome.storage.local.get(KEY_LAST_NOTE);
  return Object.prototype.hasOwnProperty.call(result, KEY_LAST_NOTE)
    ? result[KEY_LAST_NOTE]
    : null;
}

export async function saveGeometry(rect) {
  await chrome.storage.local.set({ [KEY_GEOMETRY]: rect });
}

export async function loadGeometry() {
  const result = await chrome.storage.local.get(KEY_GEOMETRY);
  return Object.prototype.hasOwnProperty.call(result, KEY_GEOMETRY)
    ? result[KEY_GEOMETRY]
    : null;
}
