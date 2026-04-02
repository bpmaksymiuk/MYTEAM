const editor = document.getElementById("editor");
const titleEl = document.getElementById("window-title");
const statusEl = document.getElementById("status-text");
const saveEl = document.getElementById("save-text");
const openInput = document.getElementById("file-open");
const findDialog = document.getElementById("find-dialog");
const confirmDialog = document.getElementById("confirm-dialog");

const state = {
  title: "Untitled",
  content: "",
  dirty: false,
  wrap: false,
  savedName: null,
  cursorStart: 0,
  cursorEnd: 0,
  lastFindIndex: -1
};

let saveTimer = null;

function renderTitle() {
  titleEl.textContent = `${state.title} - Notepad`;
}

function renderSaveState() {
  saveEl.textContent = state.dirty ? "Unsaved" : "Saved";
}

function updateCursorStatus() {
  const pos = editor.selectionStart;
  const lines = editor.value.slice(0, pos).split("\n");
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;
  statusEl.textContent = `Ln ${line}, Col ${col}`;
}

function markDirty(dirty) {
  state.dirty = dirty;
  renderSaveState();
}

function setContent(text, { markChanged = false } = {}) {
  editor.value = text;
  state.content = text;
  if (markChanged) {
    markDirty(true);
  }
  updateCursorStatus();
}

function applyWrap() {
  editor.classList.toggle("word-wrap", state.wrap);
}

async function persistState() {
  try {
    const payload = {
      title: state.title,
      content: editor.value,
      dirty: state.dirty,
      wrap: state.wrap,
      cursorStart: editor.selectionStart,
      cursorEnd: editor.selectionEnd,
      savedName: state.savedName
    };
    await chrome.storage.local.set({ notepadState: payload });
  } catch (error) {
    console.error("Failed to persist state", error);
  }
}

function schedulePersist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistState();
  }, 300);
}

async function restoreState() {
  try {
    const { notepadState } = await chrome.storage.local.get("notepadState");
    if (!notepadState) {
      renderTitle();
      renderSaveState();
      editor.focus();
      updateCursorStatus();
      return;
    }

    state.title = notepadState.title || "Untitled";
    state.wrap = Boolean(notepadState.wrap);
    state.savedName = notepadState.savedName || null;
    renderTitle();
    applyWrap();

    setContent(notepadState.content || "", { markChanged: false });
    markDirty(Boolean(notepadState.dirty));

    const start = Number.isInteger(notepadState.cursorStart) ? notepadState.cursorStart : 0;
    const end = Number.isInteger(notepadState.cursorEnd) ? notepadState.cursorEnd : start;
    editor.setSelectionRange(start, end);
    editor.focus();
    updateCursorStatus();
  } catch (error) {
    console.error("Failed to restore state", error);
  }
}

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function promptUnsavedIfNeeded() {
  if (!state.dirty) {
    return Promise.resolve("discard");
  }

  confirmDialog.showModal();
  return new Promise((resolve) => {
    const onSave = () => {
      cleanup();
      resolve("save");
    };
    const onDiscard = () => {
      cleanup();
      resolve("discard");
    };
    const onCancel = () => {
      cleanup();
      resolve("cancel");
    };

    function cleanup() {
      document.getElementById("confirm-save").removeEventListener("click", onSave);
      document.getElementById("confirm-discard").removeEventListener("click", onDiscard);
      document.getElementById("confirm-cancel").removeEventListener("click", onCancel);
      confirmDialog.close();
    }

    document.getElementById("confirm-save").addEventListener("click", onSave);
    document.getElementById("confirm-discard").addEventListener("click", onDiscard);
    document.getElementById("confirm-cancel").addEventListener("click", onCancel);
  });
}

async function handleNew() {
  const decision = await promptUnsavedIfNeeded();
  if (decision === "cancel") {
    return;
  }
  if (decision === "save") {
    await handleSaveAs();
  }

  state.title = "Untitled";
  state.savedName = null;
  renderTitle();
  setContent("");
  markDirty(false);
  schedulePersist();
  editor.focus();
}

function downloadTextFile(fileName) {
  const safeName = fileName.toLowerCase().endsWith(".txt") ? fileName : `${fileName}.txt`;
  const blob = new Blob([editor.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  state.savedName = safeName;
  state.title = safeName;
  markDirty(false);
  renderTitle();
  schedulePersist();
}

async function handleSave() {
  const name = state.savedName || state.title;
  if (!name || name === "Untitled") {
    return handleSaveAs();
  }
  downloadTextFile(name);
}

async function handleSaveAs() {
  const suggested = state.savedName || `${state.title === "Untitled" ? "Untitled" : state.title}`;
  const input = window.prompt("Save as filename", suggested);
  if (!input) {
    return;
  }
  downloadTextFile(input);
}

function handleOpen() {
  openInput.value = "";
  openInput.click();
}

async function maybeOpenFile() {
  const decision = await promptUnsavedIfNeeded();
  if (decision === "cancel") {
    return false;
  }
  if (decision === "save") {
    await handleSaveAs();
  }
  return true;
}

async function openFileFromInput(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const canOpen = await maybeOpenFile();
  if (!canOpen) {
    return;
  }

  const text = await file.text();
  state.title = file.name;
  state.savedName = file.name;
  renderTitle();
  setContent(text);
  markDirty(false);
  schedulePersist();
}

function openFindDialog() {
  document.getElementById("find-status").textContent = "";
  findDialog.showModal();
  document.getElementById("find-input").focus();
}

function getFindConfig() {
  return {
    query: document.getElementById("find-input").value,
    replaceValue: document.getElementById("replace-input").value,
    matchCase: document.getElementById("match-case").checked,
    wrapAround: document.getElementById("wrap-around").checked
  };
}

function setFindStatus(message) {
  document.getElementById("find-status").textContent = message;
}

function findNextMatch() {
  const { query, matchCase, wrapAround } = getFindConfig();
  if (!query) {
    setFindStatus("Type a search term.");
    return null;
  }

  const haystack = matchCase ? editor.value : editor.value.toLowerCase();
  const needle = matchCase ? query : query.toLowerCase();
  const startFrom = Math.max(editor.selectionEnd, state.lastFindIndex + 1, 0);
  let index = haystack.indexOf(needle, startFrom);

  if (index === -1 && wrapAround) {
    index = haystack.indexOf(needle, 0);
  }

  if (index === -1) {
    setFindStatus("No match found.");
    return null;
  }

  editor.focus();
  editor.setSelectionRange(index, index + query.length);
  state.lastFindIndex = index;
  updateCursorStatus();
  setFindStatus(`Match at position ${index + 1}.`);
  return index;
}

function replaceSelection() {
  const index = findNextMatch();
  if (index === null) {
    return;
  }

  const { query, replaceValue } = getFindConfig();
  const value = editor.value;
  editor.value = value.slice(0, index) + replaceValue + value.slice(index + query.length);
  editor.setSelectionRange(index, index + replaceValue.length);
  markDirty(true);
  schedulePersist();
  setFindStatus("One match replaced.");
}

function replaceAll() {
  const { query, replaceValue, matchCase } = getFindConfig();
  if (!query) {
    setFindStatus("Type a search term.");
    return;
  }

  const pattern = new RegExp(escapeRegExp(query), matchCase ? "g" : "gi");
  const matches = editor.value.match(pattern);
  if (!matches || matches.length === 0) {
    setFindStatus("No matches to replace.");
    return;
  }

  editor.value = editor.value.replace(pattern, replaceValue);
  markDirty(true);
  schedulePersist();
  setFindStatus(`Replaced ${matches.length} occurrence(s).`);
  updateCursorStatus();
}

function insertTimeDate() {
  const timestamp = new Date().toLocaleString();
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  editor.value = editor.value.slice(0, start) + timestamp + editor.value.slice(end);
  editor.setSelectionRange(start + timestamp.length, start + timestamp.length);
  markDirty(true);
  schedulePersist();
}

function toggleWordWrap() {
  state.wrap = !state.wrap;
  applyWrap();
  markDirty(true);
  schedulePersist();
}

function handleMenu(menu) {
  switch (menu) {
    case "file":
      handleSave();
      break;
    case "edit":
      openFindDialog();
      break;
    case "format":
      toggleWordWrap();
      break;
    case "view":
      break;
    case "help":
      window.alert("Classic Notepad extension\nPlain text editor popup.");
      break;
    default:
      break;
  }
}

function handleKeyboard(event) {
  if (event.ctrlKey && event.key.toLowerCase() === "n") {
    event.preventDefault();
    handleNew();
    return;
  }
  if (event.ctrlKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    handleSave();
    return;
  }
  if (event.ctrlKey && event.key.toLowerCase() === "o") {
    event.preventDefault();
    handleOpen();
    return;
  }
  if (event.ctrlKey && event.key.toLowerCase() === "f") {
    event.preventDefault();
    openFindDialog();
    return;
  }
  if (event.ctrlKey && event.key.toLowerCase() === "h") {
    event.preventDefault();
    openFindDialog();
    return;
  }
  if (event.ctrlKey && event.key.toLowerCase() === "a") {
    event.preventDefault();
    editor.select();
    updateCursorStatus();
    return;
  }
  if (event.ctrlKey && event.key.toLowerCase() === "y") {
    event.preventDefault();
    document.execCommand("redo");
    return;
  }
  if (event.key === "F5") {
    event.preventDefault();
    insertTimeDate();
  }
}

function wireActions() {
  document.querySelectorAll(".menubar button").forEach((btn) => {
    btn.addEventListener("click", () => handleMenu(btn.dataset.menu));
  });

  editor.addEventListener("input", () => {
    markDirty(true);
    schedulePersist();
    updateCursorStatus();
  });

  editor.addEventListener("click", updateCursorStatus);
  editor.addEventListener("keyup", updateCursorStatus);
  window.addEventListener("keydown", handleKeyboard);

  document.getElementById("exit-btn").addEventListener("click", async () => {
    const decision = await promptUnsavedIfNeeded();
    if (decision === "save") {
      await handleSave();
      window.close();
      return;
    }
    if (decision === "discard") {
      window.close();
    }
  });

  openInput.addEventListener("change", openFileFromInput);

  document.getElementById("find-next").addEventListener("click", findNextMatch);
  document.getElementById("replace-one").addEventListener("click", replaceSelection);
  document.getElementById("replace-all").addEventListener("click", replaceAll);

  window.addEventListener("beforeunload", () => {
    persistState();
  });

  document.addEventListener("selectionchange", () => {
    if (document.activeElement === editor) {
      updateCursorStatus();
    }
  });
}

async function init() {
  wireActions();
  await restoreState();
}

init();
