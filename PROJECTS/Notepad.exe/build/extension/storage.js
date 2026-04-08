// storage.js — DI-007
// localStorage note persistence manager

const PREFIX = 'notepad_note_';
const CURRENT_KEY = 'notepad_current';

function sanitizeFilename(filename) {
  return filename.replace(/[/\\]/g, '_');
}

export function saveNote(filename, content) {
  try {
    const key = PREFIX + sanitizeFilename(filename);
    localStorage.setItem(key, content);
    localStorage.setItem(CURRENT_KEY, filename);
    return { ok: true };
  } catch (e) {
    if (e.name === 'QuotaExceededError') return { ok: false, error: 'Storage full' };
    return { ok: false, error: e.message };
  }
}

export function loadNote(filename) {
  return localStorage.getItem(PREFIX + sanitizeFilename(filename));
  // Returns null if not found
}

export function listNotes() {
  return Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .map(k => k.slice(PREFIX.length))
    .sort();
}

export function deleteNote(filename) {
  localStorage.removeItem(PREFIX + sanitizeFilename(filename));
}

export function getCurrentFilename() {
  return localStorage.getItem(CURRENT_KEY) || null;
}

export function setCurrentFilename(filename) {
  if (filename === null) {
    localStorage.removeItem(CURRENT_KEY);
  } else {
    localStorage.setItem(CURRENT_KEY, filename);
  }
}
