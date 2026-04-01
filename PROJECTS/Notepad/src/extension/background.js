const WINDOW_URL = chrome.runtime.getURL('window.html');
const WINDOW_KEY = 'notepadWindowId';

async function getStoredWindowId() {
  const stored = await chrome.storage.session.get(WINDOW_KEY);
  return typeof stored[WINDOW_KEY] === 'number' ? stored[WINDOW_KEY] : null;
}

async function storeWindowId(id) {
  await chrome.storage.session.set({ [WINDOW_KEY]: id });
}

async function clearWindowId() {
  await chrome.storage.session.remove(WINDOW_KEY);
}

async function focusExistingWindow() {
  const id = await getStoredWindowId();
  if (id === null) return false;

  try {
    await chrome.windows.update(id, { focused: true, drawAttention: true });
    return true;
  } catch {
    await clearWindowId();
    return false;
  }
}

async function openNotepadWindow() {
  if (await focusExistingWindow()) return;

  const created = await chrome.windows.create({
    url: WINDOW_URL,
    type: 'popup',
    focused: true,
    width: 860,
    height: 620
  });

  if (typeof created.id === 'number') {
    await storeWindowId(created.id);
  }
}

chrome.action.onClicked.addListener(() => {
  openNotepadWindow();
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-notepad-window') {
    openNotepadWindow();
  }
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const stored = await getStoredWindowId();
  if (stored === windowId) {
    await clearWindowId();
  }
});
