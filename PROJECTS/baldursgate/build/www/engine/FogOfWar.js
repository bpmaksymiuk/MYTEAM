// DI-023: Fog of War — Uint8Array bitmask per area
'use strict';

const EXPLORE_RADIUS = 8;
const COMBAT_RADIUS  = 6;

export class FogOfWar {
  constructor(mapWidth, mapHeight) {
    this.mapWidth  = mapWidth;
    this.mapHeight = mapHeight;
    this.map       = new Uint8Array(mapWidth * mapHeight);
  }

  reveal(tileX, tileY, radius = EXPLORE_RADIUS) {
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= r2) {
          const tx = tileX + dx;
          const ty = tileY + dy;
          if (tx >= 0 && ty >= 0 && tx < this.mapWidth && ty < this.mapHeight) {
            this.map[ty * this.mapWidth + tx] = 1;
          }
        }
      }
    }
  }

  revealCombat(tileX, tileY) {
    this.reveal(tileX, tileY, COMBAT_RADIUS);
  }

  isRevealed(tileX, tileY) {
    if (tileX < 0 || tileY < 0 || tileX >= this.mapWidth || tileY >= this.mapHeight) return false;
    return this.map[tileY * this.mapWidth + tileX] === 1;
  }

  renderOverlay(ctx, canvasW, canvasH, tileW, tileH, camera) {
    const cx = camera ? camera.x : 0;
    const cy = camera ? camera.y : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    for (let ty = 0; ty < this.mapHeight; ty++) {
      for (let tx = 0; tx < this.mapWidth; tx++) {
        if (!this.isRevealed(tx, ty)) {
          const sx = (tx - ty) * (tileW / 2) - cx;
          const sy = (tx + ty) * (tileH / 2) - cy;
          if (sx > -tileW && sx < canvasW + tileW && sy > -tileH && sy < canvasH + tileH) {
            ctx.fillRect(sx - tileW / 2, sy - tileH / 2, tileW, tileH);
          }
        }
      }
    }
  }

  serialise() {
    return Array.from(this.map);
  }

  deserialise(arr) {
    this.map = new Uint8Array(arr);
  }
}

export default FogOfWar;
