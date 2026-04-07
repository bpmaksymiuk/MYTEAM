// DI-007 / DI-008 / DI-009: Grid State, Rendering, CSV I/O, Menus, Shortcuts, Help

(() => {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────────
  const ROWS = 50;
  const COLS = 26;

  // ── State ─────────────────────────────────────────────────────────────────
  let cells = [];
  let activeCell = { row: 0, col: 0 };
  let editMode = false;
  let editPriorValue = '';
  let isDirty = false;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function colLetter(c) {
    // Single-letter columns A-Z (26 cols)
    return String.fromCharCode(65 + c);
  }

  function colIndex(letter) {
    return letter.toUpperCase().charCodeAt(0) - 65;
  }

  function cellId(row, col) {
    return colLetter(col) + (row + 1);
  }

  function cellRefToCoord(ref) {
    const m = ref.match(/^([A-Z]+)([0-9]+)$/i);
    if (!m) return null;
    const col = colIndex(m[1][0]); // single-letter only for 26 cols
    const row = parseInt(m[2], 10) - 1;
    return { row, col };
  }

  // ── Cell model initialisation ─────────────────────────────────────────────
  function initCells() {
    cells = [];
    for (let r = 0; r < ROWS; r++) {
      cells[r] = [];
      for (let c = 0; c < COLS; c++) {
        cells[r][c] = { raw: '', value: '' };
      }
    }
  }

  // ── Formula dependency graph & recalculation ───────────────────────────────
  /**
   * Topological sort via BFS (Kahn's algorithm).
   * Returns ordered list of {row,col} to evaluate.
   */
  function topoSort() {
    // Build adjacency: if cell B depends on A, edge A→B
    const deps = {}; // key: "r,c" → set of "r,c" that depend on it
    const inDegree = {};

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const key = r + ',' + c;
        if (!inDegree[key]) inDegree[key] = 0;
        const refs = Formula.getRefs(cells[r][c].raw);
        for (const ref of refs) {
          const coord = cellRefToCoord(ref);
          if (!coord) continue;
          if (coord.row < 0 || coord.row >= ROWS || coord.col < 0 || coord.col >= COLS) continue;
          const depKey = coord.row + ',' + coord.col;
          if (!deps[depKey]) deps[depKey] = [];
          deps[depKey].push(key);
          inDegree[key] = (inDegree[key] || 0) + 1;
        }
      }
    }

    const queue = [];
    for (const key in inDegree) {
      if (inDegree[key] === 0) queue.push(key);
    }

    const order = [];
    while (queue.length) {
      const key = queue.shift();
      order.push(key);
      for (const dep of (deps[key] || [])) {
        inDegree[dep]--;
        if (inDegree[dep] === 0) queue.push(dep);
      }
    }

    // Detect cycle — any key not in order has a cycle
    const result = [];
    const inOrder = new Set(order);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const key = r + ',' + c;
        if (!inOrder.has(key) && cells[r][c].raw.startsWith('=')) {
          cells[r][c].value = '#CIRC';
        }
      }
    }

    return order.map(key => {
      const [r, c] = key.split(',').map(Number);
      return { row: r, col: c };
    });
  }

  function recalculateAll() {
    const order = topoSort();
    for (const { row, col } of order) {
      const raw = cells[row][col].raw;
      cells[row][col].value = raw.startsWith('=')
        ? String(Formula.evaluate(raw, cells))
        : raw;
    }
  }

  function recalculate(startRow, startCol) {
    // Recalculate the changed cell and all dependents
    const changed = new Set();
    const queue = [{ row: startRow, col: startCol }];
    while (queue.length) {
      const { row, col } = queue.shift();
      const key = row + ',' + col;
      if (changed.has(key)) continue;
      changed.add(key);
      const raw = cells[row][col].raw;
      cells[row][col].value = raw.startsWith('=')
        ? String(Formula.evaluate(raw, cells))
        : raw;
      // Find all cells that reference this one
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const refs = Formula.getRefs(cells[r][c].raw);
          const k = row + ',' + col;
          const id = cellId(row, col);
          if (refs.includes(id) && !changed.has(r + ',' + c)) {
            queue.push({ row: r, col: c });
          }
        }
      }
    }
  }

  // ── Dirty state ────────────────────────────────────────────────────────────
  function setDirty(val) {
    isDirty = val;
    document.title = val ? '● Spreadsheet' : 'Spreadsheet';
  }

  // ── Status bar ─────────────────────────────────────────────────────────────
  let statusTimer = null;
  function showStatus(msg) {
    const el = document.getElementById('status-msg');
    if (!el) return;
    el.textContent = msg;
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { el.textContent = ''; }, 2000);
  }

  // ── Grid rendering ─────────────────────────────────────────────────────────
  let editInput = null; // floating inline editor

  function getOrCreateEditInput() {
    if (editInput) return editInput;
    editInput = document.createElement('input');
    editInput.id = 'cell-editor';
    editInput.type = 'text';
    editInput.style.position = 'absolute';
    editInput.style.zIndex = '10';
    editInput.style.border = '2px solid #1565c0';
    editInput.style.outline = 'none';
    editInput.style.padding = '0 2px';
    editInput.style.fontFamily = 'Calibri, Candara, sans-serif';
    editInput.style.fontSize = '13px';
    editInput.style.boxSizing = 'border-box';
    document.getElementById('grid-wrapper').appendChild(editInput);

    editInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); commitEdit(); moveActive(1, 0); }
      else if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
      else if (e.key === 'Tab') { e.preventDefault(); commitEdit(); moveActive(0, e.shiftKey ? -1 : 1); }
    });

    editInput.addEventListener('blur', () => {
      if (editMode) commitEdit();
    });

    return editInput;
  }

  function positionEditInput(td) {
    const input = getOrCreateEditInput();
    const wrapper = document.getElementById('grid-wrapper');
    const wRect = wrapper.getBoundingClientRect();
    const tdRect = td.getBoundingClientRect();
    input.style.left = (tdRect.left - wRect.left + wrapper.scrollLeft) + 'px';
    input.style.top = (tdRect.top - wRect.top + wrapper.scrollTop) + 'px';
    input.style.width = Math.max(tdRect.width, 120) + 'px';
    input.style.height = tdRect.height + 'px';
    return input;
  }

  function renderGrid() {
    const thead = document.getElementById('col-headers');
    const tbody = document.getElementById('grid-body');

    // Column headers
    let headerRow = '<tr><th class="row-num-header"></th>';
    for (let c = 0; c < COLS; c++) headerRow += `<th class="col-header">${colLetter(c)}</th>`;
    headerRow += '</tr>';
    thead.innerHTML = headerRow;

    // Data rows
    let html = '';
    for (let r = 0; r < ROWS; r++) {
      html += `<tr><td class="row-num">${r + 1}</td>`;
      for (let c = 0; c < COLS; c++) {
        const val = cells[r][c].value;
        const display = val === null || val === undefined ? '' : String(val);
        const isNum = !isNaN(parseFloat(display)) && display.trim() !== '';
        const align = isNum ? 'right' : 'left';
        html += `<td data-row="${r}" data-col="${c}" class="grid-cell" style="text-align:${align}">${escapeHtml(display)}</td>`;
      }
      html += '</tr>';
    }
    tbody.innerHTML = html;

    // Re-apply active highlight
    highlightActive();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getActiveTd() {
    return document.querySelector(`#grid-body td[data-row="${activeCell.row}"][data-col="${activeCell.col}"]`);
  }

  function highlightActive() {
    document.querySelectorAll('#grid-body td.active-cell').forEach(el => el.classList.remove('active-cell'));
    const td = getActiveTd();
    if (td) td.classList.add('active-cell');
  }

  // ── Active cell management ─────────────────────────────────────────────────
  function setActive(row, col) {
    if (row < 0) row = 0;
    if (col < 0) col = 0;
    if (row >= ROWS) row = ROWS - 1;
    if (col >= COLS) col = COLS - 1;
    activeCell = { row, col };
    document.getElementById('cell-ref').textContent = cellId(row, col);
    const raw = cells[row][col].raw;
    document.getElementById('formula-input').value = raw;
    highlightActive();
    scrollToActive();
  }

  function scrollToActive() {
    const td = getActiveTd();
    if (td) td.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function moveActive(dRow, dCol) {
    setActive(activeCell.row + dRow, activeCell.col + dCol);
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────
  function startEdit(initialChar) {
    if (editMode) return;
    editMode = true;
    editPriorValue = cells[activeCell.row][activeCell.col].raw;

    const td = getActiveTd();
    if (!td) return;
    const input = positionEditInput(td);
    input.value = initialChar !== undefined ? initialChar : editPriorValue;
    input.style.display = 'block';
    input.focus();
    if (initialChar === undefined) {
      // Place cursor at end
      input.setSelectionRange(input.value.length, input.value.length);
    }
    // Update formula bar while typing
    input.addEventListener('input', () => {
      document.getElementById('formula-input').value = input.value;
    }, { once: false });

    // Sync formula bar → edit input
    document.getElementById('formula-input').addEventListener('input', syncFormulaToEditor);
  }

  function syncFormulaToEditor() {
    if (editMode && editInput) editInput.value = document.getElementById('formula-input').value;
  }

  function commitEdit() {
    if (!editMode) return;
    editMode = false;
    const raw = editInput ? editInput.value : cells[activeCell.row][activeCell.col].raw;
    cells[activeCell.row][activeCell.col].raw = raw;
    recalculate(activeCell.row, activeCell.col);
    if (editInput) editInput.style.display = 'none';
    document.getElementById('formula-input').value = raw;
    document.getElementById('formula-input').removeEventListener('input', syncFormulaToEditor);
    setDirty(true);
    updateCell(activeCell.row, activeCell.col);
  }

  function cancelEdit() {
    if (!editMode) return;
    editMode = false;
    cells[activeCell.row][activeCell.col].raw = editPriorValue;
    if (editInput) editInput.style.display = 'none';
    document.getElementById('formula-input').value = editPriorValue;
    document.getElementById('formula-input').removeEventListener('input', syncFormulaToEditor);
    updateCell(activeCell.row, activeCell.col);
  }

  /** Refresh a single cell's TD without full re-render */
  function updateCell(row, col) {
    const td = document.querySelector(`#grid-body td[data-row="${row}"][data-col="${col}"]`);
    if (!td) return;
    const val = cells[row][col].value;
    const display = val === null || val === undefined ? '' : String(val);
    const isNum = !isNaN(parseFloat(display)) && display.trim() !== '';
    td.style.textAlign = isNum ? 'right' : 'left';
    td.textContent = display;
  }

  // ── Grid event delegation ──────────────────────────────────────────────────
  function initGridEvents() {
    const tbody = document.getElementById('grid-body');

    tbody.addEventListener('click', e => {
      const td = e.target.closest('td[data-row]');
      if (!td) return;
      const row = parseInt(td.dataset.row, 10);
      const col = parseInt(td.dataset.col, 10);

      if (editMode) commitEdit();
      setActive(row, col);
    });

    tbody.addEventListener('dblclick', e => {
      const td = e.target.closest('td[data-row]');
      if (!td) return;
      const row = parseInt(td.dataset.row, 10);
      const col = parseInt(td.dataset.col, 10);
      setActive(row, col);
      startEdit();
    });

    document.addEventListener('keydown', e => {
      // Let the edit input handle its own keys
      if (editMode) return;

      const key = e.key;
      if (key === 'ArrowUp') { e.preventDefault(); moveActive(-1, 0); }
      else if (key === 'ArrowDown') { e.preventDefault(); moveActive(1, 0); }
      else if (key === 'ArrowLeft') { e.preventDefault(); moveActive(0, -1); }
      else if (key === 'ArrowRight') { e.preventDefault(); moveActive(0, 1); }
      else if (key === 'Tab') { e.preventDefault(); moveActive(0, e.shiftKey ? -1 : 1); }
      else if (key === 'Enter') { e.preventDefault(); startEdit(); }
      else if (key === 'Delete' || key === 'Backspace') {
        e.preventDefault();
        cells[activeCell.row][activeCell.col].raw = '';
        cells[activeCell.row][activeCell.col].value = '';
        recalculate(activeCell.row, activeCell.col);
        updateCell(activeCell.row, activeCell.col);
        document.getElementById('formula-input').value = '';
        setDirty(true);
      }
      else if (key === 'F2') { e.preventDefault(); startEdit(); }
      else if (!e.ctrlKey && !e.metaKey && !e.altKey && key.length === 1) {
        startEdit(key);
      }
    });

    // Formula bar edit
    document.getElementById('formula-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!editMode) startEdit();
        commitEdit();
        moveActive(1, 0);
      } else if (e.key === 'Escape') {
        if (editMode) cancelEdit();
      } else if (!editMode) {
        startEdit();
      }
    });
  }

  // ── CSV I/O (DI-008) ───────────────────────────────────────────────────────
  function confirmDataLoss(action) {
    if (!isDirty) { action(); return; }
    if (window.confirm('You have unsaved changes. Continue without saving?')) action();
  }

  function openCSV() {
    confirmDataLoss(() => {
      document.getElementById('file-input').click();
    });
  }

  function saveCSV() {
    // Determine used extent
    let maxRow = 0, maxCol = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (cells[r][c].raw !== '') {
          if (r > maxRow) maxRow = r;
          if (c > maxCol) maxCol = c;
        }
      }
    }

    const grid = [];
    for (let r = 0; r <= maxRow; r++) {
      const row = [];
      for (let c = 0; c <= maxCol; c++) {
        row.push(cells[r][c].raw);
      }
      grid.push(row);
    }

    const csvStr = CSV.serialize(grid);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.csv';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 1000);
    setDirty(false);
    showStatus('Saved spreadsheet.csv');
  }

  function initFileInput() {
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target.result;
        const parsed = CSV.parse(text);
        initCells();
        for (let r = 0; r < parsed.length && r < ROWS; r++) {
          for (let c = 0; c < parsed[r].length && c < COLS; c++) {
            cells[r][c].raw = parsed[r][c];
          }
        }
        recalculateAll();
        renderGrid();
        setActive(0, 0);
        setDirty(false);
        showStatus('Opened ' + file.name);
      };
      reader.readAsText(file);
      // Reset so same file can be re-opened
      fileInput.value = '';
    });
  }

  // ── Shortcuts & Menus (DI-009) ─────────────────────────────────────────────
  const SHORTCUTS = [
    { menu: 'file', label: 'Open',     shortcut: 'Ctrl+O',    action: openCSV },
    { menu: 'file', label: 'Save',     shortcut: 'Ctrl+S',    action: saveCSV },
    { menu: 'help', label: 'Help',     shortcut: 'F1',        action: showHelp },
    {               label: 'Go to A1', shortcut: 'Ctrl+Home', action: () => setActive(0, 0) },
  ];

  function matchesShortcut(e, shortcut) {
    const parts = shortcut.split('+');
    const mainKey = parts[parts.length - 1].toLowerCase();
    const needsCtrl = parts.includes('Ctrl');
    const needsShift = parts.includes('Shift');
    const needsAlt = parts.includes('Alt');

    const keyMatch = e.key.toLowerCase() === mainKey ||
      (mainKey === 'home' && e.key === 'Home') ||
      (mainKey === 'f1' && e.key === 'F1');

    return (
      keyMatch &&
      !!e.ctrlKey === needsCtrl &&
      !!e.shiftKey === needsShift &&
      !!e.altKey === needsAlt
    );
  }

  function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      for (const s of SHORTCUTS) {
        if (matchesShortcut(e, s.shortcut)) {
          e.preventDefault();
          s.action();
          return;
        }
      }
    });
  }

  function initMenus() {
    const menuBtns = document.querySelectorAll('.menu-btn');
    const dropdownContainer = document.getElementById('dropdown-container');

    function closeMenus() {
      dropdownContainer.innerHTML = '';
      dropdownContainer.style.display = 'none';
    }

    menuBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menuName = btn.dataset.menu;
        const items = SHORTCUTS.filter(s => s.menu === menuName);

        // If already open, close
        if (dropdownContainer.style.display === 'block' && dropdownContainer.dataset.menu === menuName) {
          closeMenus();
          return;
        }

        dropdownContainer.dataset.menu = menuName;
        dropdownContainer.innerHTML = '';
        dropdownContainer.style.display = 'block';

        const rect = btn.getBoundingClientRect();
        dropdownContainer.style.left = rect.left + 'px';
        dropdownContainer.style.top = rect.bottom + 'px';

        items.forEach(item => {
          const div = document.createElement('div');
          div.className = 'dropdown-item';
          div.innerHTML = `<span>${item.label}</span><span class="shortcut-hint">${item.shortcut}</span>`;
          div.addEventListener('click', () => { closeMenus(); item.action(); });
          dropdownContainer.appendChild(div);
        });
      });
    });

    document.addEventListener('click', closeMenus);
  }

  // ── Help Dialog ────────────────────────────────────────────────────────────
  function showHelp() {
    const tbody = document.querySelector('#shortcuts-table tbody');
    tbody.innerHTML = '';
    SHORTCUTS.filter(s => s.label).forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.label}</td><td>${s.shortcut}</td>`;
      tbody.appendChild(tr);
    });
    // Also add navigation shortcuts
    [
      ['Navigate cells', 'Arrow keys'],
      ['Enter edit mode', 'Enter or F2'],
      ['Confirm edit & move down', 'Enter'],
      ['Confirm edit & move right', 'Tab'],
      ['Cancel edit', 'Escape'],
      ['Delete cell contents', 'Delete / Backspace'],
    ].forEach(([label, shortcut]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${label}</td><td>${shortcut}</td>`;
      tbody.appendChild(tr);
    });
    document.getElementById('help-dialog').showModal();
  }

  function initHelpDialog() {
    const dlg = document.getElementById('help-dialog');
    const closeBtn = document.getElementById('help-close');
    if (closeBtn) closeBtn.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initCells();
    renderGrid();
    recalculateAll();
    setActive(0, 0);
    initGridEvents();
    initFileInput();
    initMenus();
    initKeyboardShortcuts();
    initHelpDialog();
  });

})();
