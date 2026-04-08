// statusbar.js — DI-006
// Real-time status bar: line, column, char count, encoding

let textarea = null;
let lineEl = null;
let colEl = null;
let charsEl = null;
let encodingEl = null;

export function initStatusbar(textareaEl, statusbarEl) {
  textarea = textareaEl;
  lineEl     = statusbarEl.querySelector('#status-line');
  colEl      = statusbarEl.querySelector('#status-col');
  charsEl    = statusbarEl.querySelector('#status-chars');
  encodingEl = statusbarEl.querySelector('#status-encoding');

  encodingEl.textContent = 'UTF-8';

  ['input', 'keyup', 'click', 'select'].forEach(evt => {
    textarea.addEventListener(evt, update);
  });

  update();
}

export function update() {
  if (!textarea) return;
  const text = textarea.value;
  const pos = textarea.selectionStart ?? 0;

  const beforeCursor = text.slice(0, pos);
  const lineNum = (beforeCursor.match(/\n/g) || []).length + 1;
  const lastNewline = beforeCursor.lastIndexOf('\n');
  const colNum = lastNewline === -1 ? pos + 1 : pos - lastNewline;

  if (lineEl)     lineEl.textContent     = `Ln ${lineNum}`;
  if (colEl)      colEl.textContent      = `Col ${colNum}`;
  if (charsEl)    charsEl.textContent    = `${text.length} chars`;
  if (encodingEl) encodingEl.textContent = 'UTF-8';
}
