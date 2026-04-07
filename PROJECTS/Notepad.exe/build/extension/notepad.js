// notepad.js — Notepad Chrome Extension application logic
// Implements all BR-001..BR-030 from 2-REQUIREMENTS.md

'use strict';

// ── State ──────────────────────────────────────────────────
let currentFilename = '';
let isDirty = false;
let wordWrapEnabled = false;
let findPosition = -1;

// Undo stack (BR-008): array of textarea value snapshots
const undoStack = [];
const UNDO_MAX = 200;
let undoDebounceTimer = null;
let lastUndoSnapshot = '';

// ── DOM References ─────────────────────────────────────────
const editor = document.getElementById('editor');
const statusLine = document.getElementById('status-line');
const statusCol = document.getElementById('status-col');
const statusChars = document.getElementById('status-chars');
const menuBar = document.getElementById('menu-bar');

// ── MENUS — single source of truth (BR-029) ───────────────
// Functions referenced before declaration — hoisted via `function` keyword
const MENUS = {
  File: [
    { label: 'New', shortcut: 'Ctrl+N', handler: () => fileNew() },
    { label: 'Open...', shortcut: 'Ctrl+O', handler: () => fileOpen() },
    { label: 'Save', shortcut: 'Ctrl+S', handler: () => fileSave() },
    { label: 'Save As...', shortcut: '', handler: () => fileSaveAs() },
    { separator: true },
    { label: 'Exit', shortcut: '', handler: () => window.close() },
  ],
  Edit: [
    { label: 'Undo', shortcut: 'Ctrl+Z', handler: () => editUndo() },
    { separator: true },
    { label: 'Cut', shortcut: 'Ctrl+X', handler: () => document.execCommand('cut') },
    { label: 'Copy', shortcut: 'Ctrl+C', handler: () => document.execCommand('copy') },
    { label: 'Paste', shortcut: 'Ctrl+V', handler: () => document.execCommand('paste') },
    { separator: true },
    { label: 'Find...', shortcut: 'Ctrl+F', handler: () => openFind() },
  ],
  View: [
    { label: 'Word Wrap', shortcut: '', handler: () => toggleWordWrap(), checkable: true, id: 'menu-word-wrap' },
  ],
  Help: [
    { label: 'View Help', shortcut: 'F1', handler: () => openHelp() },
    { label: 'About Notepad', shortcut: '', handler: () => showAbout() },
  ],
};

// ── Title & Dirty Flag ─────────────────────────────────────

function updateTitle() {
  const name = currentFilename || 'Untitled';
  document.title = (isDirty ? '* ' : '') + name + ' - Notepad';
}

function setDirty() {
  if (!isDirty) {
    isDirty = true;
    updateTitle();
  }
}

function clearDirty() {
  isDirty = false;
  updateTitle();
}

// ── Status Bar (BR-005, BR-010, BR-011, BR-012, BR-013) ───

function updateStatusBar() {
  const val = editor.value;
  const pos = editor.selectionStart;
  const before = val.substring(0, pos);
  const lines = before.split('\n');
  const lineNum = lines.length;
  const lastNewline = before.lastIndexOf('\n');
  const colNum = pos - lastNewline; // lastNewline is -1 when no newline → col = pos + 1 ✓
  statusLine.textContent = 'Ln ' + lineNum;
  statusCol.textContent = 'Col ' + colNum;
  statusChars.textContent = val.length + ' chars';
}

// ── Undo Stack (BR-008) ────────────────────────────────────

function pushUndo(snapshot) {
  if (undoStack.length >= UNDO_MAX) undoStack.shift();
  undoStack.push(snapshot);
}

function scheduleUndoPush() {
  if (undoDebounceTimer) clearTimeout(undoDebounceTimer);
  const snapshotBefore = lastUndoSnapshot;
  undoDebounceTimer = setTimeout(() => {
    pushUndo(snapshotBefore);
    lastUndoSnapshot = editor.value;
    undoDebounceTimer = null;
  }, 300);
}

function resetUndoStack() {
  undoStack.length = 0;
  lastUndoSnapshot = editor.value;
  if (undoDebounceTimer) { clearTimeout(undoDebounceTimer); undoDebounceTimer = null; }
}

function editUndo() {
  if (undoStack.length === 0) return;
  const prev = undoStack.pop();
  editor.value = prev;
  lastUndoSnapshot = prev;
  clearDirty(); // restored to a prior state; dirty tracking continues from here
  // Actually restore dirty based on contents vs saved - just mark dirty since we modified
  isDirty = true;
  updateTitle();
  updateStatusBar();
}

// ── Storage Helpers (BR-014, BR-015, BR-017, BR-018) ───────

function saveDocument(filename, text) {
  return chrome.storage.local.set({
    ['doc_' + filename]: text,
    'currentFile': filename,
  });
}

function loadDocument(filename) {
  return chrome.storage.local.get('doc_' + filename).then(result => {
    const text = result['doc_' + filename] || '';
    editor.value = text;
    currentFilename = filename;
    resetUndoStack();
    clearDirty();
    updateStatusBar();
  });
}

function listDocuments() {
  return chrome.storage.local.get(null).then(all => {
    return Object.keys(all)
      .filter(k => k.startsWith('doc_'))
      .map(k => k.slice(4));
  });
}

function saveWordWrap(state) {
  return chrome.storage.local.set({ wordWrap: state });
}

function loadWordWrap() {
  return chrome.storage.local.get('wordWrap').then(result => {
    if (result.wordWrap !== undefined) {
      wordWrapEnabled = result.wordWrap;
      applyWordWrap();
    }
  });
}

// ── Word Wrap (BR part of View) ────────────────────────────

function applyWordWrap() {
  if (wordWrapEnabled) {
    editor.style.whiteSpace = 'pre-wrap';
    editor.wrap = 'soft';
  } else {
    editor.style.whiteSpace = 'pre';
    editor.wrap = 'off';
  }
  // Update checkmark in View menu
  const item = document.getElementById('menu-word-wrap');
  if (item) {
    item.classList.toggle('checked', wordWrapEnabled);
  }
}

function toggleWordWrap() {
  wordWrapEnabled = !wordWrapEnabled;
  applyWordWrap();
  saveWordWrap(wordWrapEnabled);
  closeAllMenus();
}

// ── File Operations ─────────────────────────────────────────

function fileNew() {
  if (isDirty && !confirm('Unsaved changes will be lost. Continue?')) return;
  editor.value = '';
  currentFilename = '';
  resetUndoStack();
  isDirty = false;
  updateTitle();
  updateStatusBar();
  closeAllMenus();
  chrome.storage.local.remove('currentFile');
}

async function fileSave() {
  if (!currentFilename) {
    const name = window.prompt('Save as:', 'Untitled');
    if (!name) return;
    currentFilename = name.trim() || 'Untitled';
  }
  await saveDocument(currentFilename, editor.value);
  clearDirty();
  closeAllMenus();
}

function fileSaveAs() {
  const blob = new Blob([editor.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const downloadName = (currentFilename || 'Untitled') + '.txt';
  a.href = url;
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  closeAllMenus();
}

async function fileOpen() {
  if (isDirty && !confirm('Unsaved changes will be lost. Continue?')) return;
  closeAllMenus();
  const names = await listDocuments();
  const dialog = document.getElementById('open-dialog');
  const list = document.getElementById('open-list');
  list.innerHTML = '';
  if (names.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'open-list-empty';
    empty.textContent = 'No saved notes';
    list.appendChild(empty);
  } else {
    names.forEach(name => {
      const item = document.createElement('div');
      item.className = 'open-list-item';
      item.textContent = name;
      item.addEventListener('click', async () => {
        dialog.close();
        await loadDocument(name);
        editor.focus();
      });
      list.appendChild(item);
    });
  }
  dialog.showModal();
}

// ── Find (BR-030) ───────────────────────────────────────────

function openFind() {
  findPosition = -1;
  const dialog = document.getElementById('find-dialog');
  dialog.show();
  document.getElementById('find-input').focus();
  closeAllMenus();
}

function findNext() {
  const term = document.getElementById('find-input').value;
  if (!term) return;
  const matchCase = document.getElementById('find-case').checked;
  const text = matchCase ? editor.value : editor.value.toLowerCase();
  const searchTerm = matchCase ? term : term.toLowerCase();
  const startPos = findPosition + 1;
  let idx = text.indexOf(searchTerm, startPos);
  if (idx === -1 && startPos > 0) {
    // Wrap around
    idx = text.indexOf(searchTerm, 0);
  }
  if (idx === -1) {
    alert('Not found: ' + term);
    return;
  }
  findPosition = idx;
  editor.focus();
  editor.setSelectionRange(idx, idx + term.length);
}

// ── Help Dialog (BR-028, BR-029) ───────────────────────────

function openHelp() {
  const dialog = document.getElementById('help-dialog');
  const content = document.getElementById('help-content');
  // Build table from MENUS (single source of truth — BR-029)
  const rows = [];
  for (const [menu, items] of Object.entries(MENUS)) {
    for (const item of items) {
      if (!item.separator && item.shortcut) {
        rows.push({ action: menu + ' > ' + item.label, shortcut: item.shortcut });
      }
    }
  }
  // Add Tab shortcut not in MENUS
  rows.push({ action: 'Insert tab character', shortcut: 'Tab' });

  content.innerHTML = '<table><thead><tr><th>Action</th><th>Shortcut</th></tr></thead><tbody>'
    + rows.map(r => `<tr><td>${r.action}</td><td>${r.shortcut}</td></tr>`).join('')
    + '</tbody></table>';
  dialog.showModal();
  closeAllMenus();
}

function showAbout() {
  document.getElementById('about-dialog').showModal();
  closeAllMenus();
}

// ── Menu Bar Builder ───────────────────────────────────────

let activeMenuBtn = null;
let activePanel = null;

function closeAllMenus() {
  if (activePanel) {
    activePanel.remove();
    activePanel = null;
  }
  if (activeMenuBtn) {
    activeMenuBtn.classList.remove('active');
    activeMenuBtn = null;
  }
}

function buildMenuPanel(menuName, items, btn) {
  const panel = document.createElement('div');
  panel.className = 'menu-panel';

  items.forEach(item => {
    if (item.separator) {
      const hr = document.createElement('div');
      hr.className = 'menu-separator';
      panel.appendChild(hr);
      return;
    }
    const el = document.createElement('div');
    el.className = 'menu-item';
    if (item.id) el.id = item.id;
    if (item.checkable && item.id === 'menu-word-wrap' && wordWrapEnabled) {
      el.classList.add('checked');
    }

    const labelSpan = document.createElement('span');
    labelSpan.className = 'menu-item-label';
    labelSpan.textContent = item.label;

    const shortcutSpan = document.createElement('span');
    shortcutSpan.className = 'menu-item-shortcut';
    shortcutSpan.textContent = item.shortcut || '';

    el.appendChild(labelSpan);
    el.appendChild(shortcutSpan);

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllMenus();
      item.handler();
    });

    panel.appendChild(el);
  });

  // Position panel below button
  const rect = btn.getBoundingClientRect();
  panel.style.left = rect.left + 'px';
  panel.style.top = rect.bottom + 'px';
  return panel;
}

function buildMenuBar() {
  menuBar.innerHTML = '';
  for (const [menuName, items] of Object.entries(MENUS)) {
    const btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.textContent = menuName;
    btn.setAttribute('role', 'menuitem');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeMenuBtn === btn) {
        closeAllMenus();
        return;
      }
      closeAllMenus();
      activeMenuBtn = btn;
      btn.classList.add('active');
      const panel = buildMenuPanel(menuName, items, btn);
      document.body.appendChild(panel);
      activePanel = panel;
    });
    menuBar.appendChild(btn);
  }
}

// ── Keyboard Shortcuts ──────────────────────────────────────

function handleKeyboard(e) {
  // Tab in editor → insert tab character (BR-004)
  if (e.target === editor && e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.substring(0, start) + '\t' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 1;
    setDirty();
    updateStatusBar();
    return;
  }

  if (e.key === 'F1') {
    e.preventDefault();
    openHelp();
    return;
  }

  if (!e.ctrlKey && !e.metaKey) return;

  switch (e.key.toLowerCase()) {
    case 'n':
      e.preventDefault();
      fileNew();
      break;
    case 's':
      e.preventDefault();
      fileSave();
      break;
    case 'o':
      e.preventDefault();
      fileOpen();
      break;
    case 'z':
      e.preventDefault();
      editUndo();
      break;
    case 'f':
      e.preventDefault();
      openFind();
      break;
  }
}

// ── Window Bounds Tracking (BR-026) ────────────────────────

let boundsTimer = null;

function saveBoundsDebounced() {
  if (boundsTimer) clearTimeout(boundsTimer);
  boundsTimer = setTimeout(() => {
    chrome.storage.local.set({
      windowState: {
        width: window.outerWidth,
        height: window.outerHeight,
        left: window.screenX,
        top: window.screenY,
      }
    });
    boundsTimer = null;
  }, 500);
}

// ── Init ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  buildMenuBar();

  // Restore word wrap
  await loadWordWrap();

  // Restore last file (BR-017)
  try {
    const stored = await chrome.storage.local.get('currentFile');
    if (stored.currentFile) {
      await loadDocument(stored.currentFile);
    }
  } catch (_) {
    // Not in extension context or no saved file
  }

  updateTitle();
  updateStatusBar();

  // Editor events
  editor.addEventListener('input', () => {
    scheduleUndoPush();
    setDirty();
    updateStatusBar();
  });
  editor.addEventListener('keyup', updateStatusBar);
  editor.addEventListener('click', updateStatusBar);
  editor.addEventListener('select', updateStatusBar);

  // Global keyboard handler
  document.addEventListener('keydown', handleKeyboard);

  // Close menus on outside click
  document.addEventListener('click', closeAllMenus);

  // Close menus on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activePanel) {
      closeAllMenus();
    }
  });

  // Find dialog events
  document.getElementById('find-next-btn').addEventListener('click', findNext);
  document.getElementById('find-close-btn').addEventListener('click', () => {
    document.getElementById('find-dialog').close();
  });
  document.getElementById('find-input').addEventListener('input', () => {
    findPosition = -1; // reset search position when term changes
  });
  document.getElementById('find-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') findNext();
  });

  // Help dialog close
  document.getElementById('help-close-btn').addEventListener('click', () => {
    document.getElementById('help-dialog').close();
  });

  // About dialog close
  document.getElementById('about-close-btn').addEventListener('click', () => {
    document.getElementById('about-dialog').close();
  });

  // Open dialog cancel
  document.getElementById('open-cancel-btn').addEventListener('click', () => {
    document.getElementById('open-dialog').close();
  });

  // Window bounds saving (BR-026)
  window.addEventListener('resize', saveBoundsDebounced);
  window.addEventListener('move', saveBoundsDebounced);

  // Focus editor
  editor.focus();
});
