// app.js — DI-010
// Main application orchestrator

import { initEditor, getValue, setValue, clear, focus as editorFocus,
  setDirty, getDirty, setWordWrap } from './editor.js';
import { initStatusbar } from './statusbar.js';
import { initMenubar, setMenuItemChecked } from './menubar.js';
import { saveNote, loadNote, listNotes, deleteNote,
  getCurrentFilename, setCurrentFilename } from './storage.js';
import { downloadAsText } from './downloader.js';
import { showConfirm, showOpenPicker, showHelp, showAbout } from './dialogs.js';

let currentFilename = null;   // null == Untitled
let wordWrapEnabled = true;

function setTitle(filename) {
  const name = filename || 'Untitled';
  document.title = name + ' - Notepad';
  const titleEl = document.getElementById('title-filename');
  if (titleEl) titleEl.textContent = name;
}

// ── Guard: ask before discarding unsaved changes ──────────────────────────────
// Returns true if safe to proceed, false to abort
async function guardUnsaved() {
  if (!getDirty()) return true;
  const result = await showConfirm('You have unsaved changes. Save before continuing?');
  if (result === null) return false;  // Cancel → abort
  if (result === true) {
    const saved = await cmdSave();
    return saved;
  }
  return true;  // No → discard and continue
}

// ── Commands ──────────────────────────────────────────────────────────────────

async function cmdNew() {
  if (!(await guardUnsaved())) return;
  clear();
  currentFilename = null;
  setCurrentFilename(null);
  setTitle(null);
  setDirty(false);
  editorFocus();
}

async function cmdOpen() {
  if (!(await guardUnsaved())) return;
  const notes = listNotes();
  const chosen = await showOpenPicker(notes);
  if (!chosen) return;
  const content = loadNote(chosen);
  if (content === null) return;
  setValue(content);
  currentFilename = chosen;
  setCurrentFilename(chosen);
  setTitle(chosen);
  setDirty(false);
  editorFocus();
}

// Returns true if save succeeded
async function cmdSave() {
  if (!currentFilename) return cmdSaveAs();
  const result = saveNote(currentFilename, getValue());
  if (!result.ok) {
    await showConfirm('Save failed: ' + result.error);
    return false;
  }
  setDirty(false);
  return true;
}

async function cmdSaveAs() {
  const proposed = currentFilename || 'Untitled';
  // Use a simple inline prompt-style dialog via confirm fallback
  // (no native prompt in extension popup — use browser prompt via window)
  const name = window.prompt('Save as:', proposed);
  if (!name || !name.trim()) return false;
  const trimmed = name.trim();
  const result = saveNote(trimmed, getValue());
  if (!result.ok) {
    await showConfirm('Save failed: ' + result.error);
    return false;
  }
  currentFilename = trimmed;
  setCurrentFilename(trimmed);
  setTitle(trimmed);
  setDirty(false);
  return true;
}

async function cmdDownload() {
  downloadAsText(getValue(), currentFilename || 'Untitled');
}

async function cmdDelete() {
  if (!currentFilename) return;
  const ok = await showConfirm('Delete "' + currentFilename + '" from storage?');
  if (!ok) return;
  deleteNote(currentFilename);
  currentFilename = null;
  setCurrentFilename(null);
  clear();
  setTitle(null);
  setDirty(false);
}

function cmdToggleWordWrap() {
  wordWrapEnabled = !wordWrapEnabled;
  setWordWrap(wordWrapEnabled);
  setMenuItemChecked('view:wordwrap', wordWrapEnabled);
}

function cmdToggleStatusBar() {
  const bar = document.getElementById('statusbar');
  const visible = bar.style.display !== 'none';
  bar.style.display = visible ? 'none' : 'flex';
  setMenuItemChecked('view:statusbar', !visible);
}

// ── Menu action dispatcher ─────────────────────────────────────────────────────
async function handleMenuAction(action) {
  switch (action) {
    case 'file:new':      await cmdNew(); break;
    case 'file:open':     await cmdOpen(); break;
    case 'file:save':     await cmdSave(); break;
    case 'file:saveas':   await cmdSaveAs(); break;
    case 'file:download': await cmdDownload(); break;
    case 'file:delete':   await cmdDelete(); break;
    case 'file:exit':     window.close(); break;
    case 'view:wordwrap':  cmdToggleWordWrap(); break;
    case 'view:statusbar': cmdToggleStatusBar(); break;
    case 'view:zoom':      await showConfirm('Zoom: Use Ctrl+Plus / Ctrl+Minus in your browser to zoom.'); break;
    case 'edit:find':      await showConfirm('Find: Use Ctrl+F in the browser to search.'); break;
    case 'edit:replace':   await showConfirm('Replace: Use Ctrl+H in the browser to replace.'); break;
    case 'help:keyboard':  showHelp(); break;
    case 'help:about':     showAbout(); break;
  }
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'n': e.preventDefault(); cmdNew(); break;
      case 'o': e.preventDefault(); cmdOpen(); break;
      case 's':
        e.preventDefault();
        if (e.shiftKey) cmdSaveAs(); else cmdSave();
        break;
    }
  }
});

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const editorEl    = document.getElementById('editor');
  const statusbarEl = document.getElementById('statusbar');
  const menubarEl   = document.getElementById('menubar');

  initEditor(editorEl, (dirty) => {
    // Reflect dirty state in title
    const name = currentFilename || 'Untitled';
    document.title = (dirty ? '* ' : '') + name + ' - Notepad';
  });
  initStatusbar(editorEl, statusbarEl);
  initMenubar(menubarEl, handleMenuAction);

  // Restore previous session
  const savedFile = getCurrentFilename();
  if (savedFile) {
    const content = loadNote(savedFile);
    if (content !== null) {
      setValue(content);
      currentFilename = savedFile;
    }
  }

  setTitle(currentFilename);
  setWordWrap(wordWrapEnabled);
  setMenuItemChecked('view:wordwrap', wordWrapEnabled);
  setMenuItemChecked('view:statusbar', true);
  setDirty(false);
  editorFocus();
});
