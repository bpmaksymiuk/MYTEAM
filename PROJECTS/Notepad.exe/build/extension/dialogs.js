// dialogs.js — DI-009
// In-page modal dialogs: confirm, open-picker, help

const overlay = () => document.getElementById('dialog-overlay');

function openDialog(id) {
  overlay().classList.remove('hidden');
  document.getElementById(id).classList.remove('hidden');
}

function closeDialog(id) {
  document.getElementById(id).classList.add('hidden');
  overlay().classList.add('hidden');
}

let escapeHandler = null;

function registerEscape(handler) {
  if (escapeHandler) document.removeEventListener('keydown', escapeHandler);
  escapeHandler = (e) => { if (e.key === 'Escape') handler(); };
  document.addEventListener('keydown', escapeHandler);
}

function clearEscape() {
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
}

// DI-009: showConfirm — Yes / No / Cancel
// Returns: true (Yes), false (No), null (Cancel / Escape)
export function showConfirm(message) {
  return new Promise(resolve => {
    document.getElementById('dialog-message').textContent = message;
    openDialog('dialog-confirm');

    const btnYes    = document.getElementById('dialog-yes');
    const btnNo     = document.getElementById('dialog-no');
    const btnCancel = document.getElementById('dialog-cancel');
    btnYes.focus();

    function finish(result) {
      closeDialog('dialog-confirm');
      clearEscape();
      btnYes.removeEventListener('click', onYes);
      btnNo.removeEventListener('click', onNo);
      btnCancel.removeEventListener('click', onCancel);
      resolve(result);
    }

    function onYes()    { finish(true); }
    function onNo()     { finish(false); }
    function onCancel() { finish(null); }

    btnYes.addEventListener('click', onYes);
    btnNo.addEventListener('click', onNo);
    btnCancel.addEventListener('click', onCancel);
    registerEscape(() => finish(null));
  });
}

// DI-009: showOpenPicker — lists saved notes by name, returns chosen name or null
export function showOpenPicker(notes) {
  return new Promise(resolve => {
    const list      = document.getElementById('open-file-list');
    const btnCancel = document.getElementById('dialog-open-cancel');

    list.innerHTML = '';
    if (notes.length === 0) {
      const empty = document.createElement('li');
      empty.textContent = '(No saved notes)';
      empty.className = 'empty-note';
      list.appendChild(empty);
    } else {
      notes.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.tabIndex = 0;
        li.addEventListener('click', () => finish(name));
        li.addEventListener('keydown', e => { if (e.key === 'Enter') finish(name); });
        list.appendChild(li);
      });
    }

    openDialog('dialog-open');
    if (list.firstElementChild) list.firstElementChild.focus();

    function finish(name) {
      closeDialog('dialog-open');
      clearEscape();
      btnCancel.removeEventListener('click', onCancel);
      resolve(name);
    }

    function onCancel() { finish(null); }
    btnCancel.addEventListener('click', onCancel);
    registerEscape(() => finish(null));
  });
}

// DI-009: showAbout — About Notepad dialog
export function showAbout() {
  const content = document.getElementById('help-content');
  content.innerHTML = `
    <div class="about-content">
      <p><strong>Notepad.exe</strong></p>
      <p>Version 1.0.0</p>
      <p>A Windows Notepad-style Chrome Extension.</p>
      <p>Stores notes in browser local storage.</p>
    </div>`;
  document.querySelector('#dialog-help .dialog-title').textContent = 'About Notepad';
  openDialog('dialog-help');

  const btnClose = document.getElementById('dialog-help-close');
  btnClose.focus();

  function close() {
    document.querySelector('#dialog-help .dialog-title').textContent = 'Keyboard Shortcuts';
    closeDialog('dialog-help');
    clearEscape();
    btnClose.removeEventListener('click', close);
  }

  btnClose.addEventListener('click', close);
  registerEscape(close);
}

// DI-009: showHelp — keyboard shortcuts table
export function showHelp() {
  const content = document.getElementById('help-content');
  content.innerHTML = `
    <table class="shortcuts-table">
      <tr><th>Shortcut</th><th>Action</th></tr>
      <tr><td>Ctrl+N</td><td>New</td></tr>
      <tr><td>Ctrl+O</td><td>Open</td></tr>
      <tr><td>Ctrl+S</td><td>Save</td></tr>
      <tr><td>Ctrl+Shift+S</td><td>Save As</td></tr>
      <tr><td>Ctrl+Z</td><td>Undo</td></tr>
      <tr><td>Tab</td><td>Insert tab character</td></tr>
      <tr><td>Escape</td><td>Close dialog</td></tr>
    </table>`;

  openDialog('dialog-help');

  const btnClose = document.getElementById('dialog-help-close');
  btnClose.focus();

  function close() {
    closeDialog('dialog-help');
    clearEscape();
    btnClose.removeEventListener('click', close);
  }

  btnClose.addEventListener('click', close);
  registerEscape(close);
}
