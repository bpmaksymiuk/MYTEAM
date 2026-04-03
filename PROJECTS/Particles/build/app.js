const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const toolRow = document.getElementById("tool-row");
const metrics = {
  tool: document.getElementById("m-tool"),
  charges: document.getElementById("m-charges"),
  plus: document.getElementById("m-plus"),
  minus: document.getElementById("m-minus"),
  barriers: document.getElementById("m-barriers"),
  fps: document.getElementById("m-fps")
};

const config = {
  speed: 1,
  strength: 950,
  positiveAttractMultiplier: 4,
  spawnRate: 18,
  damping: 0.88,
  particleCap: 900,
  captureRadius: 16,
  probeRadius: 10,
  eraseDistance: 14,
  dt: 1 / 60
};

const state = {
  tool: "probePlus",
  probes: [],
  barriers: [],
  particles: [],
  isDrawing: false,
  lastDrawPoint: null,
  fps: 0
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(600, Math.floor(rect.width));
  canvas.height = Math.max(420, Math.floor(rect.height));
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distancePointToSegment(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const abLenSq = abx * abx + aby * aby || 1;
  const t = clamp((apx * abx + apy * aby) / abLenSq, 0, 1);
  const cx = a.x + abx * t;
  const cy = a.y + aby * t;
  return Math.hypot(p.x - cx, p.y - cy);
}

function reflectVelocity(vx, vy, ax, ay, bx, by, damping) {
  const tx = bx - ax;
  const ty = by - ay;
  const len = Math.hypot(tx, ty) || 1;
  const nx = -ty / len;
  const ny = tx / len;
  const dot = vx * nx + vy * ny;
  const rvx = (vx - 2 * dot * nx) * damping;
  const rvy = (vy - 2 * dot * ny) * damping;
  return { x: rvx, y: rvy };
}

function setTool(tool) {
  state.tool = tool;
  metrics.tool.textContent = tool;
  toolRow.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tool === tool);
  });
}

toolRow.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-tool]");
  if (!btn) return;
  setTool(btn.dataset.tool);
});
setTool(state.tool);

function getPos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

canvas.addEventListener("pointerdown", (event) => {
  const p = getPos(event);

  if (state.tool === "probePlus") {
    state.probes.push({ x: p.x, y: p.y, polarity: +1, spawnAcc: 0 });
    return;
  }
  if (state.tool === "probeMinus") {
    state.probes.push({ x: p.x, y: p.y, polarity: -1, spawnAcc: 0 });
    return;
  }
  if (state.tool === "eraseBarrier") {
    state.barriers = state.barriers.filter(
      (seg) => distancePointToSegment(p, seg.a, seg.b) > config.eraseDistance
    );
    return;
  }
  if (state.tool === "drawBarrier") {
    state.isDrawing = true;
    state.lastDrawPoint = p;
    canvas.setPointerCapture(event.pointerId);
  }
});

canvas.addEventListener("pointermove", (event) => {
  if (!state.isDrawing || state.tool !== "drawBarrier") return;
  const p = getPos(event);
  const a = state.lastDrawPoint;
  const b = p;
  if (distance(a, b) > 4) {
    state.barriers.push({ a: { ...a }, b: { ...b } });
    state.lastDrawPoint = p;
  }
});

canvas.addEventListener("pointerup", () => {
  state.isDrawing = false;
  state.lastDrawPoint = null;
});

document.getElementById("clearAll").addEventListener("click", () => {
  state.probes = [];
  state.barriers = [];
  state.particles = [];
});

function bindRange(id, key, parse = Number) {
  const el = document.getElementById(id);
  config[key] = parse(el.value);
  el.addEventListener("input", () => {
    config[key] = parse(el.value);
  });
}

bindRange("speed", "speed");
bindRange("strength", "strength");
bindRange("spawnRate", "spawnRate");
bindRange("damping", "damping");
bindRange("particleCap", "particleCap", (v) => Math.floor(Number(v)));

function spawnParticles(dt) {
  const negProbes = state.probes.filter((p) => p.polarity < 0);
  const perSecond = config.spawnRate;
  const perProbePerFrame = perSecond * dt;

  for (const probe of negProbes) {
    probe.spawnAcc += perProbePerFrame;
    while (probe.spawnAcc >= 1 && state.particles.length < config.particleCap) {
      probe.spawnAcc -= 1;
      const angle = Math.random() * Math.PI * 2;
      const offset = 12 + Math.random() * 5;
      state.particles.push({
        x: probe.x + Math.cos(angle) * offset,
        y: probe.y + Math.sin(angle) * offset,
        vx: 0,
        vy: 0
      });
    }
  }
}

function applyForcesAndIntegrate(dt) {
  const k = config.strength;
  const minR = 8;

  for (let i = 0; i < state.particles.length; i++) {
    const p = state.particles[i];
    let ax = 0;
    let ay = 0;

    for (const probe of state.probes) {
      const dx = probe.x - p.x;
      const dy = probe.y - p.y;
      const r2 = Math.max(minR * minR, dx * dx + dy * dy);
      const r = Math.sqrt(r2);
      const forceScale = probe.polarity > 0 ? config.positiveAttractMultiplier : -1;
      const force = (k * forceScale) / r2;
      ax += (dx / r) * force;
      ay += (dy / r) * force;
    }

    for (let j = 0; j < state.particles.length; j++) {
      if (i === j) continue;
      const q = state.particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const r2 = Math.max(16, dx * dx + dy * dy);
      const r = Math.sqrt(r2);
      const repel = (k * 0.4) / r2;
      ax += (dx / r) * repel;
      ay += (dy / r) * repel;
    }

    const maxA = 3000;
    const amag = Math.hypot(ax, ay);
    if (amag > maxA) {
      const s = maxA / amag;
      ax *= s;
      ay *= s;
    }

    p.vx += ax * dt;
    p.vy += ay * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    p.x = clamp(p.x, 0, canvas.width);
    p.y = clamp(p.y, 0, canvas.height);
  }
}

function resolveBarrierCollisions() {
  for (const p of state.particles) {
    for (const seg of state.barriers) {
      const d = distancePointToSegment(p, seg.a, seg.b);
      if (d < 2.5) {
        const rv = reflectVelocity(p.vx, p.vy, seg.a.x, seg.a.y, seg.b.x, seg.b.y, config.damping);
        p.vx = rv.x;
        p.vy = rv.y;
        p.x += p.vx * 0.016;
        p.y += p.vy * 0.016;
      }
    }
  }
}

function annihilateAtPositiveProbes() {
  const positives = state.probes.filter((p) => p.polarity > 0);
  if (positives.length === 0) return;
  state.particles = state.particles.filter((particle) => {
    for (const probe of positives) {
      if (distance(particle, probe) <= config.captureRadius) return false;
    }
    return true;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(120, 233, 255, 0.75)";
  ctx.lineWidth = 2;
  for (const seg of state.barriers) {
    ctx.beginPath();
    ctx.moveTo(seg.a.x, seg.a.y);
    ctx.lineTo(seg.b.x, seg.b.y);
    ctx.stroke();
  }

  for (const probe of state.probes) {
    const positive = probe.polarity > 0;
    ctx.beginPath();
    ctx.fillStyle = positive ? "#ffcb5b" : "#74b6ff";
    ctx.shadowColor = positive ? "#ffcb5b" : "#74b6ff";
    ctx.shadowBlur = 12;
    ctx.arc(probe.x, probe.y, config.probeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#001425";
    ctx.font = "bold 14px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(positive ? "+" : "-", probe.x, probe.y + 0.5);
  }

  for (const particle of state.particles) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(73, 214, 255, 0.9)";
    ctx.shadowColor = "rgba(73, 214, 255, 0.9)";
    ctx.shadowBlur = 10;
    ctx.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function updateMetrics() {
  metrics.charges.textContent = String(state.particles.length);
  metrics.plus.textContent = String(state.probes.filter((p) => p.polarity > 0).length);
  metrics.minus.textContent = String(state.probes.filter((p) => p.polarity < 0).length);
  metrics.barriers.textContent = String(state.barriers.length);
  metrics.fps.textContent = String(Math.round(state.fps));
}

let last = performance.now();
let fpsAcc = 0;
let fpsFrames = 0;

function frame(now) {
  const rawDt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const dt = rawDt * config.speed;

  spawnParticles(dt);
  applyForcesAndIntegrate(dt);
  resolveBarrierCollisions();
  annihilateAtPositiveProbes();
  draw();

  fpsAcc += 1 / Math.max(rawDt, 0.0001);
  fpsFrames += 1;
  if (fpsFrames >= 12) {
    state.fps = fpsAcc / fpsFrames;
    fpsAcc = 0;
    fpsFrames = 0;
  }
  updateMetrics();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
