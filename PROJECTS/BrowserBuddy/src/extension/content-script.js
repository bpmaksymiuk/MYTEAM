(() => {
  const OVERLAY_ID = 'browser-buddy-overlay';
  const BOX_ID = 'browser-buddy-box';

  let startX = 0;
  let startY = 0;
  let dragging = false;

  function removeUi() {
    document.getElementById(OVERLAY_ID)?.remove();
    document.getElementById(BOX_ID)?.remove();
    window.removeEventListener('mousedown', onMouseDown, true);
    window.removeEventListener('mousemove', onMouseMove, true);
    window.removeEventListener('mouseup', onMouseUp, true);
    window.removeEventListener('keydown', onKeyDown, true);
  }

  function ensureUi() {
    if (document.getElementById(OVERLAY_ID)) return;

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: 'rgba(0,0,0,0.15)',
      cursor: 'crosshair'
    });
    document.documentElement.appendChild(overlay);

    const box = document.createElement('div');
    box.id = BOX_ID;
    Object.assign(box.style, {
      position: 'fixed',
      border: '2px dashed #59f98f',
      background: 'rgba(89,249,143,0.15)',
      zIndex: '2147483647',
      pointerEvents: 'none',
      left: '0px',
      top: '0px',
      width: '0px',
      height: '0px'
    });
    document.documentElement.appendChild(box);

    window.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('mousemove', onMouseMove, true);
    window.addEventListener('mouseup', onMouseUp, true);
    window.addEventListener('keydown', onKeyDown, true);
  }

  function onMouseDown(event) {
    if (event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    updateBox(event.clientX, event.clientY);
    event.preventDefault();
    event.stopPropagation();
  }

  function onMouseMove(event) {
    if (!dragging) return;
    updateBox(event.clientX, event.clientY);
    event.preventDefault();
    event.stopPropagation();
  }

  function onMouseUp(event) {
    if (!dragging) return;
    dragging = false;

    const rect = getRect(startX, startY, event.clientX, event.clientY);
    removeUi();

    if (rect.width < 4 || rect.height < 4) {
      chrome.runtime.sendMessage({ type: 'SELECTION_CANCELED' });
      return;
    }

    chrome.runtime.sendMessage({
      type: 'SELECTION_COMPLETE',
      rect,
      dpr: window.devicePixelRatio || 1,
      pageUrl: location.href
    });

    event.preventDefault();
    event.stopPropagation();
  }

  function onKeyDown(event) {
    if (event.key !== 'Escape') return;
    removeUi();
    dragging = false;
    chrome.runtime.sendMessage({ type: 'SELECTION_CANCELED' });
    event.preventDefault();
    event.stopPropagation();
  }

  function getRect(x1, y1, x2, y2) {
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const width = Math.abs(x1 - x2);
    const height = Math.abs(y1 - y2);
    return { x: left, y: top, width, height };
  }

  function updateBox(currentX, currentY) {
    const box = document.getElementById(BOX_ID);
    if (!box) return;
    const rect = getRect(startX, startY, currentX, currentY);
    box.style.left = `${rect.x}px`;
    box.style.top = `${rect.y}px`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'PING') {
      sendResponse({ ok: true });
      return;
    }
    if (message?.type === 'BEGIN_CAPTURE') {
      ensureUi();
      sendResponse({ ok: true });
      return;
    }
    if (message?.type === 'CANCEL_CAPTURE') {
      dragging = false;
      removeUi();
      sendResponse({ ok: true });
    }
  });
})();
