// DI-007 through DI-013: notepad.js — Application Logic (PT-005)
// Implements all editor interactions, menu routing, status bar, and help dialog.

import { saveNote, loadNote, listNotes, loadLastNoteName, saveGeometry } from './storage.js';

// ── Application State ─────────────────────────────────────────────────
const state = {
  filename:    null,   // null = "Untitled"
  isDirty:     false,  // unsaved-changes flag
  wordWrap:    false,
  fontSize:    14,     // px — for zoom
  openMenuId:  null,   // which menu (if any) is currently open
};

// ── DOMContentLoaded Entry Point ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const editor = document.getElementById('editor');

  // Restore last saved note (DI-007)
  const lastName = await loadLastNoteName();
  if (lastName) {
    const content = await loadNote(lastName);
    if (content !== null) {
      editor.value = content;
      state.filename = lastName;
    }
  }

  updateTitle();
  updateStatusBar();
  editor.focus();

  // Persist window geometry every 3 seconds (DI-007)
  setInterval(persistGeometry, 3000);

  // Wire up all subsystems
  initMenuBar();          // DI-008
  initKeyboardShortcuts();// DI-008
  initEditorListeners();  // DI-012
  initHelpModal();        // DI-013
});

// ── Title Bar ─────────────────────────────────────────────────────────
function updateTitle() {
  const name  = state.filename ?? 'Untitled';
  const dirty = state.isDirty ? '*' : '';
  document.title = `${dirty}${name} - Notepad`;
}

// ── Geometry Persistence ──────────────────────────────────────────────
async function persistGeometry() {
  await saveGeometry({
    top:    window.screenTop,
    left:   window.screenLeft,
    width:  window.outerWidth,
    height: window.outerHeight,
  });
}

// ── Status Bar Updates (DI-012) ───────────────────────────────────────
function updateStatusBar() {
  const editor = document.getElementById('editor');
  const text   = editor.value;
  const pos    = editor.selectionStart ?? 0;

  const before    = text.slice(0, pos);
  const lines     = before.split('\n');
  const ln        = lines.length;
  const col       = lines[lines.length - 1].length + 1;
  const charCount = text.length;

  document.getElementById('status-position').textContent = `Ln ${ln}, Col ${col}`;
  document.getElementById('status-chars').textContent    =
    `${charCount} character${charCount !== 1 ? 's' : ''}`;
  // encoding is always UTF-8 — set once in HTML; no update needed
}

function initEditorListeners() {
  const editor = document.getElementById('editor');
  editor.addEventListener('input', () => {
    if (!state.isDirty) {
      state.isDirty = true;
      updateTitle();
    }
    updateStatusBar();
  });
  editor.addEventListener('keyup',   updateStatusBar);
  editor.addEventListener('click',   updateStatusBar);
  editor.addEventListener('select',  updateStatusBar);
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === editor) updateStatusBar();
  });
}

// ── Menu Bar (DI-008) ─────────────────────────────────────────────────
function initMenuBar() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const menuId = item.dataset.menu;
      if (state.openMenuId === menuId) {
        closeMenus();
      } else {
        closeMenus();
        item.classList.add('active');
        state.openMenuId = menuId;
      }
    });
  });

  // Close menus on outside click
  document.addEventListener('click', closeMenus);

  // Route dropdown item actions
  document.querySelectorAll('.dropdown li[data-action]').forEach(li => {
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenus();
      handleAction(li.dataset.action);
    });
  });
}

function closeMenus() {
  document.querySelectorAll('.menu-item.active').forEach(i => i.classList.remove('active'));
  state.openMenuId = null;
}

// ── Keyboard Shortcuts (DI-008) ───────────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenus();
      closeHelpModal();
      return;
    }

    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;

    switch (e.key.toLowerCase()) {
      case 'n': e.preventDefault(); handleAction('new');                      break;
      case 'o': e.preventDefault(); handleAction('open');                     break;
      case 's': e.preventDefault(); handleAction(e.shiftKey ? 'saveas' : 'save'); break;
      case 'z': e.preventDefault(); handleAction('undo');                     break;
      case 'x': e.preventDefault(); handleAction('cut');                      break;
      case 'c': e.preventDefault(); handleAction('copy');                     break;
      case 'v': e.preventDefault(); handleAction('paste');                    break;
      case 'f': e.preventDefault(); handleAction('find');                     break;
      case 'h': e.preventDefault(); handleAction('replace');                  break;
      case 'a': e.preventDefault(); handleAction('selectall');                break;
      case '+':
      case '=': e.preventDefault(); handleAction('zoomin');                   break;
      case '-': e.preventDefault(); handleAction('zoomout');                  break;
      case '0': e.preventDefault(); handleAction('zoomreset');                break;
    }
  });
}

// ── Action Dispatcher (DI-008) ────────────────────────────────────────
function handleAction(action) {
  switch (action) {
    case 'new':      actionNew();      break;
    case 'open':     actionOpen();     break;
    case 'save':     actionSave();     break;
    case 'saveas':   actionSaveAs();   break;
    case 'exit':     window.close();   break;

    case 'undo':     document.execCommand('undo');  break;
    case 'cut':      document.execCommand('cut');   break;
    case 'copy':     document.execCommand('copy');  break;
    case 'paste':    document.execCommand('paste'); break;

    case 'find':     actionFind();     break;
    case 'replace':  actionReplace();  break;
    case 'selectall':
      document.getElementById('editor').select();
      break;

    case 'wordwrap': actionWordWrap(); break;
    case 'zoomin':   actionZoom(2);    break;
    case 'zoomout':  actionZoom(-2);   break;
    case 'zoomreset':actionZoom(0);    break;

    case 'viewhelp': openHelpModal();  break;
    case 'about':    actionAbout();    break;
  }
}

// ── File Menu Actions (DI-009) ────────────────────────────────────────
async function actionNew() {
  if (state.isDirty) {
    const ok = window.confirm('You have unsaved changes. Discard and create a new document?');
    if (!ok) return;
  }
  document.getElementById('editor').value = '';
  state.filename = null;
  state.isDirty  = false;
  updateTitle();
  updateStatusBar();
  document.getElementById('editor').focus();
}

async function actionOpen() {
  if (state.isDirty) {
    const ok = window.confirm('You have unsaved changes. Discard and open another file?');
    if (!ok) return;
  }
  const notes = await listNotes();
  if (notes.length === 0) {
    window.alert('No saved notes found.');
    return;
  }
  const nameList = notes.map((n, i) => `${i + 1}. ${n.name}`).join('\n');
  const input = window.prompt(`Enter the number or name of the note to open:\n\n${nameList}`);
  if (!input) return;

  const trimmed = input.trim();
  let note = notes.find(n => n.name === trimmed);
  if (!note) {
    const idx = parseInt(trimmed, 10) - 1;
    if (!Number.isNaN(idx) && idx >= 0 && idx < notes.length) {
      note = notes[idx];
    }
  }
  if (!note) {
    window.alert('Note not found.');
    return;
  }
  const content = await loadNote(note.name);
  document.getElementById('editor').value = content ?? '';
  state.filename = note.name;
  state.isDirty  = false;
  updateTitle();
  updateStatusBar();
}

async function actionSave() {
  let name = state.filename;
  if (!name) {
    const prompted = window.prompt('Save as:', 'Untitled.txt');
    if (prompted === null) return;
    name = prompted.trim() || 'Untitled.txt';
  }
  await saveNote(name, document.getElementById('editor').value);
  state.filename = name;
  state.isDirty  = false;
  updateTitle();
}

async function actionSaveAs() {
  const defaultName = state.filename ?? 'Untitled.txt';
  const prompted = window.prompt('Save As:', defaultName);
  if (prompted === null) return;
  const name = prompted.trim() || 'Untitled.txt';
  const content = document.getElementById('editor').value;

  // Persist to storage
  await saveNote(name, content);
  state.filename = name;
  state.isDirty  = false;
  updateTitle();

  // Trigger browser download (DI-009, AR-006)
  const downloadName = name.endsWith('.txt') ? name : name + '.txt';
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Edit Menu Actions (DI-010) ────────────────────────────────────────
function actionFind() {
  const term = window.prompt('Find:');
  if (!term) return;
  const editor = document.getElementById('editor');
  const text   = editor.value;
  const idx    = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) {
    window.alert(`"${term}" not found.`);
    return;
  }
  editor.focus();
  editor.setSelectionRange(idx, idx + term.length);
  updateStatusBar();
}

function actionReplace() {
  const term = window.prompt('Find:');
  if (!term) return;
  const replacement = window.prompt('Replace with:');
  if (replacement === null) return;
  const editor  = document.getElementById('editor');
  const text    = editor.value;
  const lower   = text.toLowerCase();
  const idx     = lower.indexOf(term.toLowerCase());
  if (idx === -1) {
    window.alert(`"${term}" not found.`);
    return;
  }
  const newText = text.slice(0, idx) + replacement + text.slice(idx + term.length);
  editor.value  = newText;
  editor.setSelectionRange(idx, idx + replacement.length);
  state.isDirty = true;
  updateTitle();
  updateStatusBar();
}

// ── View Menu Actions (DI-011) ────────────────────────────────────────
function actionWordWrap() {
  state.wordWrap = !state.wordWrap;
  document.body.classList.toggle('word-wrap', state.wordWrap);
  const item = document.getElementById('item-wordwrap');
  item.textContent = state.wordWrap ? '✓ Word Wrap' : 'Word Wrap';
}

function actionZoom(delta) {
  if (delta === 0) {
    state.fontSize = 14;
  } else {
    state.fontSize = Math.min(48, Math.max(8, state.fontSize + delta));
  }
  document.getElementById('editor').style.fontSize = `${state.fontSize}px`;
}

// ── Help Dialog (DI-013) ──────────────────────────────────────────────
function openHelpModal() {
  const modal = document.getElementById('help-modal');
  modal.removeAttribute('hidden');
  document.getElementById('help-close').focus();
}

function closeHelpModal() {
  const modal = document.getElementById('help-modal');
  if (!modal.hasAttribute('hidden')) {
    modal.setAttribute('hidden', '');
    document.getElementById('editor').focus();
  }
}

function initHelpModal() {
  document.getElementById('help-close').addEventListener('click', closeHelpModal);
  // Click outside the modal window to close
  document.getElementById('help-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeHelpModal();
  });
}

function actionAbout() {
  window.alert('Notepad.exe\nVersion 1.0\n\nA Windows Notepad-style text editor\nbuilt as a Chrome Extension.');
}
