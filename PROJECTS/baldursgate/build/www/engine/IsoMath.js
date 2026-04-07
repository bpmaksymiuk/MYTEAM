// DI-022: Isometric Math utilities
'use strict';

export const TILE_W = 64;   // pixels per tile (width of diamond)
export const TILE_H = 32;   // pixels per tile (height of diamond)
export const HALF_W = TILE_W / 2;
export const HALF_H = TILE_H / 2;

/**
 * Convert tile coordinates to screen (canvas) pixel coordinates.
 * Origin is the top-centre of the isometric map.
 */
export function worldToScreen(tx, ty) {
  return {
    sx: (tx - ty) * HALF_W,
    sy: (tx + ty) * HALF_H,
  };
}

/**
 * Convert screen pixel coordinates back to tile coordinates (rounded).
 */
export function screenToWorld(sx, sy) {
  const tx = (sx / HALF_W + sy / HALF_H) / 2;
  const ty = (sy / HALF_H - sx / HALF_W) / 2;
  return { tx: Math.floor(tx), ty: Math.floor(ty) };
}

/**
 * Sort entities by isometric depth so closer tiles render on top.
 * Sorts ascending by (ty + tx * 0.5).
 */
export function depthSort(entities) {
  return [...entities].sort((a, b) => (a.tileY + a.tileX * 0.5) - (b.tileY + b.tileX * 0.5));
}

/**
 * Map offset so the camera centres on a tile position.
 * Returns {offX, offY} to apply as ctx.translate().
 */
export function cameraOffset(tx, ty, canvasW, canvasH) {
  const { sx, sy } = worldToScreen(tx, ty);
  return {
    offX: canvasW / 2 - sx,
    offY: canvasH / 2 - sy,
  };
}

/**
 * Clamp a value between lo and hi.
 */
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/**
 * Tile distance (Chebyshev) — useful for range checks.
 */
export function tileDist(ax, ay, bx, by) {
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}

export default { TILE_W, TILE_H, worldToScreen, screenToWorld, depthSort, cameraOffset, clamp, tileDist };
