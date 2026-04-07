// DI-002: Service Worker — Spreadsheet Window Lifecycle

let spreadsheetWindowId = null;

async function getStoredBounds() {
  return new Promise(resolve => {
    chrome.storage.local.get('windowBounds', data => {
      resolve(data.windowBounds || { left: 100, top: 100, width: 1024, height: 700 });
    });
  });
}

async function openOrFocusWindow() {
  if (spreadsheetWindowId !== null) {
    try {
      await chrome.windows.update(spreadsheetWindowId, { focused: true });
      return;
    } catch (_) {
      spreadsheetWindowId = null;
    }
  }
  const bounds = await getStoredBounds();
  const win = await chrome.windows.create({
    url: chrome.runtime.getURL('index.html'),
    type: 'popup',
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
  });
  spreadsheetWindowId = win.id;
}

chrome.action.onClicked.addListener(() => {
  openOrFocusWindow().catch(console.error);
});

chrome.windows.onBoundsChanged.addListener(win => {
  if (win.id !== spreadsheetWindowId) return;
  const { left, top, width, height } = win;
  chrome.storage.local.set({ windowBounds: { left, top, width, height } });
});

chrome.windows.onRemoved.addListener(id => {
  if (id === spreadsheetWindowId) {
    spreadsheetWindowId = null;
  }
});
