chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch {
    // Ignore if API is unavailable.
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'CAPTURE_VISIBLE_TAB') return;

  chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
    if (chrome.runtime.lastError || !dataUrl) {
      sendResponse({ ok: false, error: chrome.runtime.lastError?.message || 'Capture failed.' });
      return;
    }
    sendResponse({ ok: true, dataUrl });
  });

  return true;
});
