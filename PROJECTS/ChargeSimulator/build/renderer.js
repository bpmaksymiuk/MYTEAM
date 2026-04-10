// renderer.js — DI-005
// Full canvas redraw each frame.

import { state } from './state.js';

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function render(ctx, W, H) {
  const { settings, particles, emitters, collectors, barriers } = state;
  const dark = settings.darkMode;

  // ── Clear ────────────────────────────────────────────────────────────────
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = dark ? '#080810' : '#e8edf2';
  ctx.fillRect(0, 0, W, H);

  // ── Field visualisation ──────────────────────────────────────────────────
  if (settings.fieldVis) {
    for (const em of emitters) {
      const grad = ctx.createRadialGradient(em.x, em.y, 0, em.x, em.y, 120);
      grad.addColorStop(0, 'rgba(80,120,255,0.22)');
      grad.addColorStop(1, 'rgba(80,120,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(em.x, em.y, 120, 0, Math.PI*2); ctx.fill();
    }
    for (const c of collectors) {
      const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 120);
      grad.addColorStop(0, 'rgba(255,100,60,0.22)');
      grad.addColorStop(1, 'rgba(255,100,60,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(c.x, c.y, 120, 0, Math.PI*2); ctx.fill();
    }
  }

  // ── Trails ───────────────────────────────────────────────────────────────
  if (settings.trails) {
    for (const p of particles) {
      if (p.trail.length < 2) continue;
      ctx.save();
      for (let i = 0; i < p.trail.length - 1; i++) {
        const alpha = (1 - i / p.trail.length) * 0.4;
        ctx.strokeStyle = `rgba(120,180,255,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.trail[i][0],   p.trail[i][1]);
        ctx.lineTo(p.trail[i+1][0], p.trail[i+1][1]);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ── Barriers ─────────────────────────────────────────────────────────────
  ctx.save();
  ctx.strokeStyle = dark ? '#8899cc' : '#556688';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const b of barriers) {
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    ctx.lineTo(b.x2, b.y2);
    ctx.stroke();
  }
  ctx.restore();

  // ── Particles ────────────────────────────────────────────────────────────
  ctx.save();
  for (const p of particles) {
    const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
    const hue   = lerp(200, 0, clamp(speed / 300, 0, 1));
    ctx.fillStyle = `hsl(${hue}, 90%, ${dark ? 65 : 50}%)`;
    if (dark) {
      ctx.shadowBlur  = 8;
      ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
    }

    // Trail dots
    if (settings.trails && p.trail.length > 0) {
      // already drawn above as lines
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
    ctx.fill();

    // Force vectors
    if (settings.forceVectors) {
      ctx.save();
      ctx.shadowBlur = 0;
      // lightweight force estimate (attraction only, for display)
      let fx = 0, fy = 0;
      for (const c of collectors) {
        const dx = c.x - p.x, dy = c.y - p.y;
        const dist2 = dx*dx + dy*dy;
        if (dist2 < 1) continue;
        const dist = Math.sqrt(dist2);
        const f = 8000 * c.strength * 5 / dist2;
        fx += f * dx / dist;
        fy += f * dy / dist;
      }
      const fmag = Math.sqrt(fx*fx + fy*fy);
      if (fmag > 0) {
        const arrowLen = clamp(fmag / 500, 2, 30);
        const nx = fx / fmag, ny = fy / fmag;
        const ex = p.x + nx * arrowLen, ey = p.y + ny * arrowLen;
        ctx.strokeStyle = 'rgba(255,220,0,0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ex, ey); ctx.stroke();
        // arrowhead
        const ax = -ny * 3, ay = nx * 3;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - nx*5 + ax, ey - ny*5 + ay);
        ctx.lineTo(ex - nx*5 - ax, ey - ny*5 - ay);
        ctx.closePath(); ctx.fillStyle = 'rgba(255,220,0,0.8)'; ctx.fill();
      }
      ctx.restore();
    }
  }
  ctx.shadowBlur = 0;
  ctx.restore();

  // ── Emitters ─────────────────────────────────────────────────────────────
  ctx.save();
  for (const em of emitters) {
    ctx.beginPath();
    ctx.arc(em.x, em.y, 14, 0, Math.PI*2);
    ctx.fillStyle = dark ? '#223366' : '#aabbdd';
    ctx.fill();
    ctx.strokeStyle = dark ? '#7799ff' : '#3355aa';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = dark ? '#aaccff' : '#112244';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('−', em.x, em.y);
  }
  ctx.restore();

  // ── Collectors ───────────────────────────────────────────────────────────
  ctx.save();
  for (const c of collectors) {
    if (dark) {
      ctx.shadowBlur  = 10 + c.absorbedCount * 0.5;
      ctx.shadowColor = 'rgba(255,120,40,0.8)';
    }
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2);
    ctx.fillStyle = dark ? '#332200' : '#ffddbb';
    ctx.fill();
    ctx.strokeStyle = dark ? '#ffaa44' : '#cc6600';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = dark ? '#ffcc88' : '#773300';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', c.x, c.y);
  }
  ctx.restore();
}
