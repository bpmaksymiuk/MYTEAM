// UC-02.BR-01.ARCH-01.DES-01 — Service worker: open side panel on action click
// UC-02.BR-04.ARCH-01.DES-01 — Relay tab screenshot requests from side panel

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'CAPTURE_VISIBLE_TAB') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, dataUrl => {
      if (chrome.runtime.lastError) {
        sendResponse({ ok: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ ok: true, dataUrl });
      }
    });
    return true; // keep channel open for async sendResponse
  }
});
