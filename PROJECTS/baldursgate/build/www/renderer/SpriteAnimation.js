// DI-032: Sprite Animation — spritesheet frame cycling with 8-directional support
'use strict';

import { AssetLoader } from '../engine/AssetLoader.js';

// Direction from velocity vector to sprite row index (8-directional)
const DIR_ROWS = { S: 0, SW: 1, W: 2, NW: 3, N: 4, NE: 5, E: 6, SE: 7 };
const DIR_NAMES = ['S','SW','W','NW','N','NE','E','SE'];

function velocityToDir(vx, vy) {
  if (vx === 0 && vy === 0) return 'S';
  const angle = Math.atan2(vy, vx); // -PI to PI, 0 = East
  // Convert to compass (0 = North = -PI/2)
  const deg = ((angle * 180 / Math.PI) + 360 + 90) % 360;
  const idx  = Math.round(deg / 45) % 8;
  return DIR_NAMES[idx];
}

const FALLBACK_COLOURS = ['#4a6aa0','#a06a4a','#6aa04a','#a04a6a','#a0a04a','#4aa0a0','#a04aa0','#4a4aa0'];
let _fallbackIdx = 0;

export class SpriteAnimation {
  constructor(entity) {
    this._entity = entity;
    this._sheet  = null;
    this._def    = entity.animDef || null;
    this._frame  = 0;
    this._frameTimer = 0;
    this._frameDuration = 0.12; // seconds per frame
    this._currentAnim = 'idle';
    this._dir = 'S';
    this._fallbackColor = FALLBACK_COLOURS[(_fallbackIdx++) % FALLBACK_COLOURS.length];

    if (this._def?.sheet) {
      try { this._sheet = AssetLoader.get(this._def.sheet); } catch (_) {}
    }
  }

  setAnim(name) {
    if (this._currentAnim === name) return;
    this._currentAnim = name;
    this._frame = 0;
    this._frameTimer = 0;
  }

  update(dt) {
    const e = this._entity;
    const vx = e.velX || 0, vy = e.velY || 0;

    if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
      this.setAnim('walk');
      this._dir = velocityToDir(vx, vy);
    } else {
      this.setAnim('idle');
    }

    this._frameTimer += dt;
    if (this._frameTimer >= this._frameDuration) {
      this._frameTimer -= this._frameDuration;
      const def   = this._def;
      const anim  = this._currentAnim;
      const count = def?.rows?.[anim]?.frameCount || 4;
      this._frame = (this._frame + 1) % count;
    }
  }

  draw(ctx, sx, sy) {
    const def = this._def;

    if (this._sheet && def) {
      const frameW = def.frameW || 64;
      const frameH = def.frameH || 64;
      const animRow = def.rows?.[this._currentAnim];
      const rowIdx  = animRow ? (DIR_ROWS[this._dir] || 0) + (animRow.baseRow || 0) : 0;
      const srcX = this._frame * frameW;
      const srcY = rowIdx * frameH;

      ctx.drawImage(
        this._sheet,
        srcX, srcY, frameW, frameH,
        sx - frameW / 2, sy - frameH, frameW, frameH
      );
    } else {
      // Fallback: coloured rectangle + direction indicator
      const w = 32, h = 48;
      ctx.fillStyle = this._fallbackColor;
      ctx.fillRect(sx - w / 2, sy - h, w, h);

      // Direction line
      const dirs = { S:[0,1],SW:[-1,1],W:[-1,0],NW:[-1,-1],N:[0,-1],NE:[1,-1],E:[1,0],SE:[1,1] };
      const [dx, dy] = dirs[this._dir] || [0, 1];
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy - h / 2);
      ctx.lineTo(sx + dx * 12, sy - h / 2 + dy * 12);
      ctx.stroke();

      // Entity name
      const e = this._entity;
      if (e.name) {
        ctx.fillStyle = e.hostile ? '#ff6060' : '#e8d5a0';
        ctx.font = '10px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(e.name, sx, sy - h - 3);
      }
    }
  }
}
