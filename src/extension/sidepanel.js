const STORAGE_NOTES = 'buddy_notes';
const STORAGE_SETTINGS = 'buddy_settings';
const PALETTE = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

let notes = [];
let settings = { theme: 'light', viewMode: 'list' };
let selectedNoteId = null;
let captureTabId = null;

const panel = document.querySelector('.panel');
const statusText = document.getElementById('status-text');
const notesList = document.getElementById('notes-list');

const tabNotes = document.getElementById('tab-notes');
const tabOptions = document.getElementById('tab-options');
const viewNotes = document.getElementById('view-notes');
const viewOptions = document.getElementById('view-options');

const themeBtn = document.getElementById('theme-btn');
const addBtn = document.getElementById('add-btn');
const captureBtn = document.getElementById('capture-btn');
const cancelBtn = document.getElementById('cancel-btn');
const copyBtn = document.getElementById('copy-btn');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const listViewBtn = document.getElementById('list-view-btn');
const gridViewBtn = document.getElementById('grid-view-btn');

const brandIcon = document.getElementById('brand-icon');

boot();

async function boot() {
  await loadState();
  applyTheme(settings.theme);
  setViewMode(settings.viewMode);
  renderNotes();
  bindEvents();
  syncOptionsControls();
}

function bindEvents() {
  tabNotes.addEventListener('click', () => switchTab('notes'));
  tabOptions.addEventListener('click', () => switchTab('options'));

  themeBtn.addEventListener('click', () => {
    const next = settings.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    saveSettings();
    syncOptionsControls();
  });

  addBtn.addEventListener('click', onAddNote);
  captureBtn.addEventListener('click', onStartCapture);
  cancelBtn.addEventListener('click', onCancelCapture);
  copyBtn.addEventListener('click', onCopySelected);
  editBtn.addEventListener('click', onEditSelected);
  deleteBtn.addEventListener('click', onDeleteSelected);
  listViewBtn.addEventListener('click', () => setViewMode('list', true));
  gridViewBtn.addEventListener('click', () => setViewMode('grid', true));

  for (const input of document.querySelectorAll('input[name="theme"]')) {
    input.addEventListener('change', () => {
      applyTheme(input.value);
      saveSettings();
    });
  }
  for (const input of document.querySelectorAll('input[name="view"]')) {
    input.addEventListener('change', () => setViewMode(input.value, true));
  }

  brandIcon.addEventListener('error', () => {
    brandIcon.style.display = 'none';
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SELECTION_COMPLETE') {
    handleSelectionComplete(message);
  } else if (message.type === 'SELECTION_CANCELED') {
    resetCaptureState('Capture canceled.');
  }
});

function switchTab(tab) {
  const showNotes = tab !== 'options';
  tabNotes.classList.toggle('active', showNotes);
  tabOptions.classList.toggle('active', !showNotes);
  viewNotes.classList.toggle('active', showNotes);
  viewOptions.classList.toggle('active', !showNotes);
}

function applyTheme(theme) {
  settings.theme = theme === 'dark' ? 'dark' : 'light';
  panel.setAttribute('data-theme', settings.theme);
}

function setViewMode(mode, persist = false) {
  settings.viewMode = mode === 'grid' ? 'grid' : 'list';
  notesList.classList.toggle('grid', settings.viewMode === 'grid');
  notesList.classList.toggle('list', settings.viewMode === 'list');
  listViewBtn.classList.toggle('active', settings.viewMode === 'list');
  gridViewBtn.classList.toggle('active', settings.viewMode === 'grid');
  if (persist) {
    saveSettings();
    syncOptionsControls();
  }
}

function syncOptionsControls() {
  for (const input of document.querySelectorAll('input[name="theme"]')) {
    input.checked = input.value === settings.theme;
  }
  for (const input of document.querySelectorAll('input[name="view"]')) {
    input.checked = input.value === settings.viewMode;
  }
}

async function loadState() {
  const result = await chrome.storage.local.get([STORAGE_NOTES, STORAGE_SETTINGS]);
  notes = Array.isArray(result[STORAGE_NOTES]) ? result[STORAGE_NOTES] : [];
  settings = { ...settings, ...(result[STORAGE_SETTINGS] || {}) };
}

async function saveNotes() {
  await chrome.storage.local.set({ [STORAGE_NOTES]: notes });
}

async function saveSettings() {
  await chrome.storage.local.set({ [STORAGE_SETTINGS]: settings });
}

function onAddNote() {
  const content = prompt('Enter note text:');
  if (content === null) return;
  if (!content.trim()) {
    showStatus('Note cannot be empty.');
    return;
  }
  const note = {
    id: crypto.randomUUID(),
    content: content.trim(),
    color: PALETTE[notes.length % PALETTE.length],
    createdAt: new Date().toISOString(),
  };
  notes.unshift(note);
  selectedNoteId = note.id;
  saveNotes().then(renderNotes);
  showStatus('Note added.');
}

function onEditSelected() {
  const note = notes.find(n => n.id === selectedNoteId);
  if (!note || note.imageDataUrl) return;
  const updated = prompt('Edit note text:', note.content);
  if (updated === null) return;
  if (!updated.trim()) {
    showStatus('Note cannot be empty.');
    return;
  }
  note.content = updated.trim();
  saveNotes().then(renderNotes);
  showStatus('Note updated.');
}

function onDeleteSelected() {
  if (!selectedNoteId) return;
  notes = notes.filter(n => n.id !== selectedNoteId);
  selectedNoteId = null;
  saveNotes().then(renderNotes);
  showStatus('Note deleted.');
}

async function onCopySelected() {
  const note = notes.find(n => n.id === selectedNoteId);
  if (!note) return;
  try {
    if (note.imageDataUrl) {
      const blob = await fetch(note.imageDataUrl).then(r => r.blob());
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    } else {
      await navigator.clipboard.writeText(note.content);
    }
    showStatus('Copied.');
  } catch {
    showStatus('Copy failed: clipboard permission denied.');
  }
}

async function onStartCapture() {
  const tab = await getActiveTab();
  if (!tab?.id) {
    showStatus('No active tab found.');
    return;
  }
  captureTabId = tab.id;
  try {
    await ensureContentScript(captureTabId);
    chrome.tabs.sendMessage(captureTabId, { type: 'BEGIN_CAPTURE' });
    captureBtn.disabled = true;
    cancelBtn.disabled = false;
    showStatus('Drag to select a page region.');
  } catch {
    resetCaptureState('Capture is not available on this page.');
  }
}

function onCancelCapture() {
  if (captureTabId) {
    chrome.tabs.sendMessage(captureTabId, { type: 'CANCEL_CAPTURE' }).catch(() => {});
  }
  resetCaptureState('Capture canceled.');
}

async function handleSelectionComplete(message) {
  const response = await new Promise(resolve =>
    chrome.runtime.sendMessage({ type: 'CAPTURE_VISIBLE_TAB' }, resolve)
  );
  if (!response?.ok) {
    resetCaptureState('Capture failed.');
    return;
  }
  const imageDataUrl = await cropDataUrl(response.dataUrl, message.rect, message.dpr);
  const host = message.pageUrl ? safeHost(message.pageUrl) : 'page';
  const note = {
    id: crypto.randomUUID(),
    content: `Captured region from ${host}`,
    color: PALETTE[notes.length % PALETTE.length],
    createdAt: new Date().toISOString(),
    imageDataUrl,
  };
  notes.unshift(note);
  selectedNoteId = note.id;
  await saveNotes();
  renderNotes();
  resetCaptureState('Capture saved as note.');
}

function resetCaptureState(msg = '') {
  captureTabId = null;
  captureBtn.disabled = false;
  cancelBtn.disabled = true;
  showStatus(msg);
}

function renderNotes() {
  notesList.innerHTML = '';
  if (notes.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = 'No notes yet.';
    notesList.appendChild(li);
    updateSelectionControls();
    return;
  }

  for (const note of notes) {
    const li = document.createElement('li');
    li.className = `note-item ${sanitizeColor(note.color)}${note.id === selectedNoteId ? ' selected' : ''}`;
    li.addEventListener('click', () => {
      selectedNoteId = note.id;
      renderNotes();
    });

    if (note.imageDataUrl) {
      const img = document.createElement('img');
      img.className = 'note-image';
      img.src = note.imageDataUrl;
      img.alt = 'Captured note image';
      li.appendChild(img);
    }

    const text = document.createElement('div');
    text.className = 'note-text';
    text.textContent = note.content;
    li.appendChild(text);

    const meta = document.createElement('div');
    meta.className = 'note-meta';
    meta.textContent = new Date(note.createdAt).toLocaleString();
    li.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'note-actions';
    actions.appendChild(makeMiniBtn('↑', 'Move up', () => moveNote(note.id, -1)));
    actions.appendChild(makeMiniBtn('↓', 'Move down', () => moveNote(note.id, 1)));
    li.appendChild(actions);

    notesList.appendChild(li);
  }
  updateSelectionControls();
}

function makeMiniBtn(symbol, label, handler) {
  const btn = document.createElement('button');
  btn.className = 'icon-btn';
  btn.type = 'button';
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.textContent = symbol;
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    handler();
  });
  return btn;
}

function moveNote(noteId, delta) {
  const index = notes.findIndex(n => n.id === noteId);
  if (index < 0) return;
  const target = index + delta;
  if (target < 0 || target >= notes.length) return;
  const [item] = notes.splice(index, 1);
  notes.splice(target, 0, item);
  saveNotes().then(renderNotes);
}

function updateSelectionControls() {
  const note = notes.find(n => n.id === selectedNoteId);
  const hasSelection = !!note;
  copyBtn.disabled = !hasSelection;
  deleteBtn.disabled = !hasSelection;
  editBtn.disabled = !hasSelection || !!note?.imageDataUrl;
}

function sanitizeColor(color) {
  return PALETTE.includes(color) ? color : 'c1';
}

function showStatus(msg) {
  statusText.textContent = msg;
  if (msg) {
    setTimeout(() => {
      if (statusText.textContent === msg) statusText.textContent = '';
    }, 2800);
  }
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function ensureContentScript(tabId) {
  const ready = await new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, { type: 'PING' }, response => {
      resolve(!chrome.runtime.lastError && response?.ok === true);
    });
  });
  if (!ready) {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content-script.js'] });
  }
}

function cropDataUrl(dataUrl, rect, dpr) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        rect.x * dpr,
        rect.y * dpr,
        rect.width * dpr,
        rect.height * dpr,
        0,
        0,
        canvas.width,
        canvas.height
      );
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

function safeHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return 'page';
  }
}
