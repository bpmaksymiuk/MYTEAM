// background.js — DI-001: Single-instance window management
// Implements BR-001: Standalone detached window on toolbar icon click

let storedWindowId = null;

chrome.action.onClicked.addListener(async () => {
  // Restore saved windowId from storage
  const stored = await chrome.storage.local.get('windowState');
  const state = stored.windowState || {};

  if (state.windowId) {
    // Validate the window still exists
    try {
      await chrome.windows.get(state.windowId);
      // Window exists — focus it
      await chrome.windows.update(state.windowId, { focused: true });
      return;
    } catch (e) {
      // Window no longer exists, clear stored id
      state.windowId = null;
    }
  }

  // Create new popup window
  const createParams = {
    type: 'popup',
    url: chrome.runtime.getURL('app.html'),
    width: state.width || 1200,
    height: state.height || 740,
  };
  if (state.left !== undefined) createParams.left = state.left;
  if (state.top !== undefined) createParams.top = state.top;

  const win = await chrome.windows.create(createParams);

  await chrome.storage.local.set({
    windowState: {
      windowId: win.id,
      width: win.width,
      height: win.height,
      left: win.left,
      top: win.top,
    }
  });
});

// Track window removal to clear stored windowId
chrome.windows.onRemoved.addListener(async (removedId) => {
  const stored = await chrome.storage.local.get('windowState');
  const state = stored.windowState || {};
  if (state.windowId === removedId) {
    await chrome.storage.local.set({ windowState: { ...state, windowId: null } });
  }
});

// Track window bounds changes to persist position/size
chrome.windows.onBoundsChanged.addListener(async (win) => {
  const stored = await chrome.storage.local.get('windowState');
  const state = stored.windowState || {};
  if (state.windowId === win.id) {
    await chrome.storage.local.set({
      windowState: {
        ...state,
        width: win.width,
        height: win.height,
        left: win.left,
        top: win.top,
      }
    });
  }
});
