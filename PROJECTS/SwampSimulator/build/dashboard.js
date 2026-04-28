// dashboard.js — DI-012 (raw canvas charts; no external Chart.js dependency)
import { state } from './state.js';
import { SPECIES, getSpecies } from './species.js';

const buffers = {};   // speciesId -> Array<{day, n}>
let lastSampleDay = -1;

export function mountDashboard() {
  const alertPanel = document.getElementById('alert-panel');
  if (alertPanel && !alertPanel.dataset.mounted) alertPanel.dataset.mounted = '1';
}

export function updateDashboard() {
  const day = Math.floor(state.environment.dayOfYear);
  if (day !== lastSampleDay) {
    lastSampleDay = day;
    for (const sp of SPECIES) if (!sp.isPlant) {
      const buf = buffers[sp.id] ||= [];
      buf.push({ day, n: state.agents[sp.id]?.length || 0 });
      if (buf.length > 720) buf.splice(0, buf.length - 720);
    }
  }
  drawLineChart();
  drawBiomassChart();
  renderAlerts();
}

function drawLineChart() {
  const c = document.getElementById('chart-population'); if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width = c.clientWidth || 600, h = c.height = c.clientHeight || 240;
  ctx.fillStyle = '#1a2620'; ctx.fillRect(0,0,w,h);
  // axes
  ctx.strokeStyle = '#3a4a40'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(36, 8); ctx.lineTo(36, h-22); ctx.lineTo(w-8, h-22); ctx.stroke();
  ctx.fillStyle = '#cde3c4'; ctx.font = '10px sans-serif';
  ctx.fillText('Day', w-26, h-6); ctx.save(); ctx.translate(10, 24); ctx.rotate(-Math.PI/2); ctx.fillText('Population', -40, 0); ctx.restore();

  let maxN = 1, minD = Infinity, maxD = -Infinity;
  for (const sp of SPECIES) if (!sp.isPlant) {
    const buf = buffers[sp.id]; if (!buf || !buf.length) continue;
    for (const p of buf) { if (p.n > maxN) maxN = p.n; if (p.day < minD) minD = p.day; if (p.day > maxD) maxD = p.day; }
  }
  if (maxD <= minD) maxD = minD + 1;
  const px = d => 36 + ((d - minD) / (maxD - minD)) * (w - 44);
  const py = n => h - 22 - (n / maxN) * (h - 30);

  for (const sp of SPECIES) if (!sp.isPlant) {
    const buf = buffers[sp.id]; if (!buf || buf.length < 2) continue;
    ctx.strokeStyle = sp.color; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i < buf.length; i++) { const p = buf[i]; if (i === 0) ctx.moveTo(px(p.day), py(p.n)); else ctx.lineTo(px(p.day), py(p.n)); }
    ctx.stroke();
  }
  ctx.fillStyle = '#cde3c4'; ctx.fillText(`max ${maxN}`, 40, 16);
  ctx.fillText(`day ${maxD}`, w-50, h-26);
}

function drawBiomassChart() {
  const c = document.getElementById('chart-biomass'); if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width = c.clientWidth || 600, h = c.height = c.clientHeight || 200;
  ctx.fillStyle = '#1a2620'; ctx.fillRect(0,0,w,h);
  const levels = ['producer','primary','secondary','apex','decomposer'];
  const totals = {};
  for (const lv of levels) {
    let m = 0;
    for (const sp of SPECIES) if (sp.trophic === lv) {
      const n = sp.isPlant ? (state.plantPatches[sp.id]?.length || 0) : (state.agents[sp.id]?.length || 0);
      m += n * sp.radius * sp.radius;
    }
    totals[lv] = m;
  }
  const max = Math.max(1, ...Object.values(totals));
  const bw = (w - 60) / levels.length;
  ctx.fillStyle = '#cde3c4'; ctx.font = '11px sans-serif';
  ctx.fillText('Biomass by trophic level', 8, 14);
  levels.forEach((lv, i) => {
    const v = totals[lv]; const bh = (v / max) * (h - 50);
    ctx.fillStyle = ({producer:'#6fa84a', primary:'#aa8866', secondary:'#cc6633', apex:'#3a3340', decomposer:'#806040'})[lv];
    ctx.fillRect(40 + i*bw + 8, h - 24 - bh, bw - 16, bh);
    ctx.fillStyle = '#cde3c4'; ctx.textAlign = 'center'; ctx.fillText(lv, 40 + i*bw + bw/2, h - 8);
  });
  ctx.textAlign = 'left';
}

function renderAlerts() {
  const el = document.getElementById('alert-panel'); if (!el) return;
  const last = state.events.log.slice(-30).reverse();
  el.innerHTML = '<h3>Alerts</h3>' + last.map(e => {
    const cls = e.kind === 'extinction' ? 'alert-extinction' : (e.kind === 'warn' ? 'alert-warn' : 'alert-event');
    return `<div class="alert-row ${cls}"><span class="day">d${e.day}</span> ${escapeHtml(e.text)}</div>`;
  }).join('');
}
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
