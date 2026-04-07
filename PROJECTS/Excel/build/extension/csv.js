// DI-005: CSV Parser and Serializer (RFC 4180)

window.CSV = (() => {
  /**
   * Parse RFC 4180 CSV text into a 2D string array.
   * @param {string} text
   * @returns {string[][]}
   */
  function parse(text) {
    // Strip BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    // Normalize line endings
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    const rows = [];
    let row = [];
    let field = '';
    let i = 0;
    const len = text.length;

    // States
    const FIELD_START = 0, IN_FIELD = 1, IN_QUOTED = 2, AFTER_QUOTE = 3;
    let state = FIELD_START;

    while (i < len) {
      const ch = text[i];

      switch (state) {
        case FIELD_START:
          if (ch === '"') {
            state = IN_QUOTED;
          } else if (ch === ',') {
            row.push('');
            // stay in FIELD_START
          } else if (ch === '\n') {
            row.push('');
            rows.push(row);
            row = [];
            // stay in FIELD_START
          } else {
            field += ch;
            state = IN_FIELD;
          }
          break;

        case IN_FIELD:
          if (ch === ',') {
            row.push(field);
            field = '';
            state = FIELD_START;
          } else if (ch === '\n') {
            row.push(field);
            field = '';
            rows.push(row);
            row = [];
            state = FIELD_START;
          } else {
            field += ch;
          }
          break;

        case IN_QUOTED:
          if (ch === '"') {
            state = AFTER_QUOTE;
          } else {
            field += ch;
          }
          break;

        case AFTER_QUOTE:
          if (ch === '"') {
            // Escaped double-quote
            field += '"';
            state = IN_QUOTED;
          } else if (ch === ',') {
            row.push(field);
            field = '';
            state = FIELD_START;
          } else if (ch === '\n') {
            row.push(field);
            field = '';
            rows.push(row);
            row = [];
            state = FIELD_START;
          } else {
            // Unexpected char after closing quote — treat as end of field
            row.push(field);
            field = ch;
            state = IN_FIELD;
          }
          break;
      }
      i++;
    }

    // Flush last field and row
    row.push(field);
    if (row.some(f => f !== '') || rows.length === 0) {
      rows.push(row);
    }

    return rows;
  }

  /**
   * Serialize a 2D string array to RFC 4180 CSV text.
   * @param {string[][]} data
   * @returns {string}
   */
  function serialize(data) {
    return data.map(row =>
      row.map(cell => {
        const s = String(cell);
        if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      }).join(',')
    ).join('\r\n');
  }

  return { parse, serialize };
})();
