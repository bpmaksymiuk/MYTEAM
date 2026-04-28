// particles.js — DI-032, AR-021
const MAX = 1200;
const pool = [];
export const PM_REDUCED = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

function spawn(p) { if (PM_REDUCED || pool.length >= MAX) return; pool.push(p); }

export function emitRipple(x, y) {
  for (let i=0; i<3; i++) {
    const a = Math.random()*Math.PI*2, sp = 12+Math.random()*8;
    spawn({x,y,vx:Math.cos(a)*sp, vy:Math.sin(a)*sp*0.4,
           life:0.8,maxLife:0.8, type:'ripple', color:'rgba(150,220,220,0.5)', radius:3});
  }
}
export function emitSplash(x, y) {
  for (let i=0; i<8; i++) {
    const a = Math.random()*Math.PI*2, sp = 20+Math.random()*30;
    spawn({x,y,vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-40,
           life:0.5,maxLife:0.5, type:'splash', color:'#cdeeff', radius:4});
  }
}
export function emitBlink(x, y, color='#ffffaa') {
  spawn({x,y,vx:0,vy:0, life:0.6,maxLife:0.6, type:'blink', color, radius:6});
}
export function emitRain() {
  for (let i=0; i<4; i++) {
    spawn({x:Math.random()*1280, y:0, vx:6, vy:200+Math.random()*80,
           life:0.4,maxLife:0.4, type:'rain', color:'rgba(180,220,255,0.5)', radius:1});
  }
}
export function emitConfetti() {
  const COLS = ['#ffd34a','#2f6b3a','#c8a46e','#cde3c4','#e06040'];
  for (let i=0; i<60; i++) {
    spawn({x:Math.random()*1280, y:Math.random()*200,
           vx:(Math.random()-0.5)*80, vy:30+Math.random()*60,
           life:2.5,maxLife:2.5, type:'confetti',
           color:COLS[i%COLS.length], radius:4});
  }
}

export function tickParticles(dt) {
  for (let i=pool.length-1; i>=0; i--) {
    const p = pool[i];
    p.x += p.vx*dt; p.y += p.vy*dt; p.life -= dt;
    if (p.life <= 0) pool.splice(i,1);
  }
}

export function renderParticles(ctx) {
  for (const p of pool) {
    const alpha = p.life/p.maxLife;
    ctx.globalAlpha = alpha*0.85;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    if (p.type === 'confetti') {
      ctx.rect(p.x-p.radius, p.y-p.radius, p.radius*2, p.radius);
    } else {
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    }
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
