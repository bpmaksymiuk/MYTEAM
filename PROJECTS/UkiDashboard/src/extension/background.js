const DASHBOARD_URL = chrome.runtime.getURL('window.html');
const WINDOW_KEY = 'ukiDashboardWindowId';

async function getWindowId() {
  const stored = await chrome.storage.session.get(WINDOW_KEY);
  return typeof stored[WINDOW_KEY] === 'number' ? stored[WINDOW_KEY] : null;
}

async function setWindowId(id) {
  await chrome.storage.session.set({ [WINDOW_KEY]: id });
}

async function clearWindowId() {
  await chrome.storage.session.remove(WINDOW_KEY);
}

async function focusExisting() {
  const id = await getWindowId();
  if (id === null) return false;
  try {
    await chrome.windows.update(id, { focused: true, drawAttention: true });
    return true;
  } catch {
    await clearWindowId();
    return false;
  }
}

async function openDashboardWindow() {
  if (await focusExisting()) return;

  const created = await chrome.windows.create({
    url: DASHBOARD_URL,
    type: 'popup',
    width: 1240,
    height: 860,
    focused: true
  });

  if (typeof created.id === 'number') {
    await setWindowId(created.id);
  }
}

chrome.action.onClicked.addListener(() => {
  openDashboardWindow();
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const tracked = await getWindowId();
  if (tracked === windowId) {
    await clearWindowId();
  }
});
