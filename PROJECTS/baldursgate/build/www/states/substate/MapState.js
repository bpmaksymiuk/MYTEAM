// DI-013: Map State — world map + local fog-of-war map
'use strict';

import { AssetLoader } from '../../engine/AssetLoader.js';

export class MapState {
  constructor(playing, previousSubState) {
    this._playing = playing;
    this._prev    = previousSubState;
    this._panel   = null;
    this._view    = 'world'; // 'world' | 'local'
  }

  enter() {
    this._panel = document.createElement('div');
    this._panel.id = 'map-panel';
    Object.assign(this._panel.style, {
      position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
      background: 'rgba(5,3,16,0.97)', display: 'flex', flexDirection: 'column',
      pointerEvents: 'auto',
    });
    document.getElementById('ui-layer').appendChild(this._panel);
    document.getElementById('ui-layer').classList.add('active');
    this._render();
  }

  exit() {
    this._panel?.remove(); this._panel = null;
    document.getElementById('ui-layer').classList.remove('active');
  }

  update(_dt) {}
  render(_ctx) {}

  _render() {
    const p = this._panel; p.innerHTML = '';

    // Header
    const hdr = document.createElement('div');
    hdr.style.display = 'flex'; hdr.style.gap = '12px';
    hdr.style.padding = '12px 20px'; hdr.style.borderBottom = '1px solid var(--border)';
    hdr.style.alignItems = 'center'; hdr.style.flexShrink = '0';

    const title = document.createElement('h2'); title.textContent = 'Map';
    Object.assign(title.style, { margin: '0', color: 'var(--accent)', flex: '1' });

    const worldBtn = document.createElement('button');
    worldBtn.className = 'btn' + (this._view === 'world' ? ' btn-primary' : '');
    worldBtn.textContent = 'World Map';
    worldBtn.addEventListener('click', () => { this._view = 'world'; this._render(); });

    const localBtn = document.createElement('button');
    localBtn.className = 'btn' + (this._view === 'local' ? ' btn-primary' : '');
    localBtn.textContent = 'Local Map';
    localBtn.addEventListener('click', () => { this._view = 'local'; this._render(); });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn'; closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => this._close());

    hdr.appendChild(title); hdr.appendChild(worldBtn);
    hdr.appendChild(localBtn); hdr.appendChild(closeBtn);
    p.appendChild(hdr);

    const body = document.createElement('div');
    body.style.flex = '1'; body.style.position = 'relative'; body.style.overflow = 'hidden';
    p.appendChild(body);

    if (this._view === 'world') {
      this._renderWorldMap(body);
    } else {
      this._renderLocalMap(body);
    }
  }

  _renderWorldMap(container) {
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width  = container.clientWidth  || window.innerWidth;
    mapCanvas.height = container.clientHeight || window.innerHeight - 60;
    mapCanvas.style.display = 'block';
    container.appendChild(mapCanvas);

    const ctx2 = mapCanvas.getContext('2d');
    let bg = null;
    try { bg = AssetLoader.get('bg_world_map'); } catch (_) {}

    if (bg) {
      ctx2.drawImage(bg, 0, 0, mapCanvas.width, mapCanvas.height);
    } else {
      // Fallback parchment look
      ctx2.fillStyle = '#2a1e0a'; ctx2.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
      ctx2.fillStyle = '#3a2e14';
      for (let i = 0; i < 20; i++) {
        ctx2.fillRect(
          Math.sin(i * 73.1) * mapCanvas.width * 0.4 + mapCanvas.width * 0.5,
          Math.sin(i * 37.7) * mapCanvas.height * 0.4 + mapCanvas.height * 0.5,
          60 + (i * 23) % 80, 30 + (i * 17) % 40
        );
      }
    }

    // Area pins
    const areas = window.GameData?.areas || [];
    const discovered = this._playing.discovered || [];

    areas.forEach(area => {
      const isVisited = discovered.includes(area.id);
      const wx = (area.worldX || 0.5) * mapCanvas.width;
      const wy = (area.worldY || 0.5) * mapCanvas.height;

      ctx2.beginPath();
      ctx2.arc(wx, wy, 8, 0, Math.PI * 2);
      ctx2.fillStyle = isVisited ? '#c8960c' : '#3a3020';
      ctx2.fill();
      ctx2.strokeStyle = isVisited ? '#e8c050' : '#5a4a20';
      ctx2.lineWidth = 2; ctx2.stroke();

      ctx2.fillStyle = isVisited ? '#e8d5a0' : '#5a4a30';
      ctx2.font = '12px Georgia'; ctx2.textAlign = 'center';
      ctx2.fillText(area.name || area.id, wx, wy + 22);

      if (isVisited) {
        mapCanvas.addEventListener('click', e => {
          const r = mapCanvas.getBoundingClientRect();
          const cx = e.clientX - r.left, cy = e.clientY - r.top;
          if (Math.hypot(cx - wx, cy - wy) < 12) {
            this._travelTo(area.id);
          }
        });
      }
    });
  }

  _renderLocalMap(container) {
    const mc = document.createElement('canvas');
    mc.width = 300; mc.height = 300;
    Object.assign(mc.style, {
      display: 'block', margin: '20px auto',
      border: '2px solid var(--border)',
    });
    container.appendChild(mc);

    const ctx2 = mc.getContext('2d');
    const fow = this._playing.fogOfWar;

    if (fow) {
      // Render fog overlay as greyscale image
      const area = this._playing.area;
      const mw = area?.mapWidth || 64;
      const mh = area?.mapHeight || 64;
      const cellW = mc.width / mw, cellH = mc.height / mh;

      for (let ty = 0; ty < mh; ty++) {
        for (let tx = 0; tx < mw; tx++) {
          ctx2.fillStyle = fow.isRevealed(tx, ty) ? '#3a6a3a' : '#0a0a0a';
          ctx2.fillRect(tx * cellW, ty * cellH, cellW, cellH);
        }
      }
    } else {
      ctx2.fillStyle = '#0a0a0a'; ctx2.fillRect(0, 0, mc.width, mc.height);
    }

    // Party position dot
    const leader = this._playing.party?.[0];
    if (leader) {
      const area = this._playing.area;
      const mw = area?.mapWidth || 64;
      const mh = area?.mapHeight || 64;
      const cellW = mc.width / mw, cellH = mc.height / mh;
      const dx = leader.tileX * cellW, dy = leader.tileY * cellH;
      ctx2.beginPath(); ctx2.arc(dx, dy, 4, 0, Math.PI * 2);
      ctx2.fillStyle = '#00ff80'; ctx2.fill();
    }
  }

  async _travelTo(areaId) {
    const currentArea = this._playing.areaId;
    if (areaId === currentArea) { this._close(); return; }

    // Roll for encounter if distant (simple heuristic: always roll)
    const roll = Math.random();
    if (roll < 0.3) {
      const encounters = window.GameData?.encounters || [];
      const enc = encounters.find(e => e.areaId === 'travel' || e.type === 'travel');
      if (enc?.enemies?.length > 0) {
        const { CharacterFactory } = await import('../../engine/CharacterFactory.js');
        const enemies = enc.enemies.map(def => CharacterFactory.createEnemy ? CharacterFactory.createEnemy(def) : def);
        this._close();
        import('./CombatState.js').then(m => {
          this._playing.setSubState(new m.CombatState(this._playing, enemies));
        });
        return;
      }
    }
    this._playing.transitionArea(areaId, null);
    this._close();
  }

  _close() {
    this.exit();
    if (this._prev) {
      this._playing.setSubState(this._prev);
    } else {
      import('./ExplorationState.js').then(m => {
        this._playing.setSubState(new m.ExplorationState(this._playing));
      });
    }
  }
}
