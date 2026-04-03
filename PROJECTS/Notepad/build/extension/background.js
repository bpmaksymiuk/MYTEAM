const WINDOW_STATE_KEY = "notepadWindowState";
const NOTEPAD_URL = chrome.runtime.getURL("popup.html");

async function getWindowState() {
  const stored = await chrome.storage.local.get(WINDOW_STATE_KEY);
  return stored[WINDOW_STATE_KEY] || {};
}

async function setWindowState(windowState) {
  await chrome.storage.local.set({ [WINDOW_STATE_KEY]: windowState });
}

async function focusExistingWindow(windowId) {
  try {
    await chrome.windows.get(windowId);
    await chrome.windows.update(windowId, { focused: true });
    return true;
  } catch {
    return false;
  }
}

function buildCreateData(geometry) {
  const createData = {
    url: NOTEPAD_URL,
    type: "popup",
    focused: true,
    width: Number.isFinite(geometry?.width) ? geometry.width : 780,
    height: Number.isFinite(geometry?.height) ? geometry.height : 580
  };
  if (Number.isFinite(geometry?.left)) {
    createData.left = geometry.left;
  }
  if (Number.isFinite(geometry?.top)) {
    createData.top = geometry.top;
  }
  return createData;
}

chrome.action.onClicked.addListener(async () => {
  const windowState = await getWindowState();

  if (windowState.windowId && (await focusExistingWindow(windowState.windowId))) {
    return;
  }

  const win = await chrome.windows.create(buildCreateData(windowState.geometry));
  await setWindowState({
    ...windowState,
    windowId: win.id
  });
});

chrome.windows.onBoundsChanged.addListener(async (win) => {
  const windowState = await getWindowState();
  if (win.id !== windowState.windowId) {
    return;
  }

  await setWindowState({
    ...windowState,
    geometry: {
      width: win.width,
      height: win.height,
      left: win.left,
      top: win.top
    }
  });
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const windowState = await getWindowState();
  if (windowId !== windowState.windowId) {
    return;
  }
  const { windowId: _removed, ...rest } = windowState;
  await setWindowState(rest);
});