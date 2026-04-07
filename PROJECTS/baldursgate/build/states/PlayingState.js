// DI-006: Playing State — root game state, owns all persistent game data
'use strict';

import { StateManager }    from '../StateManager.js';
import { AssetLoader }     from '../engine/AssetLoader.js';
import { AudioManager }    from '../engine/AudioManager.js';
import * as IsoMath         from '../engine/IsoMath.js';
import QuestEngine         from '../engine/QuestEngine.js';
import SaveManager         from '../engine/SaveManager.js';
import { ExplorationState } from './substate/ExplorationState.js';
import { HUD }             from '../ui/HUD.js';
import { AreaRenderer }    from '../renderer/AreaRenderer.js';

export class PlayingState {
  constructor(areaId) {
    this.areaId     = areaId || 'candlekeep';
    this.party      = [];
    this.worldFlags = {};
    this.subState   = null;
    this.area       = null;
    this.enemies    = [];
    this.npcs       = [];
    this.cameraX    = 0;
    this.cameraY    = 0;
    this.partyGold  = 200;
    this.reputation = 10;
    this.discovered = [this.areaId];
    this.fogOfWar   = null;
    this.fogMaps    = {};
    this._hud       = null;
    this._onKeyDown = null;
    this._onKeyUp   = null;
    this._scrollKeys = new Set();
  }

  enter() {
    this._hud = new HUD(this.party);
    this._hud.init();

    QuestEngine.init(this.party);
    this._loadArea(this.areaId).then(() => {
      this.setSubState(new ExplorationState(this));
      AudioManager.playMusic('music_explore');
      // BUG-002 fix: unhide HUD only after area has fully loaded
      // BUG-003 fix: re-init HUD here so portrait bar is built with confirmed party data
      document.getElementById('hud').classList.remove('hidden');
      this._hud.init();
    });

    this._onKeyDown = e => {
      this._scrollKeys.add(e.code);
      if (e.code === 'F5') { e.preventDefault(); this._quickSave(); }
      if (e.code === 'F9') { e.preventDefault(); this._quickLoad(); }
      if (e.code === 'Escape') this._openOptions();
      if (e.code === 'KeyI') { e.preventDefault(); this._openPanel('inventory'); }
      if (e.code === 'KeyJ') { e.preventDefault(); this._openPanel('journal');   }
      if (e.code === 'KeyM') { e.preventDefault(); this._openPanel('map');       }
      if (e.code === 'KeyC') { e.preventDefault(); this._openPanel('character'); }
    };
    this._onKeyUp = e => { this._scrollKeys.delete(e.code); };
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup',   this._onKeyUp);

    // HUD button events (btn-spell, btn-rest, etc.)
    this._onPlayingAction = e => {
      const action = e.detail?.action || '';
      if      (action === 'btn-inventory') this._openPanel('inventory');
      else if (action === 'btn-journal')   this._openPanel('journal');
      else if (action === 'btn-map')       this._openPanel('map');
      else if (action === 'btn-spell')     this._openPanel('spellbook');
      else if (action === 'btn-rest')      this._openPanel('rest');
    };
    window.addEventListener('playing:action', this._onPlayingAction);
  }

  exit() {
    this.subState?.exit?.();
    this._hud?.destroy?.();
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup',   this._onKeyUp);
    window.removeEventListener('playing:action', this._onPlayingAction);
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('ui-layer').classList.remove('active');
    document.getElementById('ui-layer').innerHTML = '';
  }

  setSubState(s) {
    this.subState?.exit?.();
    this.subState = s;
    s.enter?.();
  }

  update(dt) {
    this._handleScroll(dt);
    this._hud?.update(this.party, false);
    this.subState?.update?.(dt);
  }

  render(ctx) {
    AreaRenderer.render(ctx, this);
    this.subState?.render?.(ctx);
  }

  onResize() {
    this.subState?.onResize?.();
  }

  async _loadArea(areaId) {
    const areaData = window.GameData?.areas?.find?.(a => a.id === areaId) || null;
    if (!areaData) {
      // Minimal fallback area
      this.area = {
        id: areaId, name: areaId,
        mapWidth: 64, mapHeight: 64,
        collisionMap: new Uint8Array(64 * 64),
        exits: [], dangerous: false,
      };
    } else {
      const mapWidth  = areaData.mapWidth  || 64;
      const mapHeight = areaData.mapHeight || 64;
      const collision = new Uint8Array(mapWidth * mapHeight);

      // Mark obstacle tiles as blocked
      (areaData.obstacles || []).forEach(({ x, y }) => {
        if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight) {
          collision[y * mapWidth + x] = 1;
        }
      });

      this.area = { ...areaData, collisionMap: collision };
    }

    // Restore or create fog of war
    if (this.fogMaps[areaId]) {
      const { FogOfWar } = await import('../engine/FogOfWar.js');
      this.fogOfWar = new FogOfWar(this.area.mapWidth, this.area.mapHeight);
      this.fogOfWar.deserialise(this.fogMaps[areaId]);
    } else {
      const { FogOfWar } = await import('../engine/FogOfWar.js');
      this.fogOfWar = new FogOfWar(this.area.mapWidth, this.area.mapHeight);
      // BUG-001 fix: always reveal starting area — fall back to tile (10,10) when party is empty
      const first = this.party[0];
      const startX = first ? Math.round(first.tileX || 10) : 10;
      const startY = first ? Math.round(first.tileY || 10) : 10;
      this.fogOfWar.reveal(startX, startY, 8);
    }

    // Spawn NPCs from area data — area.npcs may be string IDs or full objects
    this.npcs = (this.area.npcs || []).map((def, i) => {
      if (typeof def === 'string') {
        // Look up in companions or skip
        const found = window.GameData?.companions?.find?.(c => c.id === def);
        if (!found) return null;
        def = found;
      }
      return {
        ...def,
        id:    def.id || def.name,
        tileX: def.spawnX ?? (8 + i * 2),
        tileY: def.spawnY ?? 8,
        path: [], velX: 0, velY: 0,
      };
    }).filter(Boolean);

    // Centre camera on party leader
    const leader = this.party[0];
    if (leader) {
      const sc = IsoMath.worldToScreen(leader.tileX || 10, leader.tileY || 10);
      const canvas = StateManager.canvas;
      this.cameraX = sc.sx - canvas.width  / 2;
      this.cameraY = sc.sy - canvas.height / 2;
    }

    if (!this.discovered.includes(areaId)) this.discovered.push(areaId);
  }

  transitionArea(newAreaId, entryPoint) {
    // Save current fog map
    if (this.fogOfWar) {
      this.fogMaps[this.areaId] = this.fogOfWar.serialise();
    }
    this.subState?.exit?.();
    this.subState = null;
    this.areaId = newAreaId;

    if (entryPoint && this.party.length > 0) {
      this.party[0].tileX = entryPoint.x || 5;
      this.party[0].tileY = entryPoint.y || 5;
    }

    this._loadArea(newAreaId).then(() => {
      this.setSubState(new ExplorationState(this));
    });
  }

  _handleScroll(dt) {
    const speed = 400 * dt;
    if (this._scrollKeys.has('ArrowLeft')  || this._scrollKeys.has('KeyA')) this.cameraX -= speed;
    if (this._scrollKeys.has('ArrowRight') || this._scrollKeys.has('KeyD')) this.cameraX += speed;
    if (this._scrollKeys.has('ArrowUp')    || this._scrollKeys.has('KeyW')) this.cameraY -= speed;
    if (this._scrollKeys.has('ArrowDown')  || this._scrollKeys.has('KeyS')) this.cameraY += speed;
    this.cameraX = Math.max(0, this.cameraX);
    this.cameraY = Math.max(0, this.cameraY);
  }

  _checkLevelUp(entity) {
    const cls = window.GameData?.classes?.find?.(c => c.id === entity.class || c.name === entity.class);
    if (!cls) return;
    const xpTable = cls.xpThresholds || cls.levelXP || [];
    const newLevel = xpTable.findIndex(threshold => entity.xp < threshold);
    const targetLevel = newLevel === -1 ? xpTable.length : newLevel;
    if (targetLevel > entity.level) {
      entity.level = targetLevel;
      import('../ui/LevelUpPanel.js').then(m => {
        const panel = new m.LevelUpPanel(entity);
        panel.show();
      });
    }
  }

  async _quickSave() {
    try {
      const gs = this.buildGameState();
      await SaveManager.save('quicksave', gs);
      this._hud?.showMessage('Quick Saved');
    } catch (e) {
      console.error('Quick save failed:', e);
    }
  }

  async _quickLoad() {
    try {
      const gs = await SaveManager.load('quicksave');
      if (!gs) throw new Error('No quicksave found');
      this.restoreFromSave(gs);
      this._hud?.showMessage('Quick Loaded');
    } catch (e) {
      this._hud?.showMessage('No quicksave found.');
    }
  }

  _openOptions() {
    import('./substate/OptionsState.js').then(m => {
      const opts = new m.OptionsState(this, () => { opts.panel?.remove(); });
      opts.enter();
    });
  }

  _openPanel(type) {
    // Clear any existing overlay first
    const ui = document.getElementById('ui-layer');
    if (ui) { ui.innerHTML = ''; ui.classList.remove('active'); }

    if (type === 'inventory' || type === 'character') {
      import('./substate/InventoryState.js').then(m => {
        const inv = new m.InventoryState(this, 0);
        inv.enter();
      });
    } else if (type === 'journal') {
      import('./substate/JournalState.js').then(m => {
        const j = new m.JournalState(this);
        j.enter();
      });
    } else if (type === 'map') {
      import('./substate/MapState.js').then(m => {
        const ms = new m.MapState(this);
        ms.enter();
      });
    } else if (type === 'spellbook') {
      import('../ui/SpellbookPanel.js').then(m => {
        const leader = this.party[0];
        if (leader) { const sp = new m.SpellbookPanel(leader); sp.show(); }
      });
    } else if (type === 'rest') {
      import('./substate/RestState.js').then(m => {
        const rs = new m.RestState(this);
        rs.enter();
      });
    }
  }

  buildGameState() {
    return {
      areaId:     this.areaId,
      party:      this.party.map(e => ({ ...e, path: [] })),
      worldFlags: { ...this.worldFlags },
      quests:     QuestEngine.serialise?.() || {},
      fogMaps:    Object.fromEntries(
        Object.entries(this.fogMaps).map(([k, v]) => [k, Array.from(v)])
      ),
      partyGold:  this.partyGold,
      reputation: this.reputation,
      discovered: [...this.discovered],
    };
  }

  restoreFromSave(gs) {
    this.areaId     = gs.areaId;
    this.party      = gs.party || [];
    this.worldFlags = gs.worldFlags || {};
    this.partyGold  = gs.partyGold || 0;
    this.reputation = gs.reputation || 10;
    this.discovered = gs.discovered || [gs.areaId];
    this.fogMaps    = Object.fromEntries(
      Object.entries(gs.fogMaps || {}).map(([k, v]) => [k, new Uint8Array(v)])
    );
    if (gs.quests && QuestEngine.deserialise) QuestEngine.deserialise(gs.quests);
    this._loadArea(this.areaId).then(() => {
      this.setSubState(new ExplorationState(this));
    });
  }
}
