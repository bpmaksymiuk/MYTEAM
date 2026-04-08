// background.js — DI-002
// Service worker: window lifecycle, single-instance enforcement, bounds persistence

chrome.action.onClicked.addListener(async () => {
  const { activeWindowId } = await chrome.storage.session.get('activeWindowId');
  if (activeWindowId) {
    try {
      await chrome.windows.update(activeWindowId, { focused: true });
      return;
    } catch (e) {
      // Window no longer exists — fall through to create a new one
    }
  }
  await openNotepadWindow();
});

async function openNotepadWindow() {
  const { windowBounds } = await chrome.storage.local.get('windowBounds');
  const bounds = windowBounds || { width: 800, height: 600, left: 100, top: 100 };
  const win = await chrome.windows.create({
    url: chrome.runtime.getURL('index.html'),
    type: 'popup',
    width: bounds.width,
    height: bounds.height,
    left: bounds.left,
    top: bounds.top
  });
  await chrome.storage.session.set({ activeWindowId: win.id });
}

chrome.windows.onRemoved.addListener(async (windowId) => {
  const { activeWindowId } = await chrome.storage.session.get('activeWindowId');
  if (windowId === activeWindowId) {
    await chrome.storage.session.remove('activeWindowId');
  }
});

chrome.windows.onBoundsChanged.addListener(async (win) => {
  const { activeWindowId } = await chrome.storage.session.get('activeWindowId');
  if (win.id === activeWindowId && win.width && win.height) {
    await chrome.storage.local.set({
      windowBounds: {
        width: win.width,
        height: win.height,
        left: win.left,
        top: win.top
      }
    });
  }
});
