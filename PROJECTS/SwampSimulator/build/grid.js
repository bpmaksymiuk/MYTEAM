// grid.js — spatial hash (DI-006)
export function buildGrid(agents, cellSize, w, h) {
  const cols = Math.ceil(w / cellSize) + 1;
  const rows = Math.ceil(h / cellSize) + 1;
  const buckets = new Map();
  for (const a of agents) {
    const c = Math.floor(a.x / cellSize);
    const r = Math.floor(a.y / cellSize);
    const k = c + ',' + r;
    let b = buckets.get(k);
    if (!b) { b = []; buckets.set(k, b); }
    b.push(a);
  }
  return { cellSize, cols, rows, buckets };
}

export function nearby(grid, x, y, radius) {
  const out = [];
  const c0 = Math.floor((x - radius) / grid.cellSize);
  const c1 = Math.floor((x + radius) / grid.cellSize);
  const r0 = Math.floor((y - radius) / grid.cellSize);
  const r1 = Math.floor((y + radius) / grid.cellSize);
  for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) {
    const b = grid.buckets.get(c + ',' + r);
    if (b) for (const a of b) out.push(a);
  }
  return out;
}
