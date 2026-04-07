// app.js — Excel Chrome Extension — Complete Implementation
// DI-005 through DI-015 | BR-001 through BR-058

// ============================================================
// 1. CONSTANTS
// ============================================================

const GRID_ROWS = 50;
const GRID_COLS = 26;

// DI-013: Keyboard shortcuts (BR-057, BR-058)
const SHORTCUTS = [
  { key: 'Ctrl+S',     action: 'Save as CSV' },
  { key: 'Ctrl+O',     action: 'Open CSV file' },
  { key: 'Ctrl+Z',     action: 'Undo' },
  { key: 'Ctrl+Home',  action: 'Go to cell A1' },
  { key: 'F1',         action: 'Open Help' },
  { key: 'F2',         action: 'Edit selected cell' },
  { key: 'Escape',     action: 'Cancel edit / close menu' },
  { key: 'Enter',      action: 'Confirm and move down' },
  { key: 'Tab',        action: 'Confirm and move right' },
  { key: 'Arrow keys', action: 'Navigate cells' },
];

// DI-003: Ribbon configuration (BR-004, BR-014–BR-024)
const RIBBON_CONFIG = [
  {
    label: 'Clipboard',
    items: [
      { type: 'btn', icon: '✂', action: 'cut',   title: 'Cut (Ctrl+X)' },
      { type: 'btn', icon: '⎘', action: 'copy',  title: 'Copy (Ctrl+C)' },
      { type: 'btn', icon: '📋', action: 'paste', title: 'Paste (Ctrl+V)' },
    ]
  },
  {
    label: 'Font',
    items: [
      { type: 'select', cls: 'font-name', id: 'font-name-select', options: [
          'Calibri','Arial','Times New Roman','Courier New','Verdana',
          'Georgia','Trebuchet MS','Comic Sans MS'
        ], action: 'fontName' },
      { type: 'select', cls: 'font-size', id: 'font-size-select', options: [
          '8','9','10','11','12','14','16','18','20','22','24','28','36','48','72'
        ], action: 'fontSize' },
      { type: 'btn', icon: 'B', action: 'bold',      title: 'Bold (Ctrl+B)',      id: 'btn-bold' },
      { type: 'btn', icon: 'I', action: 'italic',    title: 'Italic (Ctrl+I)',    id: 'btn-italic' },
      { type: 'btn', icon: 'U', action: 'underline', title: 'Underline (Ctrl+U)', id: 'btn-underline' },
    ]
  },
  {
    label: 'Alignment',
    items: [
      { type: 'btn', icon: '≡', action: 'align-left',   title: 'Align Left',   id: 'btn-align-left' },
      { type: 'btn', icon: '☰', action: 'align-center', title: 'Align Center', id: 'btn-align-center' },
      { type: 'btn', icon: '≡', action: 'align-right',  title: 'Align Right',  id: 'btn-align-right', style: 'text-align:right' },
      { type: 'btn', icon: '⇉', action: 'wrap-text',    title: 'Wrap Text',    id: 'btn-wrap-text' },
    ]
  },
  {
    label: 'Number',
    items: [
      { type: 'btn', icon: '$',  action: 'fmt-currency', title: 'Currency format' },
      { type: 'btn', icon: '%',  action: 'fmt-percent',  title: 'Percent format' },
      { type: 'btn', icon: ',',  action: 'fmt-comma',    title: 'Comma format' },
      { type: 'btn', icon: '.0', action: 'fmt-decimal',  title: 'Increase decimal' },
    ]
  },
  {
    label: 'Editing',
    items: [
      { type: 'btn', icon: 'Σ', action: 'autosum', title: 'AutoSum' },
      { type: 'btn', icon: '↓', action: 'fill-down', title: 'Fill Down' },
      { type: 'btn', icon: '🔍', action: 'find', title: 'Find & Replace' },
    ]
  }
];

// DI-011: Context menu items (BR-040–BR-047)
const CONTEXT_MENU_ITEMS = [
  { label: 'Cut',             action: 'cut' },
  { label: 'Copy',            action: 'copy' },
  { label: 'Paste',           action: 'paste' },
  { type: 'separator' },
  { label: 'Insert Row',      action: 'insert-row' },
  { label: 'Delete Row',      action: 'delete-row' },
  { type: 'separator' },
  { label: 'Clear Contents',  action: 'clear-contents' },
];

// ============================================================
// 2. STATE
// ============================================================

// sheets[i] = { name: string, data: { "row,col": cellObj } }
// cellObj = { raw: string, format: { bold, italic, underline, align, fontName, fontSize } }
let sheets = [{ name: 'Sheet1', data: {} }];
let currentSheetIndex = 0;
let selectedRow = 0;
let selectedCol = 0;
let editMode = false;
let clipboardCell = null; // { row, col, cut: bool }
let undoStack = [];
let isDirty = false;

// ============================================================
// 3. UTILITY FUNCTIONS
// ============================================================

/** Convert 0-based column index to Excel letter(s). A=0, Z=25, AA=26 */
function colIndexToLetter(i) {
  let s = '';
  i++;
  while (i > 0) {
    i--;
    s = String.fromCharCode(65 + (i % 26)) + s;
    i = Math.floor(i / 26);
  }
  return s;
}

/** Convert column letter(s) to 0-based index. */
function letterToColIndex(letters) {
  letters = letters.toUpperCase();
  let idx = 0;
  for (let c of letters) {
    idx = idx * 26 + (c.charCodeAt(0) - 64);
  }
  return idx - 1;
}

/** Return "A1"-style address from 0-based row/col. */
function cellAddress(r, c) {
  return colIndexToLetter(c) + (r + 1);
}

/** Parse "A1" → {row:0, col:0}. Returns null if invalid. */
function parseAddress(addr) {
  const m = addr.trim().match(/^([A-Za-z]+)(\d+)$/);
  if (!m) return null;
  const col = letterToColIndex(m[1]);
  const row = parseInt(m[2], 10) - 1;
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return null;
  return { row, col };
}

// ============================================================
// 4. CELL MODEL
// ============================================================

function defaultFormat() {
  return { bold: false, italic: false, underline: false, align: 'left', fontName: 'Calibri', fontSize: '11' };
}

function getCell(r, c) {
  const key = `${r},${c}`;
  let cell = sheets[currentSheetIndex].data[key];
  if (!cell) {
    cell = { raw: '', format: defaultFormat() };
    sheets[currentSheetIndex].data[key] = cell;
  }
  return cell;
}

function setCell(r, c, raw) {
  const key = `${r},${c}`;
  const existing = sheets[currentSheetIndex].data[key];
  const fmt = existing ? { ...existing.format } : defaultFormat();
  sheets[currentSheetIndex].data[key] = { raw: String(raw), format: fmt };
  isDirty = true;
}

function setCellFormat(r, c, fmtPatch) {
  const cell = getCell(r, c);
  sheets[currentSheetIndex].data[`${r},${c}`] = {
    raw: cell.raw,
    format: { ...cell.format, ...fmtPatch }
  };
}

/** Get the display value for a cell (evaluates formulas). */
function getCellDisplay(r, c) {
  const cell = getCell(r, c);
  if (!cell.raw) return '';
  if (cell.raw.startsWith('=')) {
    return FormulaEngine.evaluate(cell.raw, r, c);
  }
  return cell.raw;
}

// ============================================================
// 5. FORMULA ENGINE (DI-007, BR-027–BR-038)
// ============================================================

const FormulaEngine = {
  /** Main entry: evaluate raw formula string. Returns display string or error. */
  evaluate(raw, contextRow, contextCol) {
    if (!raw || !raw.startsWith('=')) return raw;
    try {
      let expr = raw.slice(1).trim();
      expr = this.expandFunctions(expr);
      expr = this.replaceRefs(expr);
      return this.safeCalc(expr);
    } catch (e) {
      return '#ERR';
    }
  },

  /** Recursively expand Excel functions: SUM, AVERAGE, COUNT, MAX, MIN, IF */
  expandFunctions(expr) {
    // Process from innermost — iterate until stable
    let prev;
    let iterations = 0;
    do {
      prev = expr;
      expr = expr.replace(/\b(SUM|AVERAGE|AVG|COUNT|MAX|MIN|IF)\s*\(([^()]*)\)/gi, (match, fn, args) => {
        return this.evalFunction(fn.toUpperCase(), args);
      });
      iterations++;
    } while (expr !== prev && iterations < 20);
    return expr;
  },

  /** Evaluate a single function with already-expanded args string. */
  evalFunction(fn, argsStr) {
    // Split args by comma, respecting nothing nested (already expanded)
    const rawArgs = argsStr.split(',').map(a => a.trim());

    if (fn === 'IF') {
      // IF(condition, trueVal, falseVal) — evaluate condition after ref replacement
      const [condStr, trueStr, falseStr] = rawArgs;
      const condExpr = this.replaceRefs(condStr || '0');
      const condVal = this.safeCalc(condExpr);
      const condBool = condVal !== '0' && condVal !== 0 && condVal !== '' && condVal !== false;
      return condBool ? (trueStr || '0') : (falseStr || '0');
    }

    // Expand ranges inside each arg
    const values = [];
    for (const arg of rawArgs) {
      if (arg.includes(':')) {
        // Range like A1:B3
        const nums = this.expandRange(arg);
        values.push(...nums);
      } else {
        // Single ref or literal
        const ref = this.replaceRefs(arg);
        const num = parseFloat(ref);
        if (!isNaN(num)) values.push(num);
      }
    }

    if (fn === 'SUM') return String(values.reduce((a, b) => a + b, 0));
    if (fn === 'AVERAGE' || fn === 'AVG') return values.length ? String(values.reduce((a, b) => a + b, 0) / values.length) : '0';
    if (fn === 'COUNT') return String(values.length);
    if (fn === 'MAX') return values.length ? String(Math.max(...values)) : '0';
    if (fn === 'MIN') return values.length ? String(Math.min(...values)) : '0';
    return '#NAME?';
  },

  /** Expand a range like "A1:B3" into array of numeric values. */
  expandRange(rangeStr) {
    const parts = rangeStr.trim().split(':');
    if (parts.length !== 2) return [];
    const start = parseAddress(parts[0].trim());
    const end   = parseAddress(parts[1].trim());
    if (!start || !end) return [];
    const values = [];
    for (let r = Math.min(start.row, end.row); r <= Math.max(start.row, end.row); r++) {
      for (let c = Math.min(start.col, end.col); c <= Math.max(start.col, end.col); c++) {
        const disp = getCellDisplay(r, c);
        const num = parseFloat(disp);
        if (!isNaN(num)) values.push(num);
      }
    }
    return values;
  },

  /** Replace cell references (e.g., A1) with their numeric values. */
  replaceRefs(expr) {
    return expr.replace(/\b([A-Z]+)(\d+)\b/g, (match, col, row) => {
      const r = parseInt(row, 10) - 1;
      const c = letterToColIndex(col);
      if (r < 0 || r >= GRID_ROWS || c < 0 || c >= GRID_COLS) return '0';
      const disp = getCellDisplay(r, c);
      const num = parseFloat(disp);
      return isNaN(num) ? '0' : String(num);
    });
  },

  /**
   * Safely calculate a math expression.
   * SECURITY: Only allows digits, operators, parentheses, dots, spaces.
   * Uses a recursive descent parser — avoids eval/new Function (blocked by MV3 CSP).
   */
  safeCalc(expr) {
    const sanitized = expr.replace(/\s/g, '');
    // Whitelist: digits, +, -, *, /, (, ), ., scientific notation e/E
    if (!/^[0-9+\-*\/().,eE]+$/.test(sanitized)) {
      // May be a plain text result from IF — return as-is if no operators
      if (/^[^=<>!&|]+$/.test(expr.trim())) return expr.trim();
      return '#ERR';
    }
    try {
      // Recursive descent parser — safe arithmetic without eval/new Function
      let pos = 0;
      const s = sanitized;
      function parseExpr() {
        let left = parseTerm();
        while (pos < s.length && (s[pos] === '+' || s[pos] === '-')) {
          const op = s[pos++];
          left = op === '+' ? left + parseTerm() : left - parseTerm();
        }
        return left;
      }
      function parseTerm() {
        let left = parseFactor();
        while (pos < s.length && (s[pos] === '*' || s[pos] === '/')) {
          const op = s[pos++];
          const right = parseFactor();
          left = op === '/' ? (right === 0 ? Infinity : left / right) : left * right;
        }
        return left;
      }
      function parseFactor() {
        if (pos < s.length && s[pos] === '(') { pos++; const v = parseExpr(); if (pos < s.length && s[pos] === ')') pos++; return v; }
        if (pos < s.length && s[pos] === '-') { pos++; return -parseFactor(); }
        if (pos < s.length && s[pos] === '+') { pos++; return parseFactor(); }
        let numStr = '';
        while (pos < s.length && /[0-9.eE]/.test(s[pos])) {
          if ((s[pos] === 'e' || s[pos] === 'E') && pos + 1 < s.length && (s[pos + 1] === '+' || s[pos + 1] === '-')) {
            numStr += s[pos++] + s[pos++];
          } else {
            numStr += s[pos++];
          }
        }
        return numStr ? parseFloat(numStr) : 0;
      }
      const result = parseExpr();
      if (typeof result === 'number') {
        if (!isFinite(result)) return '#DIV/0!';
        // Round to avoid floating point noise
        return String(parseFloat(result.toPrecision(10)));
      }
      return String(result);
    } catch (e) {
      return '#ERR';
    }
  }
};

// ============================================================
// 6. UNDO STACK (DI-009, BR-053–BR-056)
// ============================================================

function currentSnapshot() {
  return {
    sheetIndex: currentSheetIndex,
    data: JSON.parse(JSON.stringify(sheets[currentSheetIndex].data))
  };
}

function pushUndo(snapshot) {
  undoStack.push(snapshot);
  if (undoStack.length > 100) undoStack.shift();
}

function undo() {
  if (undoStack.length === 0) return;
  const snap = undoStack.pop();
  currentSheetIndex = snap.sheetIndex;
  sheets[currentSheetIndex].data = snap.data;
  isDirty = true;
  renderGrid();
  renderTabs();
  selectCell(selectedRow, selectedCol);
  updateTitle();
}

// ============================================================
// 7. GRID RENDERER (DI-005, DI-006, BR-007–BR-013, BR-025–BR-026)
// ============================================================

function renderGrid() {
  const table = document.getElementById('grid');
  table.innerHTML = '';

  // Header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Corner cell
  const corner = document.createElement('th');
  corner.className = 'corner-header';
  corner.setAttribute('aria-hidden', 'true');
  headerRow.appendChild(corner);

  // Column letter headers
  for (let c = 0; c < GRID_COLS; c++) {
    const th = document.createElement('th');
    th.className = 'col-header';
    th.dataset.col = c;
    th.textContent = colIndexToLetter(c);
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Data rows
  const tbody = document.createElement('tbody');
  for (let r = 0; r < GRID_ROWS; r++) {
    const tr = document.createElement('tr');

    // Row number header
    const rowNumTd = document.createElement('td');
    rowNumTd.className = 'row-header';
    rowNumTd.dataset.row = r;
    rowNumTd.textContent = r + 1;
    tr.appendChild(rowNumTd);

    // Data cells
    for (let c = 0; c < GRID_COLS; c++) {
      const td = document.createElement('td');
      td.className = 'data-cell';
      td.dataset.row = r;
      td.dataset.col = c;
      td.setAttribute('tabindex', '0');

      applyCellStyle(td, r, c);

      td.addEventListener('click', () => {
        if (editMode) commitEditFromClick();
        selectCell(r, c);
      });
      td.addEventListener('dblclick', () => startInlineEdit(r, c));
      td.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        selectCell(r, c);
        showContextMenu(e, r, c);
      });

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  // Apply selection after render
  applySelectionVisuals(selectedRow, selectedCol);
}

function applyCellStyle(td, r, c) {
  const cell = getCell(r, c);
  const disp = getCellDisplay(r, c);
  td.textContent = disp;

  // Apply format
  const fmt = cell.format || defaultFormat();
  td.classList.toggle('cell-bold',      !!fmt.bold);
  td.classList.toggle('cell-italic',    !!fmt.italic);
  td.classList.toggle('cell-underline', !!fmt.underline);
  td.classList.remove('align-left', 'align-center', 'align-right');
  td.classList.add('align-' + (fmt.align || 'left'));
  if (fmt.fontName) td.style.fontFamily = fmt.fontName;
  if (fmt.fontSize) td.style.fontSize = fmt.fontSize + 'px';
}

function updateCellDisplay(r, c) {
  const td = getCellElement(r, c);
  if (td) applyCellStyle(td, r, c);
}

function getCellElement(r, c) {
  return document.querySelector(`#grid td.data-cell[data-row="${r}"][data-col="${c}"]`);
}

function getColHeaderElement(c) {
  return document.querySelector(`#grid thead th.col-header[data-col="${c}"]`);
}

function getRowHeaderElement(r) {
  return document.querySelector(`#grid tbody td.row-header[data-row="${r}"]`);
}

function reEvaluateAllFormulas() {
  const data = sheets[currentSheetIndex].data;
  for (const key in data) {
    if (data[key].raw && data[key].raw.startsWith('=')) {
      const [r, c] = key.split(',').map(Number);
      updateCellDisplay(r, c);
    }
  }
}

// ============================================================
// 8. CELL SELECTION (DI-006, BR-012)
// ============================================================

function applySelectionVisuals(r, c) {
  // Remove old selection
  const prevSelected = document.querySelector('#grid td.data-cell.selected');
  if (prevSelected) prevSelected.classList.remove('selected');
  document.querySelectorAll('#grid th.col-header.col-selected').forEach(el => el.classList.remove('col-selected'));
  document.querySelectorAll('#grid td.row-header.row-selected').forEach(el => el.classList.remove('row-selected'));

  // Add new selection
  const td = getCellElement(r, c);
  if (td) td.classList.add('selected');

  const colTh = getColHeaderElement(c);
  if (colTh) colTh.classList.add('col-selected');

  const rowTd = getRowHeaderElement(r);
  if (rowTd) rowTd.classList.add('row-selected');
}

function selectCell(r, c) {
  // Clamp to grid bounds
  r = Math.max(0, Math.min(GRID_ROWS - 1, r));
  c = Math.max(0, Math.min(GRID_COLS - 1, c));

  selectedRow = r;
  selectedCol = c;

  applySelectionVisuals(r, c);
  updateFormulaArea();
  updateRibbonState();

  // Scroll into view
  const td = getCellElement(r, c);
  if (td) td.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

// ============================================================
// 9. INLINE EDITING (DI-006, BR-025, BR-026)
// ============================================================

let activeEditInput = null;
let activeEditRow = -1;
let activeEditCol = -1;

function startInlineEdit(r, c) {
  if (editMode) commitEdit(activeEditRow, activeEditCol, activeEditInput ? activeEditInput.value : '');

  editMode = true;
  activeEditRow = r;
  activeEditCol = c;

  const td = getCellElement(r, c);
  if (!td) return;

  const cell = getCell(r, c);
  td.textContent = '';

  const input = document.createElement('input');
  input.className = 'cell-edit-input';
  input.type = 'text';
  input.value = cell.raw || '';
  td.appendChild(input);
  activeEditInput = input;
  input.focus();
  input.select();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(r, c, input.value);
      selectCell(r + 1, c);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit(r, c, input.value);
      selectCell(r, c + 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit(r, c);
    }
  });

  // Sync formula bar while editing
  input.addEventListener('input', () => {
    const fb = document.getElementById('formula-bar');
    if (fb) fb.value = input.value;
  });
}

function commitEdit(r, c, value) {
  if (!editMode) return;
  pushUndo(currentSnapshot());
  setCell(r, c, value);
  editMode = false;
  activeEditInput = null;
  updateCellDisplay(r, c);
  reEvaluateAllFormulas();
  updateTitle();
}

function commitEditFromClick() {
  if (!editMode) return;
  if (activeEditInput) {
    commitEdit(activeEditRow, activeEditCol, activeEditInput.value);
  }
}

function cancelEdit(r, c) {
  editMode = false;
  activeEditInput = null;
  updateCellDisplay(r, c);
}

// ============================================================
// 10. RIBBON COMPONENT (DI-003, BR-004, BR-014–BR-024)
// ============================================================

function renderRibbon() {
  const ribbon = document.getElementById('ribbon');
  ribbon.innerHTML = '';

  for (const group of RIBBON_CONFIG) {
    const groupEl = document.createElement('div');
    groupEl.className = 'ribbon-group';

    const itemsRow = document.createElement('div');
    itemsRow.className = 'ribbon-group-items';

    for (const item of group.items) {
      if (item.type === 'btn') {
        const btn = document.createElement('button');
        btn.className = 'ribbon-btn';
        btn.textContent = item.icon;
        btn.title = item.title || '';
        btn.dataset.action = item.action;
        if (item.id) btn.id = item.id;
        btn.addEventListener('click', () => handleRibbonAction(item.action));
        itemsRow.appendChild(btn);
      } else if (item.type === 'select') {
        const sel = document.createElement('select');
        sel.className = 'ribbon-select ' + (item.cls || '');
        if (item.id) sel.id = item.id;
        for (const opt of item.options) {
          const o = document.createElement('option');
          o.value = opt;
          o.textContent = opt;
          sel.appendChild(o);
        }
        sel.addEventListener('change', () => handleRibbonAction(item.action, sel.value));
        itemsRow.appendChild(sel);
      }
    }

    const label = document.createElement('div');
    label.className = 'ribbon-group-label';
    label.textContent = group.label;

    groupEl.appendChild(itemsRow);
    groupEl.appendChild(label);
    ribbon.appendChild(groupEl);
  }
}

function handleRibbonAction(action, value) {
  const cell = getCell(selectedRow, selectedCol);
  const fmt = { ...cell.format };

  switch (action) {
    case 'cut':
      clipboardCell = { row: selectedRow, col: selectedCol, cut: true, raw: cell.raw, fmt: { ...fmt } };
      break;
    case 'copy':
      clipboardCell = { row: selectedRow, col: selectedCol, cut: false, raw: cell.raw, fmt: { ...fmt } };
      break;
    case 'paste':
      if (clipboardCell) {
        pushUndo(currentSnapshot());
        setCell(selectedRow, selectedCol, clipboardCell.raw);
        setCellFormat(selectedRow, selectedCol, clipboardCell.fmt);
        if (clipboardCell.cut) setCell(clipboardCell.row, clipboardCell.col, '');
        updateCellDisplay(selectedRow, selectedCol);
        if (clipboardCell.cut) updateCellDisplay(clipboardCell.row, clipboardCell.col);
        reEvaluateAllFormulas();
        updateTitle();
      }
      break;
    case 'bold':
      pushUndo(currentSnapshot());
      setCellFormat(selectedRow, selectedCol, { bold: !fmt.bold });
      updateCellDisplay(selectedRow, selectedCol);
      updateRibbonState();
      break;
    case 'italic':
      pushUndo(currentSnapshot());
      setCellFormat(selectedRow, selectedCol, { italic: !fmt.italic });
      updateCellDisplay(selectedRow, selectedCol);
      updateRibbonState();
      break;
    case 'underline':
      pushUndo(currentSnapshot());
      setCellFormat(selectedRow, selectedCol, { underline: !fmt.underline });
      updateCellDisplay(selectedRow, selectedCol);
      updateRibbonState();
      break;
    case 'align-left':
    case 'align-center':
    case 'align-right':
      pushUndo(currentSnapshot());
      setCellFormat(selectedRow, selectedCol, { align: action.replace('align-', '') });
      updateCellDisplay(selectedRow, selectedCol);
      updateRibbonState();
      break;
    case 'fontName':
      pushUndo(currentSnapshot());
      setCellFormat(selectedRow, selectedCol, { fontName: value });
      updateCellDisplay(selectedRow, selectedCol);
      break;
    case 'fontSize':
      pushUndo(currentSnapshot());
      setCellFormat(selectedRow, selectedCol, { fontSize: value });
      updateCellDisplay(selectedRow, selectedCol);
      break;
    case 'autosum':
      // Insert SUM formula for cells above
      if (selectedRow > 0) {
        const topAddr = cellAddress(0, selectedCol);
        const bottomAddr = cellAddress(selectedRow - 1, selectedCol);
        startInlineEditWithValue(selectedRow, selectedCol, `=SUM(${topAddr}:${bottomAddr})`);
      }
      break;
    case 'fill-down':
      if (selectedRow > 0) {
        pushUndo(currentSnapshot());
        const srcCell = getCell(selectedRow - 1, selectedCol);
        setCell(selectedRow, selectedCol, srcCell.raw);
        updateCellDisplay(selectedRow, selectedCol);
        reEvaluateAllFormulas();
        updateTitle();
      }
      break;
    case 'find':
      openFindDialog();
      break;
    default:
      break;
  }
}

function startInlineEditWithValue(r, c, value) {
  selectCell(r, c);
  startInlineEdit(r, c);
  if (activeEditInput) {
    activeEditInput.value = value;
    const fb = document.getElementById('formula-bar');
    if (fb) fb.value = value;
  }
}

function updateRibbonState() {
  const cell = getCell(selectedRow, selectedCol);
  const fmt = cell.format || defaultFormat();

  const setActive = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', !!val);
  };

  setActive('btn-bold',         fmt.bold);
  setActive('btn-italic',       fmt.italic);
  setActive('btn-underline',    fmt.underline);
  setActive('btn-align-left',   fmt.align === 'left' || !fmt.align);
  setActive('btn-align-center', fmt.align === 'center');
  setActive('btn-align-right',  fmt.align === 'right');

  // Update font selects
  const fontNameSel = document.getElementById('font-name-select');
  if (fontNameSel) fontNameSel.value = fmt.fontName || 'Calibri';
  const fontSizeSel = document.getElementById('font-size-select');
  if (fontSizeSel) fontSizeSel.value = fmt.fontSize || '11';
}

// ============================================================
// 11. NAME BOX + FORMULA BAR (DI-004, BR-005, BR-006)
// ============================================================

function updateFormulaArea() {
  const nameBox = document.getElementById('name-box');
  const formulaBar = document.getElementById('formula-bar');
  if (nameBox) nameBox.value = cellAddress(selectedRow, selectedCol);
  if (formulaBar) formulaBar.value = getCell(selectedRow, selectedCol).raw || '';
}

function handleNameBoxEnter(e) {
  if (e.key !== 'Enter') return;
  e.stopPropagation(); // prevent Enter bubbling to global keydown → selectCell(row+1)
  const addr = parseAddress(e.target.value);
  if (addr) {
    selectCell(addr.row, addr.col);
    const td = getCellElement(addr.row, addr.col);
    if (td) td.focus();
  } else {
    // Restore current address
    e.target.value = cellAddress(selectedRow, selectedCol);
  }
}

function handleFormulaBarEnter(e) {
  if (e.key !== 'Enter') return;
  pushUndo(currentSnapshot());
  setCell(selectedRow, selectedCol, e.target.value);
  updateCellDisplay(selectedRow, selectedCol);
  reEvaluateAllFormulas();
  updateTitle();
  // Move down
  selectCell(selectedRow + 1, selectedCol);
}

// ============================================================
// 12. SHEET MANAGER (DI-010, BR-009–BR-011)
// ============================================================

function renderTabs() {
  const tabsEl = document.getElementById('sheet-tabs');
  tabsEl.innerHTML = '';

  for (let i = 0; i < sheets.length; i++) {
    const tab = document.createElement('div');
    tab.className = 'sheet-tab' + (i === currentSheetIndex ? ' active' : '');
    tab.textContent = sheets[i].name;
    tab.dataset.index = i;
    tab.addEventListener('click', () => switchSheet(i));
    tab.addEventListener('dblclick', () => renameSheet(i, tab));
    tabsEl.appendChild(tab);
  }
}

function switchSheet(idx) {
  if (idx === currentSheetIndex) return;
  currentSheetIndex = idx;
  renderGrid();
  renderTabs();
  selectCell(Math.min(selectedRow, GRID_ROWS - 1), Math.min(selectedCol, GRID_COLS - 1));
}

function addSheet() {
  const name = 'Sheet' + (sheets.length + 1);
  sheets.push({ name, data: {} });
  currentSheetIndex = sheets.length - 1;
  isDirty = true;
  renderGrid();
  renderTabs();
  selectCell(0, 0);
  updateTitle();
}

function renameSheet(idx, tabEl) {
  const current = sheets[idx].name;
  const newName = prompt('Rename sheet:', current);
  if (newName && newName.trim()) {
    sheets[idx].name = newName.trim();
    renderTabs();
  }
}

// ============================================================
// 13. CSV MODULE (DI-008, BR-048–BR-052)
// ============================================================

function importCsv() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv,text/csv';
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseCsvIntoSheet(text, file.name);
    };
    reader.readAsText(file);
  });
  input.click();
}

function parseCsvIntoSheet(text, filename) {
  pushUndo(currentSnapshot());
  sheets[currentSheetIndex].data = {};

  const rows = parseRfc4180(text);
  for (let r = 0; r < rows.length && r < GRID_ROWS; r++) {
    for (let c = 0; c < rows[r].length && c < GRID_COLS; c++) {
      if (rows[r][c] !== '') {
        setCell(r, c, rows[r][c]);
      }
    }
  }

  isDirty = false;
  if (filename) {
    const baseName = filename.replace(/\.csv$/i, '');
    document.title = baseName + ' - Excel';
  }

  renderGrid();
  selectCell(0, 0);
}

/** RFC 4180-compliant CSV parser. */
function parseRfc4180(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          // Escaped quote
          field += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        field += ch;
        i++;
        continue;
      }
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === ',') {
      row.push(field);
      field = '';
      i++;
      continue;
    }

    if (ch === '\r' && text[i + 1] === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 2;
      continue;
    }

    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  // Last field/row
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Remove trailing empty row
  if (rows.length > 0 && rows[rows.length - 1].every(f => f === '')) {
    rows.pop();
  }

  return rows;
}

function exportCsv() {
  const data = sheets[currentSheetIndex].data;
  let maxRow = 0, maxCol = 0;
  for (const key in data) {
    if (data[key].raw) {
      const [r, c] = key.split(',').map(Number);
      if (r > maxRow) maxRow = r;
      if (c > maxCol) maxCol = c;
    }
  }

  const lines = [];
  for (let r = 0; r <= maxRow; r++) {
    const fields = [];
    for (let c = 0; c <= maxCol; c++) {
      const raw = getCell(r, c).raw || '';
      fields.push(csvQuote(raw));
    }
    lines.push(fields.join(','));
  }

  const csvText = lines.join('\r\n');
  const blob = new Blob([csvText], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Book1.csv';
  a.click();
  URL.revokeObjectURL(url);
  isDirty = false;
  updateTitle();
}

/** RFC 4180 field quoting. */
function csvQuote(field) {
  if (field.includes(',') || field.includes('\n') || field.includes('"') || field.includes('\r')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

// ============================================================
// 14. CONTEXT MENU (DI-011, BR-040–BR-047)
// ============================================================

let contextMenuRow = -1;
let contextMenuCol = -1;

function buildContextMenu() {
  const menu = document.getElementById('context-menu');
  menu.innerHTML = '';
  for (const item of CONTEXT_MENU_ITEMS) {
    if (item.type === 'separator') {
      const sep = document.createElement('hr');
      sep.className = 'context-menu-separator';
      menu.appendChild(sep);
    } else {
      const div = document.createElement('div');
      div.className = 'context-menu-item';
      div.textContent = item.label;
      div.dataset.action = item.action;
      div.addEventListener('click', () => {
        execContextAction(item.action);
        hideContextMenu();
      });
      menu.appendChild(div);
    }
  }
}

function showContextMenu(e, r, c) {
  contextMenuRow = r;
  contextMenuCol = c;
  const menu = document.getElementById('context-menu');
  menu.style.display = 'block';

  // Position within viewport
  const menuW = menu.offsetWidth || 180;
  const menuH = menu.offsetHeight || 200;
  let x = e.clientX;
  let y = e.clientY;
  if (x + menuW > window.innerWidth)  x = window.innerWidth  - menuW - 4;
  if (y + menuH > window.innerHeight) y = window.innerHeight - menuH - 4;
  menu.style.left = x + 'px';
  menu.style.top  = y + 'px';
}

function hideContextMenu() {
  document.getElementById('context-menu').style.display = 'none';
}

function execContextAction(action) {
  const r = contextMenuRow;
  const c = contextMenuCol;

  switch (action) {
    case 'cut':
      clipboardCell = { row: r, col: c, cut: true, raw: getCell(r, c).raw, fmt: { ...getCell(r, c).format } };
      break;
    case 'copy':
      clipboardCell = { row: r, col: c, cut: false, raw: getCell(r, c).raw, fmt: { ...getCell(r, c).format } };
      break;
    case 'paste':
      if (clipboardCell) {
        pushUndo(currentSnapshot());
        setCell(r, c, clipboardCell.raw);
        setCellFormat(r, c, clipboardCell.fmt);
        if (clipboardCell.cut) setCell(clipboardCell.row, clipboardCell.col, '');
        renderGrid();
        reEvaluateAllFormulas();
        selectCell(r, c);
        updateTitle();
      }
      break;
    case 'insert-row': {
      pushUndo(currentSnapshot());
      const data = sheets[currentSheetIndex].data;
      const newData = {};
      for (const key in data) {
        const [kr, kc] = key.split(',').map(Number);
        if (kr >= r) {
          newData[`${kr + 1},${kc}`] = data[key];
        } else {
          newData[key] = data[key];
        }
      }
      sheets[currentSheetIndex].data = newData;
      isDirty = true;
      renderGrid();
      selectCell(r, c);
      updateTitle();
      break;
    }
    case 'delete-row': {
      pushUndo(currentSnapshot());
      const data = sheets[currentSheetIndex].data;
      const newData = {};
      for (const key in data) {
        const [kr, kc] = key.split(',').map(Number);
        if (kr < r) {
          newData[key] = data[key];
        } else if (kr > r) {
          newData[`${kr - 1},${kc}`] = data[key];
        }
        // kr === r: dropped (deleted)
      }
      sheets[currentSheetIndex].data = newData;
      isDirty = true;
      renderGrid();
      selectCell(Math.max(0, r - 1), c);
      updateTitle();
      break;
    }
    case 'clear-contents':
      pushUndo(currentSnapshot());
      setCell(r, c, '');
      updateCellDisplay(r, c);
      reEvaluateAllFormulas();
      updateTitle();
      break;
    default:
      break;
  }
}

// ============================================================
// 15. HELP DIALOG (DI-013, BR-058)
// ============================================================

function renderHelpDialog() {
  const table = document.getElementById('help-table');
  if (!table) return;
  table.innerHTML = '';

  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  ['Shortcut', 'Action'].forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const s of SHORTCUTS) {
    const tr = document.createElement('tr');
    const tdKey = document.createElement('td');
    tdKey.textContent = s.key;
    tdKey.style.fontFamily = 'monospace';
    const tdAct = document.createElement('td');
    tdAct.textContent = s.action;
    tr.appendChild(tdKey);
    tr.appendChild(tdAct);
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
}

function openHelp() {
  const dlg = document.getElementById('help-dialog');
  if (dlg) dlg.showModal();
}

// ============================================================
// 16. FIND DIALOG (DI-012, BR-039)
// ============================================================

function openFindDialog() {
  const term = prompt('Find:');
  if (!term) return;
  const data = sheets[currentSheetIndex].data;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = getCell(r, c);
      if (cell.raw && cell.raw.toLowerCase().includes(term.toLowerCase())) {
        selectCell(r, c);
        const td = getCellElement(r, c);
        if (td) td.focus();
        return;
      }
    }
  }
  alert('Not found: ' + term);
}

// ============================================================
// 17. KEYBOARD HANDLER (DI-014, BR-057)
// ============================================================

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  // While editing, let the inline input handle shortcuts (except Ctrl combos)
  if (editMode && !e.ctrlKey && !e.metaKey) return;

  const ctrl = e.ctrlKey || e.metaKey;

  // F1 = Help
  if (e.key === 'F1') { e.preventDefault(); openHelp(); return; }
  // F2 = Edit cell
  if (e.key === 'F2') { e.preventDefault(); startInlineEdit(selectedRow, selectedCol); return; }
  // Escape = cancel edit / close menu
  if (e.key === 'Escape') {
    if (editMode) { cancelEdit(activeEditRow, activeEditCol); }
    hideContextMenu();
    return;
  }

  if (ctrl) {
    switch (e.key.toLowerCase()) {
      case 's': e.preventDefault(); exportCsv(); return;
      case 'o': e.preventDefault(); importCsv(); return;
      case 'z': e.preventDefault(); undo(); return;
      case 'b': e.preventDefault(); handleRibbonAction('bold'); return;
      case 'i': e.preventDefault(); handleRibbonAction('italic'); return;
      case 'u': e.preventDefault(); handleRibbonAction('underline'); return;
      case 'c': e.preventDefault(); execContextAction('copy'); return;
      case 'x': e.preventDefault(); execContextAction('cut'); return;
      case 'v': e.preventDefault(); execContextAction('paste'); return;
      case 'home':
        e.preventDefault();
        selectCell(0, 0);
        const td = getCellElement(0, 0);
        if (td) td.focus();
        return;
    }
  }

  // Arrow key navigation
  if (!editMode) {
    switch (e.key) {
      case 'ArrowUp':    e.preventDefault(); selectCell(selectedRow - 1, selectedCol); break;
      case 'ArrowDown':  e.preventDefault(); selectCell(selectedRow + 1, selectedCol); break;
      case 'ArrowLeft':  e.preventDefault(); selectCell(selectedRow, selectedCol - 1); break;
      case 'ArrowRight': e.preventDefault(); selectCell(selectedRow, selectedCol + 1); break;
      case 'Enter':      e.preventDefault(); selectCell(selectedRow + 1, selectedCol); break;
      case 'Tab':        e.preventDefault(); selectCell(selectedRow, selectedCol + 1); break;
      case 'Home':
        e.preventDefault();
        selectCell(selectedRow, 0);
        break;
      case 'End':
        e.preventDefault();
        selectCell(selectedRow, GRID_COLS - 1);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        pushUndo(currentSnapshot());
        setCell(selectedRow, selectedCol, '');
        updateCellDisplay(selectedRow, selectedCol);
        reEvaluateAllFormulas();
        updateTitle();
        break;
      default:
        // Printable character starts inline edit
        if (e.key.length === 1 && !ctrl) {
          startInlineEdit(selectedRow, selectedCol);
          if (activeEditInput) {
            activeEditInput.value = e.key;
            const fb = document.getElementById('formula-bar');
            if (fb) fb.value = e.key;
          }
        }
        break;
    }
  }
}

// ============================================================
// 18. MENU BAR HANDLERS (DI-002, BR-003)
// ============================================================

function bindMenuBar() {
  const tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.textContent.trim();
      if (tabName === 'File') {
        handleFileMenu();
      }
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function handleFileMenu() {
  const choice = confirm('Save as CSV?\n\nOK = Save CSV | Cancel = Open CSV');
  if (choice) {
    exportCsv();
  } else {
    importCsv();
  }
}

// ============================================================
// 19. TITLE MANAGEMENT (BR-002)
// ============================================================

function updateTitle() {
  document.title = isDirty ? '* Book1 - Excel' : 'Book1 - Excel';
}

// ============================================================
// 20. INIT (DI-015)
// ============================================================

function init() {
  renderGrid();
  renderRibbon();
  renderTabs();
  renderHelpDialog();
  buildContextMenu();
  bindMenuBar();

  // Formula bar events
  const nameBox = document.getElementById('name-box');
  const formulaBar = document.getElementById('formula-bar');

  if (nameBox) {
    nameBox.addEventListener('keydown', handleNameBoxEnter);
    nameBox.addEventListener('focus', () => nameBox.select());
  }

  if (formulaBar) {
    formulaBar.addEventListener('keydown', handleFormulaBarEnter);
    formulaBar.addEventListener('focus', () => {
      // Entering formula bar counts as starting cell edit
    });
    formulaBar.addEventListener('input', () => {
      // Live sync back to cell while typing in formula bar (formula bar as primary editor)
    });
  }

  // Help dialog close button
  const closeBtn = document.getElementById('help-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    document.getElementById('help-dialog').close();
  });

  // Add sheet button
  const addBtn = document.getElementById('add-sheet-btn');
  if (addBtn) addBtn.addEventListener('click', addSheet);

  // Dismiss context menu on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('context-menu');
    if (menu && !menu.contains(e.target)) {
      hideContextMenu();
    }
  });

  // Select A1 on start
  selectCell(0, 0);
  updateTitle();
}

document.addEventListener('DOMContentLoaded', init);
