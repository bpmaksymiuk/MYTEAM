// DI-006: Formula Parser and Evaluator (Recursive Descent, no eval())

window.Formula = (() => {

  // ── Tokenizer ──────────────────────────────────────────────────────────────

  const TT = {
    NUMBER: 'NUMBER', STRING: 'STRING', IDENT: 'IDENT',
    RANGE_REF: 'RANGE_REF', CELL_REF: 'CELL_REF',
    OP: 'OP', LPAREN: 'LPAREN', RPAREN: 'RPAREN',
    COMMA: 'COMMA', EOF: 'EOF',
  };

  function tokenize(expr) {
    const tokens = [];
    let i = 0;
    const s = expr.trim();

    while (i < s.length) {
      const ch = s[i];

      // Whitespace
      if (/\s/.test(ch)) { i++; continue; }

      // Number
      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(s[i+1] || ''))) {
        let num = '';
        while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++];
        tokens.push({ type: TT.NUMBER, value: parseFloat(num) });
        continue;
      }

      // String literal
      if (ch === '"') {
        let str = '';
        i++;
        while (i < s.length && s[i] !== '"') {
          if (s[i] === '\\') i++;
          str += s[i++];
        }
        i++; // closing quote
        tokens.push({ type: TT.STRING, value: str });
        continue;
      }

      // Range ref or Cell ref or Ident (function name)
      if (/[A-Za-z]/.test(ch)) {
        // Lookahead for range (A1:B3) first
        const rangeMatch = s.slice(i).match(/^([A-Za-z]+[0-9]+):([A-Za-z]+[0-9]+)/i);
        if (rangeMatch) {
          tokens.push({ type: TT.RANGE_REF, value: rangeMatch[0].toUpperCase() });
          i += rangeMatch[0].length;
          continue;
        }
        // Cell ref (A1)
        const cellMatch = s.slice(i).match(/^([A-Za-z]+)([0-9]+)/);
        if (cellMatch) {
          // Could be a function — peek ahead past the match for '('
          const afterCell = s.slice(i + cellMatch[0].length).trimStart();
          if (afterCell[0] === '(') {
            // It's a function name
            tokens.push({ type: TT.IDENT, value: cellMatch[1].toUpperCase() });
            i += cellMatch[1].length;
            continue;
          }
          tokens.push({ type: TT.CELL_REF, value: cellMatch[0].toUpperCase() });
          i += cellMatch[0].length;
          continue;
        }
        // Plain identifier (function with multi-letter name like SUM, AVERAGE)
        let ident = '';
        while (i < s.length && /[A-Za-z_]/.test(s[i])) ident += s[i++];
        tokens.push({ type: TT.IDENT, value: ident.toUpperCase() });
        continue;
      }

      // Operators and punctuation
      if ('+-*/'.includes(ch)) { tokens.push({ type: TT.OP, value: ch }); i++; continue; }
      if (ch === '(') { tokens.push({ type: TT.LPAREN }); i++; continue; }
      if (ch === ')') { tokens.push({ type: TT.RPAREN }); i++; continue; }
      if (ch === ',') { tokens.push({ type: TT.COMMA }); i++; continue; }

      // Unknown — skip
      i++;
    }

    tokens.push({ type: TT.EOF });
    return tokens;
  }

  // ── Parser ─────────────────────────────────────────────────────────────────

  function parse(tokens) {
    let pos = 0;

    function peek() { return tokens[pos]; }
    function consume() { return tokens[pos++]; }
    function expect(type) {
      const t = consume();
      if (t.type !== type) throw new Error('Expected ' + type + ', got ' + t.type);
      return t;
    }

    function parseExpr() { return parseAddSub(); }

    function parseAddSub() {
      let left = parseMulDiv();
      while (peek().type === TT.OP && (peek().value === '+' || peek().value === '-')) {
        const op = consume().value;
        const right = parseMulDiv();
        left = { type: 'BINOP', op, left, right };
      }
      return left;
    }

    function parseMulDiv() {
      let left = parseUnary();
      while (peek().type === TT.OP && (peek().value === '*' || peek().value === '/')) {
        const op = consume().value;
        const right = parseUnary();
        left = { type: 'BINOP', op, left, right };
      }
      return left;
    }

    function parseUnary() {
      if (peek().type === TT.OP && peek().value === '-') {
        consume();
        return { type: 'UNARY', op: '-', operand: parseUnary() };
      }
      return parsePrimary();
    }

    function parsePrimary() {
      const t = peek();
      if (t.type === TT.NUMBER) { consume(); return { type: 'NUMBER', value: t.value }; }
      if (t.type === TT.STRING) { consume(); return { type: 'STRING', value: t.value }; }
      if (t.type === TT.CELL_REF) { consume(); return { type: 'CELL_REF', ref: t.value }; }
      if (t.type === TT.RANGE_REF) { consume(); return { type: 'RANGE_REF', ref: t.value }; }
      if (t.type === TT.IDENT) {
        const name = consume().value;
        expect(TT.LPAREN);
        const args = [];
        if (peek().type !== TT.RPAREN) {
          args.push(parseExpr());
          while (peek().type === TT.COMMA) { consume(); args.push(parseExpr()); }
        }
        expect(TT.RPAREN);
        return { type: 'FUNC', name, args };
      }
      if (t.type === TT.LPAREN) {
        consume();
        const inner = parseExpr();
        expect(TT.RPAREN);
        return inner;
      }
      throw new Error('Unexpected token: ' + t.type);
    }

    const ast = parseExpr();
    return ast;
  }

  // ── Evaluator ──────────────────────────────────────────────────────────────

  function colLetterToIndex(col) {
    col = col.toUpperCase();
    let idx = 0;
    for (let i = 0; i < col.length; i++) idx = idx * 26 + (col.charCodeAt(i) - 64);
    return idx - 1;
  }

  function parseCellRef(ref) {
    const m = ref.match(/^([A-Z]+)([0-9]+)$/);
    if (!m) return null;
    return { row: parseInt(m[2], 10) - 1, col: colLetterToIndex(m[1]) };
  }

  function getRange(rangeRef, grid) {
    const [start, end] = rangeRef.split(':');
    const s = parseCellRef(start);
    const e = parseCellRef(end);
    if (!s || !e) return [];
    const values = [];
    for (let r = s.row; r <= e.row; r++) {
      for (let c = s.col; c <= e.col; c++) {
        if (r >= 0 && c >= 0 && r < grid.length && c < grid[0].length) {
          const raw = grid[r][c].raw;
          const v = parseFloat(raw);
          if (!isNaN(v) && raw !== '') values.push(v);
        }
      }
    }
    return values;
  }

  function getCellNumeric(ref, grid) {
    const coord = parseCellRef(ref);
    if (!coord) return '#REF!';
    if (coord.row < 0 || coord.col < 0 || coord.row >= grid.length || coord.col >= (grid[0] || []).length) return '#REF!';
    const cell = grid[coord.row][coord.col];
    const v = parseFloat(cell.raw);
    if (cell.raw === '' || cell.raw === null) return 0;
    if (!isNaN(v)) return v;
    // Could be computed value (another formula) — try the computed value
    const v2 = parseFloat(cell.value);
    if (!isNaN(v2)) return v2;
    return 0;
  }

  const FUNCS = {
    SUM: arr => arr.reduce((a, b) => a + b, 0),
    AVERAGE: arr => arr.length === 0 ? '#DIV/0!' : arr.reduce((a, b) => a + b, 0) / arr.length,
    MIN: arr => arr.length === 0 ? 0 : Math.min(...arr),
    MAX: arr => arr.length === 0 ? 0 : Math.max(...arr),
    COUNT: arr => arr.length,
  };

  function evalNode(node, grid) {
    switch (node.type) {
      case 'NUMBER': return node.value;
      case 'STRING': return node.value;
      case 'CELL_REF': return getCellNumeric(node.ref, grid);
      case 'RANGE_REF': return getRange(node.ref, grid); // returns array
      case 'UNARY': {
        const v = evalNode(node.operand, grid);
        if (typeof v === 'string') return v;
        return node.op === '-' ? -v : v;
      }
      case 'BINOP': {
        const l = evalNode(node.left, grid);
        const r = evalNode(node.right, grid);
        if (typeof l === 'string' && l.startsWith('#')) return l;
        if (typeof r === 'string' && r.startsWith('#')) return r;
        switch (node.op) {
          case '+': return l + r;
          case '-': return l - r;
          case '*': return l * r;
          case '/': return r === 0 ? '#DIV/0!' : l / r;
        }
        return '#ERR';
      }
      case 'FUNC': {
        const fn = FUNCS[node.name];
        if (!fn) return '#ERR';
        // Evaluate args — if arg is RANGE_REF, it yields an array
        let arr = [];
        for (const arg of node.args) {
          const v = evalNode(arg, grid);
          if (Array.isArray(v)) arr = arr.concat(v);
          else if (typeof v === 'number') arr.push(v);
          // string args in aggregate functions are skipped (COUNT behaviour)
        }
        const result = fn(arr);
        return result;
      }
      default: return '#ERR';
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Evaluate a raw cell value against the grid.
   * @param {string} raw
   * @param {Array} grid - 2D array of {raw, value} cell objects
   * @returns {string|number}
   */
  function evaluate(raw, grid) {
    if (typeof raw !== 'string' || raw[0] !== '=') return raw;
    const expr = raw.slice(1);
    try {
      const tokens = tokenize(expr);
      const ast = parse(tokens);
      const result = evalNode(ast, grid);
      if (Array.isArray(result)) return '#ERR'; // bare range not valid as cell result
      if (typeof result === 'number') {
        // Round floats to avoid floating-point noise
        return parseFloat(result.toPrecision(12));
      }
      return String(result);
    } catch (e) {
      return '#ERR';
    }
  }

  /**
   * Extract cell references from a raw formula string.
   * @param {string} raw
   * @returns {string[]} - array of cell address strings like ['A1', 'B3']
   */
  function getRefs(raw) {
    if (typeof raw !== 'string' || raw[0] !== '=') return [];
    const refs = [];
    try {
      const tokens = tokenize(raw.slice(1));
      for (const t of tokens) {
        if (t.type === TT.CELL_REF) refs.push(t.value);
        if (t.type === TT.RANGE_REF) {
          // Expand range to individual cell refs
          const [start, end] = t.value.split(':');
          const s = parseCellRef(start);
          const e = parseCellRef(end);
          if (s && e) {
            for (let r = s.row; r <= e.row; r++) {
              for (let c = s.col; c <= e.col; c++) {
                const col = String.fromCharCode(65 + c);
                refs.push(col + (r + 1));
              }
            }
          }
        }
      }
    } catch (_) {}
    return refs;
  }

  return { evaluate, getRefs };
})();
