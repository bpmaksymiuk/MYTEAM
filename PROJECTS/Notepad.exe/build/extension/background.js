// background.js — Service worker for Notepad Chrome Extension
// Implements BR-026, BR-027: single window, position/size persistence

let notepadWindowId = null;

chrome.action.onClicked.addListener(async () => {
  if (notepadWindowId !== null) {
    try {
      await chrome.windows.get(notepadWindowId);
      await chrome.windows.update(notepadWindowId, { focused: true });
      return;
    } catch {
      notepadWindowId = null;
    }
  }
  const bounds = await getSavedBounds();
  const win = await chrome.windows.create({
    url: chrome.runtime.getURL('notepad.html'),
    type: 'popup',
    width: bounds.width,
    height: bounds.height,
    left: bounds.left,
    top: bounds.top,
  });
  notepadWindowId = win.id;
});

chrome.windows.onRemoved.addListener((id) => {
  if (id === notepadWindowId) notepadWindowId = null;
});

async function getSavedBounds() {
  const result = await chrome.storage.local.get('windowState');
  return result.windowState || { width: 800, height: 600, left: 100, top: 100 };
}
