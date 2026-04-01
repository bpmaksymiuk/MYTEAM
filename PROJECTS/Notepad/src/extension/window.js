const editor = document.getElementById('editor');
const statusIndicator = document.getElementById('status-indicator');
const docTitle = document.getElementById('doc-title');
const wordWrapState = document.getElementById('word-wrap-state');
const menuTriggers = Array.from(document.querySelectorAll('.menu-trigger'));
const menuPanels = Array.from(document.querySelectorAll('.menu-panel'));
const findDialog = document.getElementById('find-replace-dialog');
const findInput = document.getElementById('find-input');
const replaceInput = document.getElementById('replace-input');
const replaceLabel = document.getElementById('replace-label');
const findMatchCase = document.getElementById('find-match-case');
const findWrapAround = document.getElementById('find-wrap-around');
const findNextBtn = document.getElementById('find-next-btn');
const replaceBtn = document.getElementById('replace-btn');
const replaceAllBtn = document.getElementById('replace-all-btn');
const findCloseBtn = document.getElementById('find-close-btn');
const openInput = document.getElementById('file-open-input');
const windowCloseBtn = document.getElementById('window-close-btn');
const unsavedDialog = document.getElementById('unsaved-dialog');
const unsavedYesBtn = document.getElementById('unsaved-yes-btn');
const unsavedNoBtn = document.getElementById('unsaved-no-btn');
const unsavedCancelBtn = document.getElementById('unsaved-cancel-btn');
const autosaveIndicator = document.getElementById('autosave-indicator');

let isDirty = false;
let wordWrapEnabled = true;
let findMode = 'find';
let currentFileName = null;
let autosaveTimer = null;

const AUTOSAVE_KEY = 'notepadSnapshotV1';
const AUTOSAVE_DELAY_MS = 3000;
const STORAGE_WARN_BYTES = 4.5 * 1024 * 1024;

function renderTitle() {
  const baseName = currentFileName || 'Untitled';
  const base = `${baseName} - Notepad`;
  docTitle.textContent = isDirty ? `*${base}` : base;
  document.title = docTitle.textContent;
}

function normalizeFileName(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Untitled.txt';
  return trimmed.toLowerCase().endsWith('.txt') ? trimmed : `${trimmed}.txt`;
}

async function saveDocument(mode = 'save') {
  let nextName = currentFileName;
  if (mode === 'saveAs' || !nextName) {
    const proposed = window.prompt('Save file name', nextName || 'Untitled.txt');
    if (proposed === null) return false;
    nextName = normalizeFileName(proposed);
  }

  const blob = new Blob([editor.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nextName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  currentFileName = nextName;
  isDirty = false;
  renderTitle();
  await persistSnapshot('save');
  return true;
}

function estimateBytes(payload) {
  return new Blob([payload]).size;
}

function autosaveStatus(message) {
  autosaveIndicator.textContent = message;
}

function snapshotState() {
  return {
    content: editor.value,
    cursorStart: editor.selectionStart,
    cursorEnd: editor.selectionEnd,
    currentFileName,
    wordWrapEnabled,
    updatedAt: new Date().toISOString()
  };
}

async function persistSnapshot(reason = 'auto') {
  const snapshot = snapshotState();
  const payload = JSON.stringify(snapshot);
  const bytes = estimateBytes(payload);
  if (bytes >= STORAGE_WARN_BYTES) {
    autosaveStatus('Autosave: near storage limit');
  } else if (reason === 'auto') {
    autosaveStatus('Autosave: saved');
  } else {
    autosaveStatus(`Autosave: ${reason}`);
  }

  try {
    await chrome.storage.local.set({ [AUTOSAVE_KEY]: snapshot });
  } catch {
    autosaveStatus('Autosave: failed');
  }
}

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveStatus('Autosave: pending');
  autosaveTimer = setTimeout(() => {
    persistSnapshot('auto');
  }, AUTOSAVE_DELAY_MS);
}

async function restoreSnapshot() {
  try {
    const stored = await chrome.storage.local.get(AUTOSAVE_KEY);
    const snapshot = stored[AUTOSAVE_KEY];
    if (!snapshot) return;

    editor.value = typeof snapshot.content === 'string' ? snapshot.content : '';
    currentFileName = typeof snapshot.currentFileName === 'string' ? snapshot.currentFileName : null;
    isDirty = false;
    renderTitle();

    setWordWrap(snapshot.wordWrapEnabled !== false);
    const start = Number.isInteger(snapshot.cursorStart) ? snapshot.cursorStart : 0;
    const end = Number.isInteger(snapshot.cursorEnd) ? snapshot.cursorEnd : start;
    editor.setSelectionRange(start, end);
    updateCursorStatus();
    autosaveStatus('Autosave: restored');
  } catch {
    autosaveStatus('Autosave: restore failed');
  }
}

function askUnsavedChoice() {
  unsavedDialog.classList.remove('hidden');
  return new Promise((resolve) => {
    const cleanup = () => {
      unsavedDialog.classList.add('hidden');
      unsavedYesBtn.removeEventListener('click', onYes);
      unsavedNoBtn.removeEventListener('click', onNo);
      unsavedCancelBtn.removeEventListener('click', onCancel);
    };
    const onYes = () => {
      cleanup();
      resolve('yes');
    };
    const onNo = () => {
      cleanup();
      resolve('no');
    };
    const onCancel = () => {
      cleanup();
      resolve('cancel');
    };
    unsavedYesBtn.addEventListener('click', onYes);
    unsavedNoBtn.addEventListener('click', onNo);
    unsavedCancelBtn.addEventListener('click', onCancel);
  });
}

async function confirmUnsavedBeforeExit() {
  if (!isDirty) return true;

  const choice = await askUnsavedChoice();
  if (choice === 'cancel') return false;
  if (choice === 'no') return true;
  return await saveDocument('save');
}

async function exitNotepad() {
  const canExit = await confirmUnsavedBeforeExit();
  if (!canExit) return;

  await persistSnapshot('exit');
  window.close();
}

function confirmDiscardForDestructiveAction() {
  if (!isDirty) return true;
  return window.confirm('You have unsaved changes. Continue without saving?');
}

function onOpenDocumentRequested() {
  if (!confirmDiscardForDestructiveAction()) return;
  openInput.value = '';
  openInput.click();
}

async function onOpenDocumentSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    window.alert('Selected file is larger than 10 MB.');
    return;
  }

  const content = await file.text();
  editor.value = content;
  currentFileName = file.name;
  isDirty = false;
  renderTitle();
  updateCursorStatus();
  await persistSnapshot('open');
  editor.focus();
}

function closeMenus() {
  menuPanels.forEach((panel) => panel.classList.remove('open'));
  menuTriggers.forEach((trigger) => {
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  });
}

function openMenu(triggerId, panelId) {
  closeMenus();
  const trigger = document.getElementById(triggerId);
  const panel = document.getElementById(panelId);
  trigger.classList.add('open');
  trigger.setAttribute('aria-expanded', 'true');
  panel.classList.add('open');
}

function setWordWrap(nextValue) {
  wordWrapEnabled = nextValue;
  editor.style.whiteSpace = wordWrapEnabled ? 'pre-wrap' : 'pre';
  editor.style.overflowX = wordWrapEnabled ? 'hidden' : 'auto';
  wordWrapState.textContent = wordWrapEnabled ? 'On' : 'Off';
}

function insertAtSelection(text) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const before = editor.value.slice(0, start);
  const after = editor.value.slice(end);
  editor.value = `${before}${text}${after}`;
  const nextPos = start + text.length;
  editor.setSelectionRange(nextPos, nextPos);
  isDirty = true;
  renderTitle();
  scheduleAutosave();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalize(value, matchCase) {
  return matchCase ? value : value.toLowerCase();
}

function openFindDialog(mode) {
  findMode = mode;
  const replaceVisible = mode === 'replace';
  replaceLabel.classList.toggle('hidden', !replaceVisible);
  replaceInput.classList.toggle('hidden', !replaceVisible);
  replaceBtn.classList.toggle('hidden', !replaceVisible);
  replaceAllBtn.classList.toggle('hidden', !replaceVisible);
  findDialog.classList.remove('hidden');
  findInput.focus();
  findInput.select();
}

function closeFindDialog() {
  findDialog.classList.add('hidden');
  editor.focus();
}

function currentSelectionMatches(query, matchCase) {
  const selected = editor.value.slice(editor.selectionStart, editor.selectionEnd);
  return normalize(selected, matchCase) === normalize(query, matchCase);
}

function findNext(fromIndex = null) {
  const query = findInput.value;
  if (!query) return false;

  const content = editor.value;
  const matchCase = findMatchCase.checked;
  const wrapAround = findWrapAround.checked;
  const searchText = normalize(content, matchCase);
  const needle = normalize(query, matchCase);

  const startAt = fromIndex ?? editor.selectionEnd;
  let index = searchText.indexOf(needle, startAt);

  if (index === -1 && wrapAround) {
    index = searchText.indexOf(needle, 0);
  }

  if (index === -1) {
    return false;
  }

  editor.focus();
  editor.setSelectionRange(index, index + query.length);
  updateCursorStatus();
  return true;
}

function replaceCurrent() {
  const query = findInput.value;
  if (!query) return false;

  const matchCase = findMatchCase.checked;
  if (!currentSelectionMatches(query, matchCase)) {
    return findNext();
  }

  const replacement = replaceInput.value;
  insertAtSelection(replacement);
  const nextStart = editor.selectionStart;
  return findNext(nextStart);
}

function replaceAll() {
  const query = findInput.value;
  if (!query) return 0;

  const replacement = replaceInput.value;
  const flags = `g${findMatchCase.checked ? '' : 'i'}`;
  const pattern = new RegExp(escapeRegex(query), flags);
  const matches = editor.value.match(pattern);
  const count = matches ? matches.length : 0;
  if (!count) return 0;

  editor.value = editor.value.replace(pattern, () => replacement);
  isDirty = true;
  renderTitle();
  updateCursorStatus();
  editor.focus();
  return count;
}

function onNewDocument() {
  if (!confirmDiscardForDestructiveAction()) return;
  editor.value = '';
  currentFileName = null;
  isDirty = false;
  renderTitle();
  updateCursorStatus();
  persistSnapshot('new');
  editor.focus();
}

function execEditingCommand(command) {
  editor.focus();
  if (command === 'delete') {
    insertAtSelection('');
    return;
  }
  if (command === 'timeDate') {
    insertAtSelection(new Date().toLocaleString());
    return;
  }
  document.execCommand(command);
}

function updateCursorStatus() {
  const position = editor.selectionStart;
  const contentBefore = editor.value.slice(0, position);
  const lines = contentBefore.split('\n');
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;
  statusIndicator.textContent = `Ln ${line}, Col ${col}`;
}

window.addEventListener('DOMContentLoaded', async () => {
  await restoreSnapshot();
  renderTitle();
  if (!editor.value) {
    setWordWrap(true);
  }

  document.getElementById('menu-file').addEventListener('click', () => openMenu('menu-file', 'panel-file'));
  document.getElementById('menu-edit').addEventListener('click', () => openMenu('menu-edit', 'panel-edit'));
  document.getElementById('menu-format').addEventListener('click', () => openMenu('menu-format', 'panel-format'));

  document.getElementById('cmd-new').addEventListener('click', () => {
    closeMenus();
    onNewDocument();
  });
  document.getElementById('cmd-open').addEventListener('click', () => {
    closeMenus();
    onOpenDocumentRequested();
  });
  document.getElementById('cmd-save').addEventListener('click', async () => {
    closeMenus();
    await saveDocument('save');
  });
  document.getElementById('cmd-save-as').addEventListener('click', async () => {
    closeMenus();
    await saveDocument('saveAs');
  });
  document.getElementById('cmd-exit').addEventListener('click', async () => {
    closeMenus();
    await exitNotepad();
  });

  document.getElementById('cmd-undo').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('undo');
  });
  document.getElementById('cmd-redo').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('redo');
  });
  document.getElementById('cmd-cut').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('cut');
  });
  document.getElementById('cmd-copy').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('copy');
  });
  document.getElementById('cmd-paste').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('paste');
  });
  document.getElementById('cmd-delete').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('delete');
  });
  document.getElementById('cmd-select-all').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('selectAll');
  });
  document.getElementById('cmd-time-date').addEventListener('click', () => {
    closeMenus();
    execEditingCommand('timeDate');
  });
  document.getElementById('cmd-find').addEventListener('click', () => {
    closeMenus();
    openFindDialog('find');
  });
  document.getElementById('cmd-replace').addEventListener('click', () => {
    closeMenus();
    openFindDialog('replace');
  });
  document.getElementById('cmd-word-wrap').addEventListener('click', () => {
    closeMenus();
    setWordWrap(!wordWrapEnabled);
  });

  findNextBtn.addEventListener('click', () => {
    findNext();
  });
  replaceBtn.addEventListener('click', () => {
    replaceCurrent();
  });
  replaceAllBtn.addEventListener('click', () => {
    replaceAll();
  });
  findCloseBtn.addEventListener('click', () => {
    closeFindDialog();
  });

  findInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (findMode === 'replace') replaceCurrent();
      else findNext();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeFindDialog();
    }
  });

  openInput.addEventListener('change', (event) => {
    onOpenDocumentSelected(event);
  });

  windowCloseBtn.addEventListener('click', async () => {
    await exitNotepad();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-group')) {
      closeMenus();
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (event.ctrlKey && key === 'n') {
      event.preventDefault();
      onNewDocument();
      return;
    }
    if (event.ctrlKey && key === 'o') {
      event.preventDefault();
      onOpenDocumentRequested();
      return;
    }
    if (event.ctrlKey && key === 's') {
      event.preventDefault();
      if (event.shiftKey) {
        saveDocument('saveAs');
      } else {
        saveDocument('save');
      }
      return;
    }
    if (event.ctrlKey && key === 'f') {
      event.preventDefault();
      openFindDialog('find');
      return;
    }
    if (event.ctrlKey && key === 'h') {
      event.preventDefault();
      openFindDialog('replace');
      return;
    }
    if (event.key === 'F5') {
      event.preventDefault();
      execEditingCommand('timeDate');
      return;
    }
    if (event.key === 'Escape' && !findDialog.classList.contains('hidden')) {
      event.preventDefault();
      closeFindDialog();
      return;
    }
    if (event.key === 'Delete') {
      execEditingCommand('delete');
    }
  });

  window.addEventListener('beforeunload', async (event) => {
    clearTimeout(autosaveTimer);
    if (isDirty) {
      event.preventDefault();
      event.returnValue = '';
    }
    await persistSnapshot('close');
  });

  editor.focus();
  updateCursorStatus();
});

editor.addEventListener('keyup', updateCursorStatus);
editor.addEventListener('click', updateCursorStatus);
editor.addEventListener('select', updateCursorStatus);
editor.addEventListener('input', () => {
  isDirty = true;
  renderTitle();
  updateCursorStatus();
  scheduleAutosave();
});
