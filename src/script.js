// UC-01 — Browser Buddy web app logic
// Design IDs: UC-01.BR-01..06.ARCH-01.DES-01

// ── State ──────────────────────────────────────────────────────────────────

let captureMode = 'idle'; // 'idle' | 'selecting'
let captures = [];        // CaptureItem[]
let selectedCaptureId = null;
let selectionStart = null;

// ── DOM refs ───────────────────────────────────────────────────────────────

const docCanvas   = document.getElementById('doc-canvas');
const docArea     = document.getElementById('document-area');
const overlay     = document.getElementById('capture-overlay');
const selectionBox = document.getElementById('selection-box');
const captureBtn  = document.getElementById('capture-btn');
const cancelBtn   = document.getElementById('cancel-btn');
const copyBtn     = document.getElementById('copy-btn');
const statusText  = document.getElementById('status-text');
const captureList = document.getElementById('capture-list');

// ── Mock document content ──────────────────────────────────────────────────

(function drawDocument() {
  const ctx = docCanvas.getContext('2d');
  const W = docCanvas.width;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, docCanvas.height);

  // Title
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('Project Report — Q1 2026', 40, 58);

  // Divider
  ctx.strokeStyle = '#e0e4ea';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, 74); ctx.lineTo(W - 40, 74); ctx.stroke();

  // Body text
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillStyle = '#333';
  const lines = [
    'This document summarises quarterly performance metrics and highlights',
    'key achievements across all product areas for the period ended March 2026.',
    '',
    'Revenue grew by 18 % year-over-year, driven by strong enterprise adoption.',
    'Engineering velocity increased 24 % following the rollout of the new CI/CD',
    'pipeline and automated testing framework introduced in January.',
    '',
    'Customer satisfaction (NPS) improved from 67 to 72, reflecting continued',
    'investment in support tooling and onboarding quality.',
  ];
  lines.forEach((line, i) => ctx.fillText(line, 40, 106 + i * 22));

  // Key metrics box
  ctx.strokeStyle = '#4a90d9';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 318, 210, 110);
  ctx.fillStyle = '#f0f7ff';
  ctx.fillRect(41, 319, 209, 109);
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('Key Metrics', 56, 342);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillStyle = '#333';
  [['Revenue', '$4.2M  (+18 %)'], ['Active Users', '12,400  (+31 %)'], ['NPS Score', '72  (+5 pts)']].forEach(([k, v], i) => {
    ctx.fillStyle = '#666'; ctx.fillText(k, 56, 366 + i * 22);
    ctx.fillStyle = '#1a1a2e'; ctx.fillText(v, 150, 366 + i * 22);
  });

  // Bar chart
  ctx.strokeStyle = '#e0e4ea';
  ctx.lineWidth = 1;
  ctx.strokeRect(278, 318, 280, 110);
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(279, 319, 279, 109);
  const bars = [52, 68, 44, 88, 72, 84];
  bars.forEach((h, i) => {
    ctx.fillStyle = i === bars.length - 1 ? '#4a90d9' : '#a8c8ec';
    ctx.fillRect(296 + i * 42, 418 - h, 28, h);
  });
  ctx.fillStyle = '#999';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText('Monthly Revenue (Oct – Mar)', 290, 444);

  // Footer rule
  ctx.strokeStyle = '#e0e4ea';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, 470); ctx.lineTo(W - 40, 470); ctx.stroke();
  ctx.fillStyle = '#bbb';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText('Confidential — Internal Use Only', 40, 488);
})();

// ── Capture mode ───────────────────────────────────────────────────────────

function beginCapture() {
  if (captureMode !== 'idle') return;
  captureMode = 'selecting';

  // Position overlay exactly over the canvas so offsetX/Y are canvas-relative
  const cb = docCanvas.getBoundingClientRect();
  const ab = docArea.getBoundingClientRect();
  overlay.style.left   = (cb.left - ab.left) + 'px';
  overlay.style.top    = (cb.top  - ab.top)  + 'px';
  overlay.style.width  = cb.width  + 'px';
  overlay.style.height = cb.height + 'px';
  overlay.style.display = 'block';

  selectionBox.style.display = 'none';
  captureBtn.disabled = true;
  cancelBtn.disabled  = false;
  showStatus('Drag to select a region…');
}

function cancelCapture() {
  captureMode = 'idle';
  overlay.style.display = 'none';
  selectionBox.style.display = 'none';
  captureBtn.disabled = false;
  cancelBtn.disabled  = true;
  selectionStart = null;
  showStatus('');
}

// ── Pointer events ─────────────────────────────────────────────────────────

overlay.addEventListener('pointerdown', e => {
  if (captureMode !== 'selecting') return;
  overlay.setPointerCapture(e.pointerId);
  selectionStart = { x: e.offsetX, y: e.offsetY };
  updateSelectionBox(e.offsetX, e.offsetY);
});

overlay.addEventListener('pointermove', e => {
  if (captureMode !== 'selecting' || !selectionStart) return;
  updateSelectionBox(e.offsetX, e.offsetY);
});

overlay.addEventListener('pointerup', e => {
  if (captureMode !== 'selecting' || !selectionStart) return;
  const rect = normalizeRect(selectionStart.x, selectionStart.y, e.offsetX, e.offsetY);
  selectionStart = null;
  if (rect.width < 5 || rect.height < 5) { cancelCapture(); return; }
  createCaptureFromRect(rect);
  cancelCapture();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && captureMode === 'selecting') cancelCapture();
});

function normalizeRect(x1, y1, x2, y2) {
  return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) };
}

function updateSelectionBox(curX, curY) {
  if (!selectionStart) return;
  const r = normalizeRect(selectionStart.x, selectionStart.y, curX, curY);
  selectionBox.style.left   = r.x + 'px';
  selectionBox.style.top    = r.y + 'px';
  selectionBox.style.width  = r.width  + 'px';
  selectionBox.style.height = r.height + 'px';
  selectionBox.style.display = 'block';
}

// ── Capture creation ───────────────────────────────────────────────────────

function createCaptureFromRect(cssRect) {
  // Scale CSS display coords to canvas resolution coords
  const displayW = parseFloat(overlay.style.width);
  const displayH = parseFloat(overlay.style.height);
  const scaleX = docCanvas.width  / displayW;
  const scaleY = docCanvas.height / displayH;

  const sx = Math.round(cssRect.x      * scaleX);
  const sy = Math.round(cssRect.y      * scaleY);
  const sw = Math.round(cssRect.width  * scaleX);
  const sh = Math.round(cssRect.height * scaleY);

  // Clamp to canvas bounds
  const clampedSx = Math.max(0, Math.min(sx, docCanvas.width));
  const clampedSy = Math.max(0, Math.min(sy, docCanvas.height));
  const clampedSw = Math.min(sw, docCanvas.width  - clampedSx);
  const clampedSh = Math.min(sh, docCanvas.height - clampedSy);

  if (clampedSw < 1 || clampedSh < 1) return;

  const tmp = document.createElement('canvas');
  tmp.width  = clampedSw;
  tmp.height = clampedSh;
  tmp.getContext('2d').drawImage(docCanvas, clampedSx, clampedSy, clampedSw, clampedSh, 0, 0, clampedSw, clampedSh);

  const item = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    imageDataUrl: tmp.toDataURL('image/png'),
  };
  captures.unshift(item); // newest first
  renderCaptureList();
}

// ── Capture list ───────────────────────────────────────────────────────────

function renderCaptureList() {
  captureList.innerHTML = '';
  if (captures.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = 'No captures yet';
    captureList.appendChild(li);
    copyBtn.disabled = true;
    return;
  }
  captures.forEach(item => {
    const li  = document.createElement('li');
    li.className = 'capture-item' + (item.id === selectedCaptureId ? ' selected' : '');

    const img = document.createElement('img');
    img.src       = item.imageDataUrl;
    img.className = 'capture-thumb';
    img.alt       = 'Capture thumbnail';

    const meta = document.createElement('div');
    meta.className   = 'capture-meta';
    meta.textContent = new Date(item.createdAt).toLocaleTimeString();

    li.appendChild(img);
    li.appendChild(meta);
    li.addEventListener('click', () => { selectedCaptureId = item.id; renderCaptureList(); });
    captureList.appendChild(li);
  });
  copyBtn.disabled = !selectedCaptureId;
}

// ── Clipboard copy ─────────────────────────────────────────────────────────

async function copySelectedCapture() {
  const item = captures.find(c => c.id === selectedCaptureId);
  if (!item) return;
  try {
    const blob = await fetch(item.imageDataUrl).then(r => r.blob());
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    showStatus('Copied to clipboard!');
  } catch {
    try {
      await navigator.clipboard.writeText(item.imageDataUrl);
      showStatus('Copied as data URL (image copy not supported in this browser)');
    } catch {
      showStatus('Copy failed: clipboard access denied');
    }
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function showStatus(msg) {
  statusText.textContent = msg;
  if (msg) setTimeout(() => { if (statusText.textContent === msg) statusText.textContent = ''; }, 3000);
}

// ── Event bindings ─────────────────────────────────────────────────────────

captureBtn.addEventListener('click', beginCapture);
cancelBtn.addEventListener('click', cancelCapture);
copyBtn.addEventListener('click', copySelectedCapture);

// ── Init ────────────────────────────────────────────────────────────────────

renderCaptureList();
