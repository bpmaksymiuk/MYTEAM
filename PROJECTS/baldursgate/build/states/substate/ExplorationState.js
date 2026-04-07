// DI-007: Exploration State — mouse-driven party movement, entity interaction
'use strict';

import { StateManager }  from '../../StateManager.js';
import * as IsoMath       from '../../engine/IsoMath.js';
import PathFinder        from '../../engine/PathFinder.js';
import QuestEngine       from '../../engine/QuestEngine.js';

export class ExplorationState {
  constructor(playing) {
    this._playing = playing;
    this._hoveredEntity = null;
    this._onMouseMove = null;
    this._onMouseClick = null;
    this._onKeyDown = null;
    this._fogTimer = 0;
  }

  enter() {
    const canvas = StateManager.canvas;

    this._onMouseMove = e => {
      const r = canvas.getBoundingClientRect();
      const sx = e.clientX - r.left, sy = e.clientY - r.top;
      const p = this._playing;
      const cam = { x: p.cameraX || 0, y: p.cameraY || 0 };
      const wt = IsoMath.screenToWorld(sx + cam.x, sy + cam.y);
      this._hoveredEntity = this._entityAt(wt.tileX, wt.tileY);
      canvas.style.cursor = this._hoveredEntity ? 'pointer' : 'default';
    };

    this._onMouseClick = e => {
      if (e.button !== 0) return;
      const r = canvas.getBoundingClientRect();
      const sx = e.clientX - r.left, sy = e.clientY - r.top;
      const p = this._playing;
      const cam = { x: p.cameraX || 0, y: p.cameraY || 0 };
      const wt = IsoMath.screenToWorld(sx + cam.x, sy + cam.y);

      const ent = this._entityAt(wt.tileX, wt.tileY);
      if (ent) {
        this._interactWith(ent);
      } else {
        this._movePartyTo(wt.tileX, wt.tileY);
      }
    };

    this._onKeyDown = e => {
      if (e.code === 'Space') e.preventDefault();
    };

    canvas.addEventListener('mousemove', this._onMouseMove);
    canvas.addEventListener('click', this._onMouseClick);
    window.addEventListener('keydown', this._onKeyDown);
  }

  exit() {
    const canvas = StateManager.canvas;
    canvas.removeEventListener('mousemove', this._onMouseMove);
    canvas.removeEventListener('click', this._onMouseClick);
    window.removeEventListener('keydown', this._onKeyDown);
    canvas.style.cursor = 'default';
  }

  update(dt) {
    const p = this._playing;
    const party = p.party || [];
    const area  = p.area;
    if (!area) return;

    // Advance party along paths
    for (const entity of party) {
      if (!entity.path || entity.path.length === 0) continue;
      const speed = (entity.moveSpeed || 3) * dt;
      const target = entity.path[0];
      const dx = target.x - entity.tileX, dy = target.y - entity.tileY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= speed) {
        entity.tileX = target.x; entity.tileY = target.y;
        entity.path.shift();
      } else {
        entity.tileX += (dx / dist) * speed;
        entity.tileY += (dy / dist) * speed;
      }
      entity.velX = dx; entity.velY = dy;
    }

    // Fog of war
    const leader = party[0];
    if (leader && p.fogOfWar) {
      p.fogOfWar.reveal(Math.round(leader.tileX), Math.round(leader.tileY), 8);
    }
    this._fogTimer += dt;

    // Area exit detection
    if (area.exits) {
      for (const exit of area.exits) {
        for (const entity of party) {
          const dx = Math.abs(entity.tileX - exit.x), dy = Math.abs(entity.tileY - exit.y);
          if (dx < 1 && dy < 1) {
            p.transitionArea(exit.targetArea, exit.entryPoint);
            return;
          }
        }
      }
    }
  }

  render(ctx) {
    // Selection circle under active party member
    const p = this._playing;
    const leader = p.party?.[0];
    if (leader) {
      const cam = { x: p.cameraX || 0, y: p.cameraY || 0 };
      const sc = IsoMath.worldToScreen(leader.tileX, leader.tileY);
      const sx = sc.sx - cam.x, sy = sc.sy - cam.y;
      ctx.save();
      ctx.strokeStyle = '#00ff80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 20, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Hover highlight
    if (this._hoveredEntity) {
      const cam = { x: p.cameraX || 0, y: p.cameraY || 0 };
      const sc = IsoMath.worldToScreen(this._hoveredEntity.tileX, this._hoveredEntity.tileY);
      const sx = sc.sx - cam.x, sy = sc.sy - cam.y;
      ctx.save();
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 22, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  _entityAt(tx, ty) {
    const p = this._playing;
    const allEntities = [...(p.party || []), ...(p.enemies || []), ...(p.npcs || [])];
    return allEntities.find(e =>
      Math.abs(e.tileX - tx) < 1 && Math.abs(e.tileY - ty) < 1 && e !== p.party[0]
    ) || null;
  }

  _movePartyTo(tx, ty) {
    const p = this._playing;
    if (!p.area?.collisionMap) return;
    const leader = p.party?.[0];
    if (!leader) return;
    const path = PathFinder.find(
      Math.round(leader.tileX), Math.round(leader.tileY),
      tx, ty,
      p.area.collisionMap, p.area.mapWidth || 64
    );
    leader.path = path;

    // Followers get offset paths
    for (let i = 1; i < p.party.length; i++) {
      const offsetX = (i % 2 === 0 ? 1 : -1);
      const offsetY = Math.floor(i / 2);
      const follower = p.party[i];
      const fPath = PathFinder.find(
        Math.round(follower.tileX), Math.round(follower.tileY),
        tx + offsetX, ty + offsetY,
        p.area.collisionMap, p.area.mapWidth || 64
      );
      follower.path = fPath;
    }
  }

  _interactWith(entity) {
    const p = this._playing;
    if (entity.aiMode === 'Aggressive' || entity.hostile) {
      import('./CombatState.js').then(m => {
        p.setSubState(new m.CombatState(p, [entity]));
      });
    } else if (entity.dialogueNodeId) {
      import('./DialogueState.js').then(m => {
        p.setSubState(new m.DialogueState(p, entity));
      });
    }
  }
}
