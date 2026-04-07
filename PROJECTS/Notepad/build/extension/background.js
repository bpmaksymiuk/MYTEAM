// DI-002: Service Worker — Window Lifecycle Manager

let notepadWindowId = null;

async function getStoredBounds() {
  return new Promise(resolve => {
    chrome.storage.local.get('windowBounds', data => {
      resolve(data.windowBounds || { left: 100, top: 100, width: 700, height: 500 });
    });
  });
}

chrome.action.onClicked.addListener(async () => {
  try {
    if (notepadWindowId !== null) {
      await chrome.windows.update(notepadWindowId, { focused: true });
    } else {
      const bounds = await getStoredBounds();
      const win = await chrome.windows.create({
        url: chrome.runtime.getURL('notepad.html'),
        type: 'popup',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      });
      notepadWindowId = win.id;
    }
  } catch (err) {
    // Window may have been closed externally; create a fresh one
    notepadWindowId = null;
    try {
      const bounds = await getStoredBounds();
      const win = await chrome.windows.create({
        url: chrome.runtime.getURL('notepad.html'),
        type: 'popup',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      });
      notepadWindowId = win.id;
    } catch (innerErr) {
      console.error('Notepad: failed to open window', innerErr);
    }
  }
});

chrome.windows.onBoundsChanged.addListener(win => {
  if (win.id !== notepadWindowId) return;
  const { left, top, width, height } = win;
  chrome.storage.local.set({ windowBounds: { left, top, width, height } });
});

chrome.windows.onRemoved.addListener(removedId => {
  if (removedId === notepadWindowId) {
    notepadWindowId = null;
  }
});
