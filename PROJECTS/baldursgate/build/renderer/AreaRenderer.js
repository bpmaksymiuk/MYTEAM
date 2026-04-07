// DI-031: Area Renderer — isometric area + entities each frame
'use strict';

import * as IsoMath        from '../engine/IsoMath.js';
import { SpriteAnimation } from './SpriteAnimation.js';
import { AssetLoader }    from '../engine/AssetLoader.js';

// Weak map caching SpriteAnimation per entity
const _animCache = new WeakMap();

function getAnim(entity) {
  if (!_animCache.has(entity)) {
    _animCache.set(entity, new SpriteAnimation(entity));
  }
  return _animCache.get(entity);
}

export const AreaRenderer = {
  render(ctx, playingState) {
    const { width: cw, height: ch } = ctx.canvas;
    const cam = { x: playingState.cameraX || 0, y: playingState.cameraY || 0 };
    const area = playingState.area;

    // 1. Clear canvas
    ctx.clearRect(0, 0, cw, ch);

    // 2. Draw background
    const bgKey = area ? `bg_${area.id}` : 'bg_candlekeep';
    let bg = null;
    try { bg = AssetLoader.get(bgKey); } catch (_) {}

    if (bg) {
      // Scale background image to fill the entire canvas
      ctx.drawImage(bg, 0, 0, cw, ch);
    } else {
      // Fallback: isometric tile grid
      ctx.fillStyle = '#1a1208';
      ctx.fillRect(0, 0, cw, ch);
      if (area) {
        const mw = area.mapWidth  || 64;
        const mh = area.mapHeight || 64;
        ctx.strokeStyle = '#2a1e08';
        ctx.lineWidth = 1;
        for (let ty = 0; ty < mh; ty++) {
          for (let tx = 0; tx < mw; tx++) {
            const sc = IsoMath.worldToScreen(tx, ty);
            const sx = sc.sx - cam.x, sy = sc.sy - cam.y;
            if (sx < -IsoMath.TILE_W || sx > cw + IsoMath.TILE_W) continue;
            if (sy < -IsoMath.TILE_H || sy > ch + IsoMath.TILE_H) continue;

            ctx.beginPath();
            ctx.moveTo(sx, sy - IsoMath.TILE_H / 2);
            ctx.lineTo(sx + IsoMath.TILE_W / 2, sy);
            ctx.lineTo(sx, sy + IsoMath.TILE_H / 2);
            ctx.lineTo(sx - IsoMath.TILE_W / 2, sy);
            ctx.closePath();
            // Colour by collision
            const isBlocked = area.collisionMap?.[ty * mw + tx] === 1;
            ctx.fillStyle = isBlocked ? '#2a1408' : '#1e1a0a';
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    }

    // 3. Ground items (loot piles)
    for (const item of playingState.groundItems || []) {
      const sc = IsoMath.worldToScreen(item.tileX, item.tileY);
      const sx = sc.sx - cam.x, sy = sc.sy - cam.y;
      ctx.fillStyle = '#c8960c';
      ctx.beginPath(); ctx.arc(sx, sy - 4, 6, 0, Math.PI * 2); ctx.fill();
    }

    // 4. Collect visible entities and depth-sort
    const allEntities = [
      ...(playingState.party  || []),
      ...(playingState.enemies || []),
      ...(playingState.npcs   || []),
    ];
    const sorted = IsoMath.depthSort(allEntities);

    // 5. Update + draw each entity
    // (dt not available here; SpriteAnimation.update is called from here with 0 as a safe no-op)
    for (const entity of sorted) {
      const sc = IsoMath.worldToScreen(entity.tileX, entity.tileY);
      const sx = sc.sx - cam.x, sy = sc.sy - cam.y;
      if (sx < -80 || sx > cw + 80 || sy < -100 || sy > ch + 40) continue;

      const anim = getAnim(entity);
      anim.draw(ctx, sx, sy);
    }

    // 6. Fog of War overlay
    if (playingState.fogOfWar && area) {
      playingState.fogOfWar.renderOverlay(ctx, cw, ch, IsoMath.TILE_W, IsoMath.TILE_H, cam);
    }
  }
};

export default AreaRenderer;
