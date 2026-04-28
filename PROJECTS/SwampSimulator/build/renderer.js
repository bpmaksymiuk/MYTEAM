// renderer.js — canvas drawing (DI-010, DI-034)
import { state } from './state.js';
import { SPECIES, getSpecies } from './species.js';
import { buildGrid, nearby } from './grid.js';
import { getSprite, getPortrait } from './assets.js';
import { buildTerrainImageData } from './terrain.js';
import { renderParticles, tickParticles } from './particles.js';
import { SPRITE_MANIFEST } from './sprites/manifest.js';

// Time-of-day tint presets
const TOD_TINT = {
  dawn:  'rgba(255,160,60,0.18)',
  noon:  null,
  dusk:  'rgba(220,100,30,0.22)',
  night: 'rgba(10,15,40,0.45)',
};

let terrainCanvas = null, terrainCtx = null, terrainDirty = true;

function getOrBuildTerrainCanvas(w, h) {
  if (!terrainCanvas) {
    terrainCanvas = document.createElement('canvas');
    terrainCanvas.width = w; terrainCanvas.height = h;
    terrainCtx = terrainCanvas.getContext('2d');
  }
  if (state.terrain.biomeMap && (terrainDirty || state.terrain.dirty)) {
    const imgData = buildTerrainImageData(state.terrain.biomeMap, w, h);
    terrainCtx.putImageData(imgData, 0, 0);
    state.terrain.dirty = false;
    terrainDirty = false;
  }
  return terrainCanvas;
}

let bg = null, bgCtx = null, bgSeason = null;

function paintBackground(w, h) {
  if (!bg) { bg = document.createElement('canvas'); bgCtx = bg.getContext('2d'); }
  bg.width = w; bg.height = h;
  const g = bgCtx;
  // water gradient
  const grad = g.createRadialGradient(w/2, h*0.55, 30, w/2, h*0.55, Math.max(w,h)*0.7);
  grad.addColorStop(0, '#5a7d7d'); grad.addColorStop(1, '#2a3838');
  g.fillStyle = grad; g.fillRect(0, 0, w, h);
  // mud banks
  g.fillStyle = '#5a4a30';
  g.beginPath(); g.moveTo(0, h*0.92);
  for (let x = 0; x <= w; x += 40) g.lineTo(x, h*0.92 + Math.sin(x*0.05)*8);
  g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(0, h*0.08);
  for (let x = 0; x <= w; x += 40) g.lineTo(x, h*0.08 + Math.sin(x*0.05)*8);
  g.lineTo(w, 0); g.lineTo(0, 0); g.closePath(); g.fill();
  // cypress silhouettes
  g.fillStyle = bgSeason === 'winter' ? '#2a3a25' : '#2a4222';
  for (const cy of [{x: w*0.1, y: h*0.2}, {x: w*0.9, y: h*0.18}, {x: w*0.22, y: h*0.85}, {x: w*0.78, y: h*0.83}]) {
    g.beginPath(); g.ellipse(cy.x, cy.y, 22, 30, 0, 0, Math.PI*2); g.fill();
    g.fillRect(cy.x-3, cy.y+12, 6, 28);
  }
  bgSeason = state.environment.season;
}

export function render(ctx, w, h) {
  // 1. Sky-bg layer (or old procedural bg if no terrain)
  if (state.terrain.biomeMap) {
    // sky strip at top
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h*0.15);
    skyGrad.addColorStop(0, '#6ec6d0'); skyGrad.addColorStop(1, '#2a7a8e');
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, w, h*0.15);
    // terrain layer
    const tc = getOrBuildTerrainCanvas(w, h);
    ctx.drawImage(tc, 0, 0);
  } else {
    if (!bg || bg.width !== w || bg.height !== h || bgSeason !== state.environment.season) paintBackground(w, h);
    ctx.drawImage(bg, 0, 0);
  }

  // 2. Gator holes
  if (state.gatorHoles.length) {
    ctx.fillStyle = '#5a7d7d';
    for (const h_ of state.gatorHoles) { ctx.beginPath(); ctx.arc(h_.x, h_.y, h_.r, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = '#cde3c4'; ctx.lineWidth = 1;
    for (const h_ of state.gatorHoles) { ctx.beginPath(); ctx.arc(h_.x, h_.y, h_.r, 0, Math.PI*2); ctx.stroke(); }
  }

  // 3. Dams
  for (const dam of state.dams) {
    if (dam.breachTimer > 0) continue;
    const hw = (dam.width * dam.progress) / 2;
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(dam.x - hw, dam.y - 6, hw*2, 12);
    // log segments
    ctx.fillStyle = '#3d2210';
    for (let lx = dam.x - hw; lx < dam.x + hw; lx += 14) {
      ctx.fillRect(lx, dam.y - 5, 10, 10);
    }
    // health bar
    ctx.fillStyle = `hsl(${dam.health*120},80%,45%)`;
    ctx.fillRect(dam.x - 20, dam.y - 14, 40 * dam.health, 4);
  }

  // 4. Plant patches — sprite-sheet or fallback
  for (const sp of SPECIES) if (sp.isPlant) {
    const arr = state.plantPatches[sp.id]; if (!arr) continue;
    const plantKey = `plant-${sp.id}`;
    const sheet = getSprite(plantKey) || getSprite(sp.id);
    const season = state.environment.season;
    const isWinter = season === 'winter';
    for (const p of arr) {
      ctx.globalAlpha = Math.max(0.15, Math.min(0.9, p.density * 0.6));
      if (sheet) {
        const meta = sheet.meta;
        const stKey = isWinter && meta.states['seasonal-winter'] ? 'seasonal-winter' : 'idle';
        const stateMeta = meta.states[stKey] || meta.states.idle;
        if (!stateMeta) { ctx.beginPath(); ctx.arc(p.x, p.y, sp.radius+4, 0, Math.PI*2); ctx.fillStyle = sp.color; ctx.fill(); continue; }
        p.phase = (p.phase || 0) + 0.016;
        const frame = Math.floor(p.phase * stateMeta.fps) % stateMeta.frames;
        const sx = frame * meta.frameW, sy = stateMeta.row * meta.frameH;
        const scale = Math.max(0.4, (sp.radius || 6) / 14);
        const dw = meta.frameW * scale, dh = meta.frameH * scale;
        ctx.drawImage(sheet.img, sx, sy, meta.frameW, meta.frameH, p.x - dw/2, p.y - dh/2, dw, dh);
      } else {
        ctx.fillStyle = sp.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, sp.radius + 4, 0, Math.PI*2); ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;

  // 5. Agents
  for (const sp of SPECIES) if (!sp.isPlant) {
    const arr = state.agents[sp.id]; if (!arr) continue;
    const sheet = getSprite(sp.id);
    if (sheet) {
      const meta = sheet.meta;
      for (const a of arr) {
        if (a.x < -64 || a.x > w + 64 || a.y < -64 || a.y > h + 64) continue;
        const anim = a.anim || { state: 'idle', frame: 0, facing: 'R' };
        const animState = anim.forcedState || anim.state;
        const stateMeta = meta.states[animState] || meta.states.idle;
        const sx = (anim.frame|0) * meta.frameW;
        const sy = stateMeta.row * meta.frameH;
        const scale = Math.max(0.5, (sp.radius || 6) / 10);
        const dw = meta.frameW * scale, dh = meta.frameH * scale;
        ctx.save();
        ctx.translate(a.x, a.y);
        if (anim.facing === 'L') ctx.scale(-1, 1);
        ctx.drawImage(sheet.img, sx, sy, meta.frameW, meta.frameH, -dw/2, -dh/2, dw, dh);
        ctx.restore();
      }
    } else {
      ctx.fillStyle = sp.color;
      for (const a of arr) { ctx.beginPath(); ctx.arc(a.x, a.y, sp.radius, 0, Math.PI*2); ctx.fill(); }
    }
  }

  // 6. Particle layer
  renderParticles(ctx);

  // 7. Overlays
  if (state.settings.overlays.foodweb) drawFoodWebOverlay(ctx);
  if (state.settings.overlays.nutrient) drawNutrientOverlay(ctx, w, h);
  if (state.settings.overlays.oxygen) drawOxygenOverlay(ctx, w, h);
  if (state.settings.overlays.density) drawDensityOverlay(ctx, w, h);

  // 8. Time-of-day tint (environmental + atmosphere)
  const tint = sceneTint();
  if (tint) { ctx.fillStyle = tint; ctx.fillRect(0, 0, w, h); }
  const tod = state.environment.timeOfDay;
  if (tod && TOD_TINT[tod]) { ctx.fillStyle = TOD_TINT[tod]; ctx.fillRect(0, 0, w, h); }
}

function sceneTint() {
  const ev = state.events.active;
  if (ev.fire) return 'rgba(220,80,30,0.10)';
  if (ev.pollution) return 'rgba(40,55,30,0.18)';
  if (ev.drought) return 'rgba(180,140,60,0.12)';
  if (ev.flood) return 'rgba(70,110,180,0.12)';
  if (ev.coldsnap) return 'rgba(170,210,240,0.10)';
  return null;
}

function drawFoodWebOverlay(ctx) {
  const animals = []; for (const sp of SPECIES) if (!sp.isPlant) { const a = state.agents[sp.id]; if (a) animals.push(...a); }
  const grid = buildGrid(animals, state.settings.gridCellSize, state.canvas.w, state.canvas.h);
  ctx.strokeStyle = 'rgba(255,211,74,0.6)'; ctx.lineWidth = 1;
  for (const a of animals) {
    const sp = getSpecies(a.species);
    const cells = nearby(grid, a.x, a.y, state.settings.foodWebRadius);
    let prey = null, dPrey = Infinity;
    for (const o of cells) {
      if (o.id === a.id) continue;
      if (sp.eats.includes(o.species)) {
        const dx = o.x - a.x, dy = o.y - a.y; const d2 = dx*dx + dy*dy;
        if (d2 < dPrey) { dPrey = d2; prey = o; }
      }
    }
    if (prey && Math.sqrt(dPrey) < state.settings.foodWebRadius) {
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(prey.x, prey.y); ctx.stroke();
    }
  }
}

function drawNutrientOverlay(ctx, w, h) {
  ctx.fillStyle = `rgba(120,180,60,${Math.min(0.5, state.environment.nutrient * 0.18)})`;
  ctx.fillRect(0, 0, w, h);
}
function drawOxygenOverlay(ctx, w, h) {
  const o = state.environment.oxygen;
  ctx.fillStyle = `rgba(${Math.round(220*(1-o))},${Math.round(80*o)},${Math.round(80*o)},0.25)`;
  ctx.fillRect(0, 0, w, h);
}
function drawDensityOverlay(ctx, w, h) {
  const cs = 32, cols = Math.ceil(w/cs), rows = Math.ceil(h/cs);
  const grid = new Int32Array(cols*rows);
  for (const sp of SPECIES) if (!sp.isPlant) {
    const arr = state.agents[sp.id]; if (!arr) continue;
    for (const a of arr) {
      const c = Math.floor(a.x/cs), r = Math.floor(a.y/cs);
      if (c>=0&&r>=0&&c<cols&&r<rows) grid[r*cols+c]++;
    }
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const n = grid[r*cols+c]; if (!n) continue;
    ctx.fillStyle = `rgba(255,80,80,${Math.min(0.5, n*0.04)})`;
    ctx.fillRect(c*cs, r*cs, cs, cs);
  }
}
