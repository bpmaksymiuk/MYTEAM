// DI-005 through DI-009: Editor Logic, Menus, Shortcuts, Help

// ── Shared State ──────────────────────────────────────────────────────────────
let isDirty = false;
let activeMenuId = null;

// ── Status Bar ────────────────────────────────────────────────────────────────
function showStatus(msg) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 2000);
}

// ── Dirty Tracking (DI-005) ───────────────────────────────────────────────────
function setDirty(value) {
  isDirty = value;
  const title = value ? '*Untitled - Notepad' : 'Untitled - Notepad';
  document.title = title;
  document.getElementById('title-text').textContent = title;
}

// ── Storage: Load (DI-005, DI-006) ───────────────────────────────────────────
function loadNote(onSuccess) {
  chrome.storage.local.get('noteContent', data => {
    if (chrome.runtime.lastError) {
      showStatus('Load failed.');
      return;
    }
    document.getElementById('editor').value = data.noteContent || '';
    setDirty(false);
    if (onSuccess) onSuccess();
  });
}

// ── Actions (DI-006) ─────────────────────────────────────────────────────────
function saveNote() {
  const content = document.getElementById('editor').value;
  chrome.storage.local.set({ noteContent: content }, () => {
    if (chrome.runtime.lastError) {
      showStatus('Save failed.');
      return;
    }
    setDirty(false);
    showStatus('Saved.');
  });
}

function newNote() {
  if (isDirty && !window.confirm('You have unsaved changes. Discard and create a new note?')) return;
  document.getElementById('editor').value = '';
  setDirty(false);
  showStatus('New note.');
}

function loadNoteFromStorage() {
  if (isDirty && !window.confirm('You have unsaved changes. Discard and load the saved note?')) return;
  loadNote(() => showStatus('Note loaded.'));
}

// ── File Download (DI-007) ───────────────────────────────────────────────────
function downloadNote() {
  const content = document.getElementById('editor').value;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'note.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Help Dialog (DI-009) ─────────────────────────────────────────────────────
function showHelp() {
  const tbody = document.querySelector('#shortcuts-table tbody');
  tbody.innerHTML = '';
  for (const items of Object.values(MENUS)) {
    for (const item of items) {
      if (!item.shortcut) continue;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${item.shortcut}</td><td>${item.label}</td>`;
      tbody.appendChild(tr);
    }
  }
  document.getElementById('help-dialog').showModal();
}

// ── MENUS: Single Source of Truth (DI-008) ───────────────────────────────────
const MENUS = {
  file: [
    { label: 'New',      shortcut: 'Ctrl+N',       action: newNote },
    { label: 'Save',     shortcut: 'Ctrl+S',       action: saveNote },
    { label: 'Load',     shortcut: 'Ctrl+O',       action: loadNoteFromStorage },
    { label: 'Download', shortcut: 'Ctrl+Shift+S', action: downloadNote },
  ],
  edit: [
    { label: 'Select All', shortcut: 'Ctrl+A',     action: () => document.getElementById('editor').select() },
  ],
  help: [
    { label: 'Help',     shortcut: 'F1',           action: showHelp },
  ],
};

// ── Menu Bar Dropdowns (DI-008) ───────────────────────────────────────────────
function closeDropdown() {
  document.getElementById('dropdown-container').innerHTML = '';
  activeMenuId = null;
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
}

function openMenu(menuId, btnEl) {
  if (activeMenuId === menuId) {
    closeDropdown();
    return;
  }
  closeDropdown();

  const items = MENUS[menuId];
  if (!items) return;

  const ul = document.createElement('ul');
  ul.className = 'dropdown';

  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.label}</span><span class="shortcut-label">${item.shortcut || ''}</span>`;
    li.addEventListener('mousedown', e => {
      e.preventDefault(); // prevent blur before action
      closeDropdown();
      item.action();
    });
    ul.appendChild(li);
  });

  // Position below the button
  const rect = btnEl.getBoundingClientRect();
  const menubarRect = document.getElementById('menubar').getBoundingClientRect();
  ul.style.left = (rect.left - menubarRect.left) + 'px';
  ul.style.top = '0px';

  document.getElementById('dropdown-container').appendChild(ul);
  btnEl.classList.add('active');
  activeMenuId = menuId;
}

function initMenus() {
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      openMenu(btn.dataset.menu, btn);
    });
  });

  document.addEventListener('mousedown', e => {
    if (!e.target.closest('#menubar') && !e.target.closest('#dropdown-container')) {
      closeDropdown();
    }
  });
}

// ── Keyboard Shortcuts (DI-008) ───────────────────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    for (const items of Object.values(MENUS)) {
      for (const item of items) {
        if (!item.shortcut) continue;
        if (matchesShortcut(e, item.shortcut)) {
          e.preventDefault();
          item.action();
          return;
        }
      }
    }
  });
}

function matchesShortcut(e, shortcut) {
  const parts = shortcut.toLowerCase().split('+');
  const needsCtrl  = parts.includes('ctrl');
  const needsShift = parts.includes('shift');
  const key = parts[parts.length - 1];

  if (needsCtrl  !== e.ctrlKey)  return false;
  if (needsShift !== e.shiftKey) return false;
  if (e.altKey || e.metaKey)     return false;
  return e.key.toLowerCase() === key || e.code.toLowerCase().replace('key', '') === key;
}

// ── Init (DI-005, DI-008, DI-009) ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');

  // Auto-load saved note and focus editor
  loadNote();
  editor.focus();

  // Dirty tracking
  editor.addEventListener('input', () => setDirty(true));

  // Menus and shortcuts
  initMenus();
  initKeyboardShortcuts();

  // Help dialog close button (DI-009)
  document.getElementById('help-close').addEventListener('click', () => {
    document.getElementById('help-dialog').close();
    editor.focus();
  });

  document.getElementById('help-dialog').addEventListener('cancel', () => {
    editor.focus();
  });
});
