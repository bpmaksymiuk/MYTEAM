// DI-008: Combat State — real-time-with-pause AD&D 2e combat
'use strict';

import { StateManager }  from '../../StateManager.js';
import { resolveAttack, resolveDamage, applySpellEffect } from '../../engine/CombatEngine.js';
import { tick as aiTick } from '../../engine/AIController.js';
import * as IsoMath       from '../../engine/IsoMath.js';

export class CombatState {
  constructor(playing, enemies) {
    this._playing    = playing;
    this._paused     = false;
    this._combatants = [...(playing.party || []), ...(enemies || [])];
    this._initiative = [...this._combatants].sort((a, b) => (b.stats?.DEX || 10) - (a.stats?.DEX || 10));
    this._actionQueues = new Map();
    this._onKeyDown  = null;
    this._onMouseClick = null;
    this._targetMode = false;
    this._selectedSpell = null;
    this._messageTimer = 0;
    this._hud = playing._hud;
    // Mark enemies hostile
    for (const e of enemies || []) { e.hostile = true; }
  }

  enter() {
    // Initialise action queues
    this._combatants.forEach(e => this._actionQueues.set(e.id || e.name, []));

    this._onKeyDown = e => {
      if (e.code === 'Space') {
        e.preventDefault();
        this._togglePause();
      }
    };

    this._onMouseClick = e => {
      if (e.button !== 0) return;
      if (this._targetMode) {
        this._targetMode = false;
        // Find nearest enemy to click position
        const canvas = StateManager.canvas;
        const r = canvas.getBoundingClientRect();
        const sx = e.clientX - r.left, sy = e.clientY - r.top;
        const p = this._playing;
        const cam = { x: p.cameraX || 0, y: p.cameraY || 0 };
        const wt = IsoMath.screenToWorld(sx + cam.x, sy + cam.y);
        const target = this._combatants.find(
          c => c.hostile && Math.abs(c.tileX - wt.tileX) < 2 && Math.abs(c.tileY - wt.tileY) < 2
        );
        if (target && this._selectedSpell) {
          const leader = p.party[0];
          const q = this._actionQueues.get(leader.id || leader.name) || [];
          q.push({ type: 'CAST_SPELL', spell: this._selectedSpell, target, cooldown: 1.5 });
          this._selectedSpell = null;
        }
      }
    };

    window.addEventListener('keydown', this._onKeyDown);
    StateManager.canvas.addEventListener('click', this._onMouseClick);
    this._playing._hud?.showMessage('Combat begins! [SPACE] to pause.');
  }

  exit() {
    window.removeEventListener('keydown', this._onKeyDown);
    StateManager.canvas.removeEventListener('click', this._onMouseClick);
  }

  update(dt) {
    if (this._paused) return;
    const p = this._playing;

    for (const entity of this._initiative) {
      if (entity.hp <= 0) continue;
      const qKey = entity.id || entity.name;
      const queue = this._actionQueues.get(qKey) || [];

      // AI fills queue when empty
      if (queue.length === 0 && entity.hostile) {
        const action = aiTick(entity, this._combatants, p.area?.collisionMap, p.area?.mapWidth);
        if (action) queue.push({ ...action, cooldown: action.cooldown ?? (1 / (entity.attacksPerRound || 1)) });
        this._actionQueues.set(qKey, queue);
      }

      if (queue.length === 0) continue;
      const action = queue[0];
      action.cooldown = (action.cooldown || 0) - dt;

      if (action.cooldown <= 0) {
        this._resolveAction(entity, action);
        queue.shift();
      }
    }

    // Check end condition
    const enemiesAlive = this._combatants.filter(c => c.hostile && c.hp > 0);
    if (enemiesAlive.length === 0) {
      this._endCombat();
    }
  }

  render(ctx) {
    if (this._paused) {
      // Draw PAUSED indicator
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#c8960c';
      ctx.font = 'bold 48px Georgia';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 20; ctx.shadowColor = 'rgba(200,150,12,0.8)';
      ctx.fillText('PAUSED', ctx.canvas.width / 2, ctx.canvas.height / 2);
      ctx.restore();
    }
  }

  _togglePause() {
    this._paused = !this._paused;
    this._playing._hud?.showMessage(this._paused ? 'PAUSED' : 'Resumed');
  }

  _resolveAction(entity, action) {
    const p = this._playing;
    if (action.type === 'ATTACK') {
      const target = action.target;
      if (!target || target.hp <= 0) return;
      const result = resolveAttack(entity, target);
      if (result.result !== 'MISS') {
        const dmg = resolveDamage(entity, entity.equipped?.mainHand);
        target.hp = Math.max(0, target.hp - dmg);
        const msg = `${entity.name} ${result.result === 'CRITICAL' ? 'CRITICALLY HIT' : 'hit'} ${target.name} for ${dmg} damage!`;
        this._playing._hud?.showMessage(msg);
      }
    } else if (action.type === 'CAST_SPELL') {
      const results = applySpellEffect(action.spell, [action.target], entity, p.worldFlags);
      this._playing._hud?.showMessage(`${entity.name} cast ${action.spell.name}!`);
    } else if (action.type === 'MOVE') {
      if (action.path?.length > 0) {
        const next = action.path.shift();
        entity.tileX = next.x; entity.tileY = next.y;
      }
    }
  }

  _endCombat() {
    const p = this._playing;
    // Award XP
    const xpGained = this._combatants
      .filter(c => c.hostile)
      .reduce((sum, c) => sum + (c.xpValue || 50), 0);

    for (const pc of p.party) {
      pc.xp = (pc.xp || 0) + xpGained;
      p._checkLevelUp?.(pc);
    }

    this._playing._hud?.showMessage(`Victory! +${xpGained} XP`);
    import('./ExplorationState.js').then(m => {
      p.setSubState(new m.ExplorationState(p));
    });
  }
}
