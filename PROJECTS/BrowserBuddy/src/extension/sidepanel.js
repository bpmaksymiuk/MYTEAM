const STORAGE_KEYS = {
  NOTES: 'bb_notes',
  THEME: 'bb_theme',
  VIEW: 'bb_view',
  FAVORITES_DEFAULT_FOLDER_ID: 'bb_favorites_default_folder_id'
};

const THEMES = [
  { id: 'midnight-terminal', label: 'Midnight Terminal', vars: ['#07110b', '#102016', '#173123', '#d2ffe0', '#8acfa4', '#59f98f', '#2f4f3b'] },
  { id: 'sunset-neon', label: 'Sunset Neon', vars: ['#251014', '#3a151f', '#5e2231', '#ffe6ea', '#f6b4bf', '#ff7a90', '#6d3340'] },
  { id: 'coastal-mint', label: 'Coastal Mint', vars: ['#0f1b1c', '#162829', '#1d3a3c', '#dbf9f3', '#9fd9cd', '#43d5bd', '#315452'] },
  { id: 'solar-flare', label: 'Solar Flare', vars: ['#22170a', '#382510', '#5a3d1c', '#fff0dc', '#efc79c', '#ffad45', '#5d452a'] },
  { id: 'paper-ink', label: 'Paper Ink', vars: ['#f4f0e7', '#e9e3d3', '#ddd4be', '#1f2530', '#4b5463', '#2b405f', '#b8ab92'] },
  { id: 'arctic-signal', label: 'Arctic Signal', vars: ['#0e1a29', '#14243a', '#1d3656', '#e9f3ff', '#aac4e9', '#66a8ff', '#2f4a75'] },
  { id: 'orchard-night', label: 'Orchard Night', vars: ['#121b10', '#1c2a18', '#2a3a24', '#f0fae8', '#bed8a9', '#8ecf61', '#3e5b31'] },
  { id: 'retro-arcade', label: 'Retro Arcade', vars: ['#1a1028', '#28183e', '#39275a', '#f5edff', '#bea8e2', '#9b6dff', '#4a356e'] },
  { id: 'deep-ocean', label: 'Deep Ocean', vars: ['#08141f', '#102332', '#18374b', '#d9f3ff', '#94c4d9', '#50b8e8', '#2d5165'] },
  { id: 'sandstone', label: 'Sandstone', vars: ['#1f1812', '#30251e', '#4a392d', '#f9efe5', '#d9beaa', '#d28b57', '#624d3d'] },
  { id: 'forest-code', label: 'Forest Code', vars: ['#0c140e', '#141f17', '#233126', '#ddf3e1', '#98c9a4', '#58b56f', '#34513d'] },
  { id: 'city-lights', label: 'City Lights', vars: ['#10131c', '#191f2b', '#2d3649', '#e5ecfa', '#a8b7d9', '#73a1ff', '#3c4a63'] },
  { id: 'desert-dusk', label: 'Desert Dusk', vars: ['#261912', '#39241b', '#573a2c', '#fff0e8', '#e1bda8', '#e78d66', '#6b4a3a'] },
  { id: 'violet-ice', label: 'Violet Ice', vars: ['#14152a', '#1f2040', '#31325d', '#f0f1ff', '#b8b9e3', '#8e91ff', '#474a7a'] },
  { id: 'mono-steel', label: 'Mono Steel', vars: ['#141617', '#202426', '#2f3639', '#edf0f2', '#b4bcc1', '#8b9ba5', '#4b565d'] },
  { id: 'lotus-pink', label: 'Lotus Pink', vars: ['#29131f', '#3c1c2e', '#5b2d45', '#ffeaf4', '#e3adc7', '#ff78b3', '#6f3a57'] },
  { id: 'copper-wire', label: 'Copper Wire', vars: ['#22150e', '#352218', '#543627', '#ffefe2', '#ddbca6', '#d18357', '#6a4a38'] },
  { id: 'blueprint', label: 'Blueprint', vars: ['#0f1723', '#172234', '#243954', '#e5f0ff', '#9eb8db', '#6a96d9', '#385277'] },
  { id: 'citrus-lab', label: 'Citrus Lab', vars: ['#1c1e0d', '#2b2e14', '#44491f', '#fbfde8', '#d0d89c', '#bfd546', '#5d6630'] },
  { id: 'rose-noir', label: 'Rose Noir', vars: ['#1c1013', '#2d181d', '#44252d', '#ffeef0', '#d8abb4', '#df667a', '#5f3a44'] },
  { id: 'moon-glass', label: 'Moon Glass', vars: ['#0f1018', '#1a1c29', '#2a3044', '#edf2ff', '#adb8d4', '#7d96d9', '#3f4963'] }
];

const state = {
  notes: [],
  selectedNoteId: null,
  draggingNoteId: null,
  view: 'list',
  theme: 'midnight-terminal',
  tab: 'notes',
  captureActive: false,
  favorites: {
    currentId: null,
    currentTitle: 'Bookmarks',
    parentId: null,
    children: [],
    selectedIds: new Set(),
    defaultFolderId: null,
    folderOptions: []
  }
};

const el = {};

function q(id) {
  return document.getElementById(id);
}

async function init() {
  cacheElements();
  bindEvents();
  hydrateThemeSelect();
  setVersionLabel();
  await loadState();
  applyTheme(state.theme);
  applyViewMode(state.view);
  switchTab('notes');
  renderNotes();
  await hydrateFavoritesFolderSelect();
  await loadBookmarksRoot();
}

function cacheElements() {
  el.panel = document.querySelector('.panel');
  el.status = q('status-text');
  el.notesList = q('notes-list');
  el.favoritesList = q('favorites-list');
  el.favoritesPath = q('favorites-path');
  el.themeSelect = q('theme-select');
  el.brandVersion = q('brand-version');

  el.tabNotes = q('tab-notes');
  el.tabFavorites = q('tab-favorites');
  el.tabOptions = q('tab-options');

  el.viewNotes = q('view-notes');
  el.viewFavorites = q('view-favorites');
  el.viewOptions = q('view-options');

  el.addBtn = q('add-btn');
  el.captureBtn = q('capture-btn');
  el.cancelBtn = q('cancel-btn');
  el.copyBtn = q('copy-btn');
  el.editBtn = q('edit-btn');
  el.deleteBtn = q('delete-btn');
  el.listViewBtn = q('list-view-btn');
  el.gridViewBtn = q('grid-view-btn');
  el.themeBtn = q('theme-btn');

  el.favBackBtn = q('fav-back-btn');
  el.favAddBtn = q('fav-add-btn');
  el.favRemoveBtn = q('fav-remove-btn');
  el.favCopyBtn = q('fav-copy-btn');

  el.favoritesDefaultSelect = q('favorites-default-select');
  el.saveFavoritesDefaultBtn = q('save-favorites-default-btn');
}

function bindEvents() {
  el.tabNotes.addEventListener('click', () => switchTab('notes'));
  el.tabFavorites.addEventListener('click', () => switchTab('favorites'));
  el.tabOptions.addEventListener('click', () => switchTab('options'));

  el.addBtn.addEventListener('click', onAddNote);
  el.editBtn.addEventListener('click', onEditSelected);
  el.deleteBtn.addEventListener('click', onDeleteSelected);
  el.copyBtn.addEventListener('click', onCopySelected);

  el.captureBtn.addEventListener('click', beginCapture);
  el.cancelBtn.addEventListener('click', cancelCapture);

  el.listViewBtn.addEventListener('click', () => setView('list'));
  el.gridViewBtn.addEventListener('click', () => setView('grid'));

  el.themeSelect.addEventListener('change', (event) => setTheme(event.target.value));
  el.themeBtn.addEventListener('click', cycleTheme);

  el.favBackBtn.addEventListener('click', goParentFolder);
  el.favAddBtn.addEventListener('click', onAddFavorite);
  el.favRemoveBtn.addEventListener('click', onRemoveFavorites);
  el.favCopyBtn.addEventListener('click', onCopyFavorites);

  el.saveFavoritesDefaultBtn.addEventListener('click', onSaveFavoritesDefault);

  el.viewNotes.addEventListener('dragover', onNotesViewDragOver);
  el.viewNotes.addEventListener('dragleave', onNotesViewDragLeave);
  el.viewNotes.addEventListener('drop', onNotesViewDrop);

  el.notesList.addEventListener('dragover', onNotesListDragOver);
  el.notesList.addEventListener('dragleave', onNotesListDragLeave);
  el.notesList.addEventListener('drop', onNotesListDrop);

  chrome.runtime.onMessage.addListener(onRuntimeMessage);
}

function setVersionLabel() {
  try {
    const version = chrome.runtime.getManifest()?.version;
    el.brandVersion.textContent = version ? `v${version}` : 'v?.?.?';
  } catch {
    el.brandVersion.textContent = 'v?.?.?';
  }
}

function hydrateThemeSelect() {
  for (const theme of THEMES) {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.label;
    el.themeSelect.appendChild(option);
  }
}

async function loadState() {
  const stored = await chrome.storage.local.get([
    STORAGE_KEYS.NOTES,
    STORAGE_KEYS.THEME,
    STORAGE_KEYS.VIEW,
    STORAGE_KEYS.FAVORITES_DEFAULT_FOLDER_ID
  ]);

  state.notes = Array.isArray(stored[STORAGE_KEYS.NOTES]) ? stored[STORAGE_KEYS.NOTES] : [];
  state.theme = stored[STORAGE_KEYS.THEME] || 'midnight-terminal';
  state.view = stored[STORAGE_KEYS.VIEW] || 'list';
  state.favorites.defaultFolderId = stored[STORAGE_KEYS.FAVORITES_DEFAULT_FOLDER_ID] || null;

  el.themeSelect.value = state.theme;

  const viewChoice = document.querySelector(`input[name="view"][value="${state.view}"]`);
  if (viewChoice) viewChoice.checked = true;

  document.querySelectorAll('input[name="view"]').forEach((radio) => {
    radio.addEventListener('change', () => setView(radio.value));
  });
}

function saveNotes() {
  return chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: state.notes });
}

function setStatus(text, isError = false) {
  el.status.textContent = text;
  el.status.style.color = isError ? 'var(--danger)' : 'var(--text-1)';
}

function switchTab(name) {
  const tab = ['notes', 'favorites', 'options'].includes(name) ? name : 'notes';
  state.tab = tab;

  el.tabNotes.classList.toggle('active', tab === 'notes');
  el.tabFavorites.classList.toggle('active', tab === 'favorites');
  el.tabOptions.classList.toggle('active', tab === 'options');

  el.viewNotes.classList.toggle('active', tab === 'notes');
  el.viewFavorites.classList.toggle('active', tab === 'favorites');
  el.viewOptions.classList.toggle('active', tab === 'options');
}

function makeNote(title, body, screenshotDataUrl = null) {
  return {
    id: crypto.randomUUID(),
    title: title || 'Untitled',
    body: body || '',
    screenshotDataUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

async function onAddNote() {
  const title = prompt('Note title:');
  if (title === null) return;
  const body = prompt('Note text:') || '';
  state.notes.unshift(makeNote(title.trim(), body.trim()));
  await saveNotes();
  renderNotes();
  setStatus('Note added.');
}

async function onEditSelected() {
  const note = state.notes.find((n) => n.id === state.selectedNoteId);
  if (!note) return;

  const title = prompt('Edit title:', note.title);
  if (title === null) return;
  const body = prompt('Edit note text:', note.body);
  if (body === null) return;

  note.title = title.trim() || 'Untitled';
  note.body = body.trim();
  note.updatedAt = new Date().toISOString();
  await saveNotes();
  renderNotes();
  setStatus('Note updated.');
}

async function onDeleteSelected() {
  if (!state.selectedNoteId) return;
  state.notes = state.notes.filter((n) => n.id !== state.selectedNoteId);
  state.selectedNoteId = null;
  await saveNotes();
  renderNotes();
  setStatus('Note deleted.');
}

async function onCopySelected() {
  const note = state.notes.find((n) => n.id === state.selectedNoteId);
  if (!note) return;

  if (note.screenshotDataUrl) {
    try {
      const blob = await dataUrlToBlob(note.screenshotDataUrl);
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type || 'image/png']: blob
        })
      ]);
      setStatus('Captured image copied.');
      return;
    } catch {
      // Fall back to text copy when image clipboard is unavailable.
    }
  }

  const payload = `${note.title}\n${note.body}`;
  try {
    await navigator.clipboard.writeText(payload);
    setStatus('Selected note copied.');
  } catch {
    setStatus('Clipboard write failed.', true);
  }
}

function renderNotes() {
  el.notesList.innerHTML = '';
  el.notesList.classList.toggle('grid', state.view === 'grid');
  el.notesList.classList.toggle('list', state.view === 'list');

  for (const note of state.notes) {
    const item = document.createElement('li');
    item.className = 'note-item';
    if (note.id === state.selectedNoteId) item.classList.add('selected');
    item.draggable = true;
    item.dataset.noteId = note.id;

    const title = document.createElement('p');
    title.className = 'note-title';
    title.textContent = note.title;

    const body = document.createElement('p');
    body.className = 'note-body';
    body.textContent = note.body || '(empty note)';

    let preview = null;
    if (note.screenshotDataUrl) {
      preview = document.createElement('img');
      preview.src = note.screenshotDataUrl;
      preview.alt = note.title;
      preview.style.width = '100%';
      preview.style.borderRadius = '8px';
      preview.style.marginTop = '6px';
    }

    const meta = document.createElement('div');
    meta.className = 'note-meta';
    const left = document.createElement('span');
    left.textContent = note.screenshotDataUrl ? 'Capture' : 'Text';
    const right = document.createElement('span');
    right.textContent = new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    meta.append(left, right);

    item.append(title, body);
    if (preview) item.append(preview);
    item.append(meta);
    item.addEventListener('click', () => {
      state.selectedNoteId = note.id;
      renderNotes();
    });

    item.addEventListener('dragstart', (event) => {
      state.draggingNoteId = note.id;
      event.dataTransfer.setData('text/plain', `${note.title}\n${note.body}`.trim());
      event.dataTransfer.effectAllowed = 'copyMove';
    });

    item.addEventListener('dragend', () => {
      state.draggingNoteId = null;
    });

    item.addEventListener('dragover', (event) => event.preventDefault());
    item.addEventListener('drop', async (event) => {
      event.preventDefault();
      const draggedId = state.draggingNoteId;
      const targetId = note.id;
      if (!draggedId) return;
      event.stopPropagation();
      if (draggedId === targetId) return;

      const fromIndex = state.notes.findIndex((n) => n.id === draggedId);
      const toIndex = state.notes.findIndex((n) => n.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return;

      const [moved] = state.notes.splice(fromIndex, 1);
      state.notes.splice(toIndex, 0, moved);
      await saveNotes();
      renderNotes();
      state.draggingNoteId = null;
      setStatus('Notes reordered.');
    });

    el.notesList.appendChild(item);
  }

  const hasSelection = Boolean(state.notes.find((n) => n.id === state.selectedNoteId));
  el.copyBtn.disabled = !hasSelection;
  el.editBtn.disabled = !hasSelection;
  el.deleteBtn.disabled = !hasSelection;
}

function onNotesListDragOver(event) {
  event.preventDefault();
  el.notesList.classList.add('drop-target-active');
  event.dataTransfer.dropEffect = state.draggingNoteId ? 'move' : 'copy';
}

function onNotesViewDragOver(event) {
  event.preventDefault();
  el.notesList.classList.add('drop-target-active');
  event.dataTransfer.dropEffect = state.draggingNoteId ? 'move' : 'copy';
}

function onNotesViewDragLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  el.notesList.classList.remove('drop-target-active');
}

async function onNotesViewDrop(event) {
  event.preventDefault();
  el.notesList.classList.remove('drop-target-active');

  // Let the dedicated list handler process drops that occurred inside the list.
  if (event.target.closest('#notes-list')) return;

  if (state.draggingNoteId) {
    state.draggingNoteId = null;
    return;
  }

  const created = await createNoteFromDrop(event.dataTransfer);
  if (!created) return;

  state.notes.unshift(created);
  state.selectedNoteId = created.id;
  await saveNotes();
  renderNotes();
}

function onNotesListDragLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  el.notesList.classList.remove('drop-target-active');
}

async function onNotesListDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  el.notesList.classList.remove('drop-target-active');

  if (state.draggingNoteId) {
    state.draggingNoteId = null;
    return;
  }

  const created = await createNoteFromDrop(event.dataTransfer);
  if (!created) return;

  state.notes.unshift(created);
  state.selectedNoteId = created.id;
  await saveNotes();
  renderNotes();
}

async function createNoteFromDrop(dataTransfer) {
  if (!dataTransfer) {
    setStatus('Drop payload unavailable.', true);
    return null;
  }

  const imageDataUrl = await readDroppedImageDataUrl(dataTransfer);
  if (imageDataUrl) {
    setStatus('Dropped image saved as note.');
    return makeNote('Dropped image', 'Created from drag-and-drop image.', imageDataUrl);
  }

  const plainText = readDroppedPlainText(dataTransfer);
  if (plainText) {
    setStatus('Dropped text saved as note.');
    return makeNote('Dropped text', plainText);
  }

  setStatus('Unsupported drop content. Drop an image or plain text.', true);
  return null;
}

async function readDroppedImageDataUrl(dataTransfer) {
  const fileImage = readImageDataUrlFromFileList(dataTransfer.files);
  if (fileImage) return await fileImage;

  const html = dataTransfer.getData('text/html') || '';
  const htmlImage = await readImageDataUrlFromHtml(html);
  if (htmlImage) return htmlImage;

  const uriList = dataTransfer.getData('text/uri-list') || '';
  const firstUri = uriList
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'));
  if (firstUri) {
    const fetched = await readImageDataUrlFromUrl(firstUri);
    if (fetched) return fetched;
  }

  const maybeDataUrl = dataTransfer.getData('text/plain') || '';
  if (maybeDataUrl.startsWith('data:image/')) return maybeDataUrl;

  return null;
}

function readImageDataUrlFromFileList(fileList) {
  const file = [...(fileList || [])].find((candidate) => candidate.type?.startsWith('image/'));
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => reject(new Error('Failed to read dropped image file.'));
    reader.readAsDataURL(file);
  });
}

async function readImageDataUrlFromHtml(html) {
  if (!html) return null;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const src = doc.querySelector('img')?.src;
  if (!src) return null;
  if (src.startsWith('data:image/')) return src;
  return await readImageDataUrlFromUrl(src);
}

async function readImageDataUrlFromUrl(url) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) return null;
    return await blobToDataUrl(blob);
  } catch {
    return null;
  }
}

function readDroppedPlainText(dataTransfer) {
  const text = (dataTransfer.getData('text/plain') || '').trim();
  if (!text) {
    return null;
  }
  return text;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => reject(new Error('Failed to decode dropped image data.'));
    reader.readAsDataURL(blob);
  });
}

function setView(mode) {
  state.view = mode;
  chrome.storage.local.set({ [STORAGE_KEYS.VIEW]: mode });
  applyViewMode(mode);
  renderNotes();
}

function applyViewMode(mode) {
  el.listViewBtn.classList.toggle('active', mode === 'list');
  el.gridViewBtn.classList.toggle('active', mode === 'grid');
  const radio = document.querySelector(`input[name="view"][value="${mode}"]`);
  if (radio) radio.checked = true;
}

function setTheme(themeId) {
  state.theme = themeId;
  chrome.storage.local.set({ [STORAGE_KEYS.THEME]: themeId });
  applyTheme(themeId);
}

function cycleTheme() {
  const idx = THEMES.findIndex((t) => t.id === state.theme);
  const next = THEMES[(idx + 1) % THEMES.length];
  el.themeSelect.value = next.id;
  setTheme(next.id);
}

function applyTheme(themeId) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const [bg0, bg1, bg2, text0, text1, accent, border] = theme.vars;
  const root = document.documentElement.style;
  root.setProperty('--bg-0', bg0);
  root.setProperty('--bg-1', bg1);
  root.setProperty('--bg-2', bg2);
  root.setProperty('--text-0', text0);
  root.setProperty('--text-1', text1);
  root.setProperty('--accent', accent);
  root.setProperty('--border', border);
  el.panel.dataset.theme = theme.id;
}

async function onSaveFavoritesDefault() {
  const folderId = el.favoritesDefaultSelect.value || '';
  const finalId = folderId || null;
  state.favorites.defaultFolderId = finalId;
  await chrome.storage.local.set({ [STORAGE_KEYS.FAVORITES_DEFAULT_FOLDER_ID]: finalId });
  await loadBookmarksRoot();
  setStatus('Default favorites folder saved.');
}

async function beginCapture() {
  if (state.captureActive) return;
  state.captureActive = true;
  el.cancelBtn.disabled = false;
  setStatus('Capture mode active. Draw a region on the page.');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    setStatus('No active tab found.', true);
    state.captureActive = false;
    el.cancelBtn.disabled = true;
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'BEGIN_CAPTURE' });
  } catch {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
      });
      await chrome.tabs.sendMessage(tab.id, { type: 'BEGIN_CAPTURE' });
    } catch {
      setStatus('Failed to start capture.', true);
      state.captureActive = false;
      el.cancelBtn.disabled = true;
    }
  }
}

async function cancelCapture() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'CANCEL_CAPTURE' });
    } catch {
      // No-op.
    }
  }
  state.captureActive = false;
  el.cancelBtn.disabled = true;
  setStatus('Capture canceled.');
}

async function onRuntimeMessage(message) {
  if (message?.type === 'SELECTION_CANCELED') {
    state.captureActive = false;
    el.cancelBtn.disabled = true;
    setStatus('Capture canceled.');
    return;
  }

  if (message?.type !== 'SELECTION_COMPLETE') return;

  try {
    const response = await chrome.runtime.sendMessage({ type: 'CAPTURE_VISIBLE_TAB' });
    if (!response?.ok) throw new Error(response?.error || 'capture failed');

    const cropped = await cropDataUrl(response.dataUrl, message.rect, message.dpr || 1);
    const sourceLabel = message.pageUrl ? `Source: ${message.pageUrl}` : 'Captured image';
    const created = makeNote('Captured region', sourceLabel, cropped);
    state.notes.unshift(created);
    state.selectedNoteId = created.id;
    await saveNotes();
    renderNotes();

    try {
      const blob = await dataUrlToBlob(cropped);
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type || 'image/png']: blob
        })
      ]);
      setStatus('Captured region saved and image copied.');
    } catch {
      setStatus('Captured region saved as note.');
    }
  } catch {
    setStatus('Capture failed.', true);
  } finally {
    state.captureActive = false;
    el.cancelBtn.disabled = true;
  }
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function cropDataUrl(dataUrl, rect, dpr) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const sx = Math.max(0, Math.round(rect.x * dpr));
      const sy = Math.max(0, Math.round(rect.y * dpr));
      const sw = Math.max(1, Math.round(rect.width * dpr));
      const sh = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No canvas context'));
        return;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Image decode failed'));
    img.src = dataUrl;
  });
}

async function getBookmarksRoot() {
  const tree = await chrome.bookmarks.getTree();
  const root = tree[0];
  return root.children?.[0] || root;
}

async function hydrateFavoritesFolderSelect() {
  const root = await getBookmarksRoot();
  const flattened = [];

  function walk(node, depth) {
    if (!node.url) {
      flattened.push({ id: node.id, title: node.title || 'Bookmarks', depth });
    }
    for (const child of node.children || []) {
      if (!child.url) walk(child, depth + 1);
    }
  }

  walk(root, 0);
  state.favorites.folderOptions = flattened;

  el.favoritesDefaultSelect.innerHTML = '';
  for (const folder of flattened) {
    const opt = document.createElement('option');
    opt.value = folder.id;
    opt.textContent = `${'  '.repeat(folder.depth)}${folder.title}`;
    el.favoritesDefaultSelect.appendChild(opt);
  }

  if (state.favorites.defaultFolderId) {
    el.favoritesDefaultSelect.value = state.favorites.defaultFolderId;
  } else if (flattened.length) {
    el.favoritesDefaultSelect.value = flattened[0].id;
  }
}

async function loadBookmarksRoot() {
  const root = await getBookmarksRoot();
  const targetId = state.favorites.defaultFolderId;

  if (targetId) {
    try {
      const [node] = await chrome.bookmarks.get(targetId);
      if (node && !node.url) {
        await loadBookmarksFolder(node.id, node.title || 'Bookmarks', node.parentId || null);
        return;
      }
    } catch {
      setStatus('Default favorites folder was missing. Falling back to root.');
    }
  }

  await loadBookmarksFolder(root.id, root.title || 'Bookmarks', root.parentId || null);
}

async function loadBookmarksFolder(folderId, title, parentId = null) {
  const children = await chrome.bookmarks.getChildren(folderId);
  state.favorites.currentId = folderId;
  state.favorites.currentTitle = title || 'Bookmarks';
  state.favorites.parentId = parentId;
  state.favorites.children = children;
  state.favorites.selectedIds.clear();

  const current = await chrome.bookmarks.get(folderId);
  state.favorites.parentId = current[0]?.parentId || null;

  renderFavorites();
}

function renderFavorites() {
  el.favoritesPath.textContent = `Folder: ${state.favorites.currentTitle}`;
  el.favoritesList.innerHTML = '';

  for (const child of state.favorites.children) {
    const item = document.createElement('li');
    item.className = 'note-item';
    item.draggable = !child.url;

    const row = document.createElement('div');
    row.className = 'favorite-row';

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'favorite-check';
    check.checked = state.favorites.selectedIds.has(child.id);
    check.addEventListener('change', () => {
      if (check.checked) state.favorites.selectedIds.add(child.id);
      else state.favorites.selectedIds.delete(child.id);
      refreshFavoriteButtons();
    });

    const link = document.createElement(child.url ? 'a' : 'button');
    link.className = child.url ? 'favorite-link' : 'favorite-link favorite-folder';

    if (child.url) {
      link.href = child.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = child.title || child.url;
      const small = document.createElement('small');
      small.textContent = child.url;
      link.appendChild(small);

      item.draggable = true;
      item.addEventListener('dragstart', (event) => {
        const title = child.title || child.url;
        const url = child.url || '';
        event.dataTransfer.setData('text/plain', `${title}\n${url}`);
        event.dataTransfer.setData('text/uri-list', url);
        event.dataTransfer.setData('text/html', `<a href="${url}">${escapeHtml(title)}</a>`);
        event.dataTransfer.effectAllowed = 'copy';
      });
    } else {
      link.type = 'button';
      link.textContent = `📁 ${child.title || 'Untitled folder'}`;
      link.addEventListener('click', async () => {
        await loadBookmarksFolder(child.id, child.title || 'Folder', state.favorites.currentId);
      });
    }

    const meta = document.createElement('span');
    meta.className = 'note-meta';
    meta.textContent = child.url ? 'Link' : 'Folder';

    row.append(check, link, meta);
    item.appendChild(row);
    el.favoritesList.appendChild(item);
  }

  refreshFavoriteButtons();
}

function refreshFavoriteButtons() {
  const selectedCount = state.favorites.selectedIds.size;
  el.favCopyBtn.disabled = selectedCount === 0;
  el.favRemoveBtn.disabled = selectedCount === 0;
  el.favBackBtn.disabled = !state.favorites.parentId;
}

async function goParentFolder() {
  if (!state.favorites.parentId) return;
  const parent = await chrome.bookmarks.get(state.favorites.parentId);
  const node = parent[0];
  await loadBookmarksFolder(node.id, node.title || 'Bookmarks', node.parentId || null);
}

async function onAddFavorite() {
  const title = prompt('Favorite title:');
  if (title === null) return;
  const url = prompt('Favorite URL (leave empty for folder):', 'https://');
  try {
    if (url && url.trim() && url.trim() !== 'https://') {
      await chrome.bookmarks.create({
        parentId: state.favorites.currentId,
        title: title.trim() || url.trim(),
        url: url.trim()
      });
    } else {
      await chrome.bookmarks.create({
        parentId: state.favorites.currentId,
        title: title.trim() || 'New Folder'
      });
    }
    await hydrateFavoritesFolderSelect();
    await loadBookmarksFolder(state.favorites.currentId, state.favorites.currentTitle, state.favorites.parentId);
  } catch {
    setStatus('Failed to add favorite.', true);
  }
}

async function onRemoveFavorites() {
  const ids = [...state.favorites.selectedIds];
  if (!ids.length) return;

  for (const id of ids) {
    try {
      const node = await chrome.bookmarks.get(id);
      const target = node[0];
      if (target.url) await chrome.bookmarks.remove(id);
      else await chrome.bookmarks.removeTree(id);
    } catch {
      // Skip failed deletion and continue.
    }
  }

  await hydrateFavoritesFolderSelect();
  await loadBookmarksFolder(state.favorites.currentId, state.favorites.currentTitle, state.favorites.parentId);
}

async function onCopyFavorites() {
  const ids = [...state.favorites.selectedIds];
  if (!ids.length) return;

  const lines = [];
  for (const id of ids) {
    try {
      const [node] = await chrome.bookmarks.get(id);
      if (node.url) lines.push(`${node.title || node.url} - ${node.url}`);
    } catch {
      // Skip node retrieval failures.
    }
  }

  try {
    await navigator.clipboard.writeText(lines.join('\n'));
    setStatus('Selected favorites copied.');
  } catch {
    setStatus('Failed to copy favorites.', true);
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

init();
