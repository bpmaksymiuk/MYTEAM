// foodweb.js — DI-011
import { state } from './state.js';
import { SPECIES, getSpecies } from './species.js';
import { getPortrait } from './assets.js';

const TROPHIC_Y = { producer: 0.85, primary: 0.68, secondary: 0.48, apex: 0.22, decomposer: 0.92 };
let nodes = [];   // {id, x, y, r}
let edges = [];   // {from, to}
let inited = false;

export function initLayout(w = 800, h = 500) {
  // Place nodes by trophic; spread x by id index within trophic
  const byTrophic = {};
  for (const sp of SPECIES) (byTrophic[sp.trophic] ||= []).push(sp);
  nodes = [];
  for (const t of Object.keys(byTrophic)) {
    const list = byTrophic[t];
    const y = TROPHIC_Y[t] * h;
    list.forEach((sp, i) => {
      nodes.push({ id: sp.id, x: ((i + 1) / (list.length + 1)) * w, y, r: 10 });
    });
  }
  // Edges from .eats
  edges = [];
  for (const sp of SPECIES) for (const peatId of sp.eats) {
    edges.push({ from: peatId, to: sp.id });
  }
  // Brief relaxation: pull edges shorter, push same-row apart
  for (let iter = 0; iter < 40; iter++) {
    for (const n of nodes) { n.fx = 0; n.fy = 0; }
    for (let i = 0; i < nodes.length; i++) for (let j = i+1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      if (Math.abs(a.y - b.y) < 5) {
        const dx = b.x - a.x; const m = Math.abs(dx) || 0.1;
        const f = Math.min(2, 600 / (m*m));
        a.fx -= (dx/m) * f; b.fx += (dx/m) * f;
      }
    }
    for (const e of edges) {
      const a = nodeById(e.from), b = nodeById(e.to);
      if (!a || !b) continue;
      const dx = b.x - a.x; const m = Math.abs(dx) || 0.1;
      const f = Math.min(0.4, m * 0.005);
      a.fx += (dx/m) * f; b.fx -= (dx/m) * f;
    }
    for (const n of nodes) { n.x = Math.max(20, Math.min(w-20, n.x + n.fx)); }
  }
  inited = true;
}

function nodeById(id) { return nodes.find(n => n.id === id); }

export function renderGraph(ctx, w, h) {
  if (!inited) initLayout(w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#1a2620'; ctx.fillRect(0, 0, w, h);

  // Compute current populations and edge weights
  const popById = {}; for (const sp of SPECIES) popById[sp.id] = sp.isPlant ? (state.plantPatches[sp.id]?.length || 0) : (state.agents[sp.id]?.length || 0);
  const sel = state.ui.foodwebSelected;
  // Compute predation counts in last 600 ticks
  const cutoff = state.tick - 600;
  const counts = {};
  for (const r of state.events.predationLog) if (r.tick > cutoff) counts[r.predator+'<'+r.prey] = (counts[r.predator+'<'+r.prey]||0)+1;

  // Edges
  for (const e of edges) {
    const a = nodeById(e.from), b = nodeById(e.to); if (!a || !b) continue;
    const cnt = counts[e.to+'<'+e.from] || 0;
    const inChain = !sel || e.from === sel || e.to === sel;
    ctx.strokeStyle = inChain ? `rgba(255,211,74,${Math.min(0.9, 0.2 + cnt*0.05)})` : 'rgba(140,140,140,0.15)';
    ctx.lineWidth = inChain ? Math.max(1, Math.min(4, 1 + cnt*0.2)) : 1;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  // Nodes
  for (const n of nodes) {
    const sp = getSpecies(n.id); if (!sp) continue;
    const pop = popById[n.id] || 0;
    n.r = 8 + 0.5 * Math.sqrt(pop);
    const ratio = sp.baselineCount ? pop / sp.baselineCount : 1;
    const inChain = !sel || n.id === sel;
    ctx.globalAlpha = inChain ? 1 : 0.25;
    ctx.fillStyle = sp.color;
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2); ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = ratio < 0.1 ? '#cc3344' : (n.id === sel ? '#ffd34a' : '#cde3c4');
    ctx.stroke();
    // portrait
    const port = getPortrait(n.id);
    if (port) {
      const sz = Math.max(20, n.r * 1.6);
      ctx.drawImage(port, n.x - sz/2, n.y - sz/2, sz, sz);
    }
    // label
    ctx.fillStyle = '#cde3c4'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(sp.commonName, n.x, n.y - n.r - 4);
  }
  ctx.globalAlpha = 1;
}

export function nodeAt(x, y) {
  for (const n of nodes) {
    const dx = x - n.x, dy = y - n.y;
    if (dx*dx + dy*dy < (n.r + 4) * (n.r + 4)) return n.id;
  }
  return null;
}
