# Bug Report

**Project:** Notepad Chrome Extension  
**Stage:** 6 — Testing  
**Latest Date:** 2026-04-06  
**Pipeline:** T-PIPELINE-NOTEPAD-001 (Run 1 + Run 2)  
**Latest Version Tested:** NP-REL-2026-04-06-002

---

## BUG-NP-001 — Status "Note loaded." fires before async storage read completes

| Field | Value |
|-------|-------|
| **ID** | BUG-NP-001 |
| **Severity** | Low |
| **UC** | UC-004 |
| **BR** | BR-008 (feedback accuracy) |
| **File** | `build/extension/notepad.js` |
| **Status** | ✅ FIXED |

**Description:**  
`loadNoteFromStorage()` called `showStatus('Note loaded.')` synchronously immediately after invoking `loadNote()`. Because `loadNote()` uses an async `chrome.storage.local.get()` callback, the success message appeared before the storage read had completed. If `chrome.runtime.lastError` occurred, the user would briefly see "Note loaded." before the actual "Load failed." message overrode it.

**Root Cause:**  
`loadNote()` did not accept a success callback, so `loadNoteFromStorage()` had no mechanism to delay the status display until the async operation finished.

**Fix Applied:**  
`loadNote()` signature changed to `loadNote(onSuccess)`. The callback is invoked inside the success path of `chrome.storage.local.get`. `loadNoteFromStorage()` now calls `loadNote(() => showStatus('Note loaded.'))`.

**Before:**
```js
function loadNote() {
  chrome.storage.local.get('noteContent', data => {
    // ...
    setDirty(false);
  });
}

function loadNoteFromStorage() {
  if (isDirty && !window.confirm(...)) return;
  loadNote();
  showStatus('Note loaded.');  // ← fires before async callback
}
```

**After:**
```js
function loadNote(onSuccess) {
  chrome.storage.local.get('noteContent', data => {
    // ...
    setDirty(false);
    if (onSuccess) onSuccess();  // ← fires only after successful read
  });
}

function loadNoteFromStorage() {
  if (isDirty && !window.confirm(...)) return;
  loadNote(() => showStatus('Note loaded.'));
}
```

---

## BUG-NP-002 — Keyboard shortcuts fire when Alt or Meta modifier keys are held

| Field | Value |
|-------|-------|
| **ID** | BUG-NP-002 |
| **Severity** | Low |
| **UC** | UC-002, UC-005, UC-009 |
| **BR** | BR-004, BR-011 |
| **File** | `build/extension/notepad.js` |
| **Status** | ✅ FIXED |

**Description:**  
`matchesShortcut()` checked `ctrlKey` and `shiftKey` but not `altKey` or `metaKey`. As a result, OS-level or app-level shortcuts involving Alt or Meta modifiers (e.g., Alt+Ctrl+N, Meta+Ctrl+S) could accidentally trigger Notepad actions.

**Root Cause:**  
Missing guard clauses for `e.altKey` and `e.metaKey` in the `matchesShortcut()` function.

**Fix Applied:**  
Added `if (e.altKey || e.metaKey) return false;` immediately after the existing modifier checks.

**Before:**
```js
function matchesShortcut(e, shortcut) {
  // ...
  if (needsCtrl  !== e.ctrlKey)  return false;
  if (needsShift !== e.shiftKey) return false;
  return e.key.toLowerCase() === key || ...;
}
```

**After:**
```js
function matchesShortcut(e, shortcut) {
  // ...
  if (needsCtrl  !== e.ctrlKey)  return false;
  if (needsShift !== e.shiftKey) return false;
  if (e.altKey || e.metaKey)     return false;  // ← new guard
  return e.key.toLowerCase() === key || ...;
}
```

---

## Known Platform Limitations (Not Bugs)

| Ref | Description |
|-----|-------------|
| UC-007 / BR-013 | OS window close button (×) cannot be intercepted in Chrome MV3 service workers. `beforeunload` not reliably dispatched in extension-managed windows. Out of scope. |
| UC-008 / BR-019 | MV3 service workers are non-persistent; `notepadWindowId` state is lost on termination, potentially allowing a second window to open. Inherent MV3 platform constraint. |

---

## BUG-NP-003 — Missing favicon causes HTTP 404 console error

| Field | Value |
|-------|-------|
| **ID** | BUG-NP-003 |
| **Severity** | Low |
| **Run** | 2 (Run 2 — live browser) |
| **UC** | UC-001 |
| **BR** | BR-002 (visual fidelity / clean console) |
| **File** | `build/extension/notepad.html` |
| **Status** | ✅ FIXED |

**Description:**  
When `notepad.html` was served (both via HTTP for testing and as a Chrome Extension page), the browser automatically requested `/favicon.ico`. The extension directory does not include a favicon file, causing a 404 response visible in the browser console. Discovered during Run 2 live browser pipeline execution.

**Root Cause:**  
Browsers issue an automatic GET `/favicon.ico` for any page that has no explicit `<link rel="icon">` declaration in `<head>`.

**Fix Applied:**  
Added `<link rel="icon" href="data:,">` to `<head>` in `notepad.html`. The `data:,` URI resolves to an empty document, suppressing the network request entirely with no visible icon (appropriate for a Windows 95-style notepad context).

**Before:**
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Untitled - Notepad</title>
  <link rel="stylesheet" href="notepad.css">
</head>
```

**After:**
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Untitled - Notepad</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="notepad.css">
</head>
```

