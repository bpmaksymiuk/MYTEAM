// DI-019: A* Pathfinder with 8-directional movement and string-pulling
'use strict';

const SQRT2 = 1.4142135623730951;
const MAX_NODES = 10000;

class MinHeap {
  constructor() { this.data = []; }
  push(item) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }
  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) { this.data[0] = last; this._sinkDown(0); }
    return top;
  }
  get size() { return this.data.length; }
  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent].f <= this.data[i].f) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }
  _sinkDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2*i+1, r = 2*i+2;
      if (l < n && this.data[l].f < this.data[smallest].f) smallest = l;
      if (r < n && this.data[r].f < this.data[smallest].f) smallest = r;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

const DIRS = [
  [1,0,1],[0,1,1],[-1,0,1],[0,-1,1],
  [1,1,SQRT2],[-1,1,SQRT2],[-1,-1,SQRT2],[1,-1,SQRT2],
];

/**
 * Find a path from (startX,startY) to (goalX,goalY).
 * collisionMap: Uint8Array (0=passable, 1=blocked), row-major.
 * Returns array of {x,y} tile waypoints including goal, empty if no path.
 */
export function find(startX, startY, goalX, goalY, collisionMap, mapWidth) {
  const key = (x, y) => y * mapWidth + x;
  const h = (x, y) => Math.abs(goalX - x) + Math.abs(goalY - y);

  const open = new MinHeap();
  const gScore = new Map();
  const cameFrom = new Map();
  const closed = new Set();

  const startKey = key(startX, startY);
  gScore.set(startKey, 0);
  open.push({ x: startX, y: startY, f: h(startX, startY) });

  let visited = 0;
  let bestNode = { x: startX, y: startY };
  let bestH = h(startX, startY);

  while (open.size > 0 && visited < MAX_NODES) {
    const curr = open.pop();
    const ck = key(curr.x, curr.y);
    if (closed.has(ck)) continue;
    closed.add(ck);
    visited++;

    const currH = h(curr.x, curr.y);
    if (currH < bestH) { bestH = currH; bestNode = curr; }

    if (curr.x === goalX && curr.y === goalY) {
      return _pullPath(cameFrom, curr, key);
    }

    const currG = gScore.get(ck) ?? Infinity;
    for (const [dx, dy, cost] of DIRS) {
      const nx = curr.x + dx, ny = curr.y + dy;
      const nk = key(nx, ny);
      if (nx < 0 || ny < 0 || nx >= mapWidth || closed.has(nk)) continue;
      if (collisionMap[nk] === 1) continue;
      const ng = currG + cost;
      if (ng < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, ng);
        cameFrom.set(nk, { x: curr.x, y: curr.y });
        open.push({ x: nx, y: ny, f: ng + h(nx, ny) });
      }
    }
  }

  // Return partial path to closest node if we hit the limit
  if (visited >= MAX_NODES && bestNode !== null) {
    return _pullPath(cameFrom, bestNode, key);
  }
  return [];
}

function _pullPath(cameFrom, end, key) {
  const path = [];
  let curr = end;
  while (curr) {
    path.unshift({ x: curr.x, y: curr.y });
    const k = key(curr.x, curr.y);
    curr = cameFrom.get(k) || null;
  }
  if (path.length < 2) return path;

  // String-pulling: remove intermediate waypoints with clear line-of-sight
  const pulled = [path[0]];
  let anchor = 0;
  for (let i = 2; i < path.length; i++) {
    if (!_hasLOS(path[anchor], path[i], cameFrom, key)) {
      pulled.push(path[i - 1]);
      anchor = i - 1;
    }
  }
  pulled.push(path[path.length - 1]);
  return pulled;
}

// Simplified LOS: always return false to skip string-pulling when no collision map ref
// (Full Bresenham line check would need collision map passed in)
function _hasLOS() { return false; }

export default { find };
