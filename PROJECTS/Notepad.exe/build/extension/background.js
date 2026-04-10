// DI-003: background.js — Background Service Worker (PT-002)
// Handles extension icon click: focus existing Notepad window or create a new one.

import { saveGeometry, loadGeometry } from './storage.js';

const WINDOW_ID_KEY = 'notepadWindowId';

chrome.action.onClicked.addListener(async () => {
  const stored = await chrome.storage.local.get([WINDOW_ID_KEY]);
  const existingId = stored[WINDOW_ID_KEY];

  if (existingId != null) {
    try {
      const win = await chrome.windows.get(existingId);
      if (win) {
        await chrome.windows.update(existingId, { focused: true });
        return;
      }
    } catch (_) {
      // Window no longer exists — fall through to create a new one
    }
  }

  const geometry = await loadGeometry();
  const newWin = await chrome.windows.create({
    url: chrome.runtime.getURL('notepad.html'),
    type: 'popup',
    width:  geometry?.width  ?? 800,
    height: geometry?.height ?? 600,
    left:   geometry?.left   ?? 100,
    top:    geometry?.top    ?? 100,
  });

  await chrome.storage.local.set({ [WINDOW_ID_KEY]: newWin.id });
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const stored = await chrome.storage.local.get([WINDOW_ID_KEY]);
  if (stored[WINDOW_ID_KEY] === windowId) {
    await chrome.storage.local.remove(WINDOW_ID_KEY);
  }
});
