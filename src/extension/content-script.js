// UC-02.BR-03.ARCH-01.DES-01 — Page overlay for rectangle selection
// UC-02.BR-04.ARCH-01.DES-01 — Produce selection rect and relay to side panel

(() => {
  // Guard: prevent double-injection if the script is re-executed
  if (window.__buddyContentScriptLoaded) return;
  window.__buddyContentScriptLoaded = true;

  let overlay = null;
  let selectionBox = null;
  let startPos = null;
  let isSelecting = false;

  // ── Message handler ──────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'PING') {
      sendResponse({ ok: true });
    } else if (message.type === 'BEGIN_CAPTURE') {
      beginCapture();
      sendResponse({ ok: true });
    } else if (message.type === 'CANCEL_CAPTURE') {
      cleanup();
      sendResponse({ ok: true });
    }
    // Return false: all responses are synchronous
  });

  // ── Selection overlay ────────────────────────────────────────────────────

  function beginCapture() {
    if (overlay) cleanup(); // reset if already active

    overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2147483647',
      'cursor:crosshair', 'background:rgba(0,0,0,0.12)',
      'user-select:none',
    ].join(';');

    selectionBox = document.createElement('div');
    selectionBox.style.cssText = [
      'position:fixed', 'display:none',
      'border:2px dashed #4a90d9',
      'background:rgba(74,144,217,0.15)',
      'pointer-events:none', 'box-sizing:border-box',
    ].join(';');

    overlay.appendChild(selectionBox);
    document.body.appendChild(overlay);
    isSelecting = false;

    overlay.addEventListener('pointerdown', onPointerDown);
    overlay.addEventListener('pointermove', onPointerMove);
    overlay.addEventListener('pointerup',   onPointerUp);
    document.addEventListener('keydown',    onKeyDown);
  }

  // ── Pointer events ───────────────────────────────────────────────────────

  function onPointerDown(e) {
    e.preventDefault();
    overlay.setPointerCapture(e.pointerId);
    isSelecting = true;
    startPos = { x: e.clientX, y: e.clientY };
    updateSelectionBox(e.clientX, e.clientY);
    selectionBox.style.display = 'block';
  }

  function onPointerMove(e) {
    if (!isSelecting) return;
    updateSelectionBox(e.clientX, e.clientY);
  }

  function onPointerUp(e) {
    if (!isSelecting) return;
    isSelecting = false;
    const rect = normalizeRect(startPos.x, startPos.y, e.clientX, e.clientY);
    if (rect.width < 5 || rect.height < 5) { notifyCanceled(); return; }
    cleanup();
    chrome.runtime.sendMessage({
      type: 'SELECTION_COMPLETE',
      rect,
      dpr: window.devicePixelRatio || 1,
      pageUrl: location.href,
    });
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') notifyCanceled();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  function normalizeRect(x1, y1, x2, y2) {
    return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) };
  }

  function updateSelectionBox(x, y) {
    const r = normalizeRect(startPos.x, startPos.y, x, y);
    selectionBox.style.left   = r.x + 'px';
    selectionBox.style.top    = r.y + 'px';
    selectionBox.style.width  = r.width  + 'px';
    selectionBox.style.height = r.height + 'px';
  }

  function notifyCanceled() {
    cleanup();
    chrome.runtime.sendMessage({ type: 'SELECTION_CANCELED' });
  }

  function cleanup() {
    if (overlay) {
      overlay.removeEventListener('pointerdown', onPointerDown);
      overlay.removeEventListener('pointermove', onPointerMove);
      overlay.removeEventListener('pointerup',   onPointerUp);
      overlay.remove();
      overlay = null;
      selectionBox = null;
    }
    document.removeEventListener('keydown', onKeyDown);
    isSelecting = false;
    startPos = null;
  }
})();
