// editor.js — DI-005
// Textarea editor component: Tab handling, dirty-flag, word-wrap

let textareaEl = null;
let isDirty = false;
let dirtyCallback = null;

export function initEditor(el, onDirtyChange) {
  textareaEl = el;
  dirtyCallback = onDirtyChange;

  textareaEl.addEventListener('input', () => {
    if (!isDirty) {
      isDirty = true;
      if (dirtyCallback) dirtyCallback(true);
    }
  });

  textareaEl.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaEl.selectionStart;
      const end = textareaEl.selectionEnd;
      textareaEl.value = textareaEl.value.slice(0, start) + '\t' + textareaEl.value.slice(end);
      textareaEl.selectionStart = textareaEl.selectionEnd = start + 1;
      // Dispatch input event so statusbar and dirty-flag listeners fire
      textareaEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

export function getValue() {
  return textareaEl ? textareaEl.value : '';
}

export function setValue(text) {
  if (textareaEl) textareaEl.value = text;
  // Does NOT set dirty — only user input should
}

export function clear() {
  if (textareaEl) {
    textareaEl.value = '';
    // Dispatch input so statusbar and other listeners refresh to empty state
    textareaEl.dispatchEvent(new Event('input', { bubbles: true }));
  }
  // setDirty(false) called by caller after clear()
}

export function focus() {
  if (textareaEl) textareaEl.focus();
}

export function setDirty(val) {
  isDirty = val;
  if (dirtyCallback) dirtyCallback(val);
}

export function getDirty() {
  return isDirty;
}

export function setWordWrap(enabled) {
  if (!textareaEl) return;
  textareaEl.wrap = enabled ? 'soft' : 'off';
  textareaEl.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
  textareaEl.style.overflowX = enabled ? 'hidden' : 'auto';
}
