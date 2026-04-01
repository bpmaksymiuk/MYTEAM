(() => {
  const canvas = document.getElementById("sim-canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    alert("Canvas initialization failed.");
    return;
  }

  const DEFAULTS = {
    spawnPerSecond: 4,
    simSpeed: 1,
    forceStrength: 1,
    particleLifetime: 14,
    damping: 0.995,
    captureRadius: 16,
    showTrails: true
  };

  const state = {
    mode: "place",
    chargeType: "-",
    running: true,
    config: { ...DEFAULTS },
    charges: [],
    barriers: [],
    particles: [],
    spawnBuckets: new Map(),
    stats: {
      spawned: 0,
      annihilated: 0
    },
    dragStart: null,
    uid: 0,
    lastTs: performance.now()
  };

  const ui = {
    modePlace: document.getElementById("mode-place"),
    modeBarrier: document.getElementById("mode-barrier"),
    modeErase: document.getElementById("mode-erase"),
    chargeType: document.getElementById("charge-type"),
    spawnRate: document.getElementById("spawn-rate"),
    simSpeed: document.getElementById("sim-speed"),
    chargeStrength: document.getElementById("charge-strength"),
    lifetime: document.getElementById("particle-lifetime"),
    damping: document.getElementById("damping"),
    captureRadius: document.getElementById("capture-radius"),
    showTrails: document.getElementById("show-trails"),
    runToggle: document.getElementById("run-toggle"),
    resetDefaults: document.getElementById("reset-defaults"),
    clearScene: document.getElementById("clear-scene"),
    statusText: document.getElementById("status-text"),
    sourceCount: document.getElementById("source-count"),
    sinkCount: document.getElementById("sink-count"),
    activeCount: document.getElementById("active-count"),
    spawnedCount: document.getElementById("spawned-count"),
    annihilatedCount: document.getElementById("annihilated-count"),
    spawnRateValue: document.getElementById("spawn-rate-value"),
    simSpeedValue: document.getElementById("sim-speed-value"),
    chargeStrengthValue: document.getElementById("charge-strength-value"),
    lifetimeValue: document.getElementById("lifetime-value"),
    dampingValue: document.getElementById("damping-value"),
    captureRadiusValue: document.getElementById("capture-radius-value")
  };

  function nextId(prefix) {
    state.uid += 1;
    return `${prefix}-${state.uid}`;
  }

  function setMode(mode) {
    state.mode = mode;
    ui.modePlace.classList.toggle("active", mode === "place");
    ui.modeBarrier.classList.toggle("active", mode === "barrier");
    ui.modeErase.classList.toggle("active", mode === "erase");
    updateStatus();
  }

  function updateConfigLabels() {
    ui.spawnRateValue.textContent = `${state.config.spawnPerSecond.toFixed(1)}/s`;
    ui.simSpeedValue.textContent = `${state.config.simSpeed.toFixed(1)}x`;
    ui.chargeStrengthValue.textContent = `${state.config.forceStrength.toFixed(1)}x`;
    ui.lifetimeValue.textContent = `${state.config.particleLifetime.toFixed(1)}s`;
    ui.dampingValue.textContent = state.config.damping.toFixed(3);
    ui.captureRadiusValue.textContent = `${Math.round(state.config.captureRadius)}px`;
  }

  function updateStatus() {
    const srcCount = state.charges.filter((c) => c.polarity === -1).length;
    const sinkCount = state.charges.filter((c) => c.polarity === 1).length;
    ui.sourceCount.textContent = String(srcCount);
    ui.sinkCount.textContent = String(sinkCount);
    ui.activeCount.textContent = String(state.particles.length);
    ui.spawnedCount.textContent = String(state.stats.spawned);
    ui.annihilatedCount.textContent = String(state.stats.annihilated);

    if (!state.running) {
      ui.statusText.textContent = `Paused (${state.mode} mode)`;
    } else if (srcCount === 0) {
      ui.statusText.textContent = `Running (${state.mode} mode) - add a negative source to spawn particles`;
    } else {
      ui.statusText.textContent = `Running (${state.mode} mode)`;
    }
  }

  function canvasPoint(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((evt.clientY - rect.top) * canvas.height) / rect.height;
    return { x, y };
  }

  function placeCharge(x, y) {
    const margin = 14;
    if (x < margin || x > canvas.width - margin || y < margin || y > canvas.height - margin) {
      return;
    }

    const isPositive = state.chargeType === "+";
    state.charges.push({
      id: nextId("charge"),
      x,
      y,
      polarity: isPositive ? 1 : -1,
      role: isPositive ? "sink" : "source"
    });
    updateStatus();
  }

  function drawBarrier(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);
    if (len < 8) {
      return;
    }
    state.barriers.push({
      id: nextId("barrier"),
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    });
  }

  function eraseNearestBarrier(x, y) {
    let minIdx = -1;
    let minDist = Infinity;
    for (let i = 0; i < state.barriers.length; i += 1) {
      const seg = state.barriers[i];
      const d = pointToSegmentDistance(x, y, seg);
      if (d < minDist) {
        minDist = d;
        minIdx = i;
      }
    }
    if (minIdx >= 0 && minDist < 16) {
      state.barriers.splice(minIdx, 1);
    }
  }

  function pointToSegmentDistance(px, py, seg) {
    const vx = seg.x2 - seg.x1;
    const vy = seg.y2 - seg.y1;
    const wx = px - seg.x1;
    const wy = py - seg.y1;
    const c1 = vx * wx + vy * wy;
    if (c1 <= 0) {
      return Math.hypot(px - seg.x1, py - seg.y1);
    }
    const c2 = vx * vx + vy * vy;
    if (c2 <= c1) {
      return Math.hypot(px - seg.x2, py - seg.y2);
    }
    const b = c1 / c2;
    const bx = seg.x1 + b * vx;
    const by = seg.y1 + b * vy;
    return Math.hypot(px - bx, py - by);
  }

  function emitParticle(source) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 36;
    const jitter = 5;
    state.particles.push({
      id: nextId("p"),
      x: source.x + Math.cos(angle) * 10,
      y: source.y + Math.sin(angle) * 10,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * jitter,
      vy: Math.sin(angle) * speed + (Math.random() - 0.5) * jitter,
      age: 0
    });
    state.stats.spawned += 1;
  }

  function spawnStep(dt) {
    if (!state.running) {
      return;
    }
    const sources = state.charges.filter((c) => c.polarity === -1);
    const interval = 1 / Math.max(0.1, state.config.spawnPerSecond);

    for (const source of sources) {
      const prev = state.spawnBuckets.get(source.id) || 0;
      let acc = prev + dt;
      while (acc >= interval && state.particles.length < 900) {
        emitParticle(source);
        acc -= interval;
      }
      state.spawnBuckets.set(source.id, acc);
    }

    const sourceIds = new Set(sources.map((s) => s.id));
    for (const key of state.spawnBuckets.keys()) {
      if (!sourceIds.has(key)) {
        state.spawnBuckets.delete(key);
      }
    }
  }

  function simulateStep(dtRaw) {
    if (!state.running) {
      return;
    }
    const dt = Math.min(dtRaw, 0.033) * state.config.simSpeed;
    const eps = 24;
    const k = 2400 * state.config.forceStrength;
    const repel = 1800 * state.config.forceStrength;

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      let ax = 0;
      let ay = 0;

      for (const c of state.charges) {
        const dx = c.x - p.x;
        const dy = c.y - p.y;
        const distSq = dx * dx + dy * dy + eps;
        const dist = Math.sqrt(distSq);
        const ux = dx / dist;
        const uy = dy / dist;

        const direction = c.polarity === 1 ? 1 : -1;
        const mag = (k / distSq) * direction;
        ax += ux * mag;
        ay += uy * mag;
      }

      for (let j = 0; j < state.particles.length; j += 1) {
        if (i === j) {
          continue;
        }
        const o = state.particles[j];
        const dx = p.x - o.x;
        const dy = p.y - o.y;
        const distSq = dx * dx + dy * dy + eps;
        const dist = Math.sqrt(distSq);
        const ux = dx / dist;
        const uy = dy / dist;
        const mag = repel / distSq;
        ax += ux * mag;
        ay += uy * mag;
      }

      const maxAccel = 1400;
      const accel = Math.hypot(ax, ay);
      if (accel > maxAccel) {
        const s = maxAccel / accel;
        ax *= s;
        ay *= s;
      }

      p.vx += ax * dt;
      p.vy += ay * dt;
      p.vx *= state.config.damping;
      p.vy *= state.config.damping;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.age += dt;

      bounceCanvas(p);
      bounceBarriers(p);

      if (p.age > state.config.particleLifetime) {
        state.particles.splice(i, 1);
        continue;
      }

      if (isCaptured(p)) {
        state.particles.splice(i, 1);
        state.stats.annihilated += 1;
      }
    }
  }

  function isCaptured(p) {
    const r = state.config.captureRadius;
    for (const c of state.charges) {
      if (c.polarity !== 1) {
        continue;
      }
      const dx = p.x - c.x;
      const dy = p.y - c.y;
      if (dx * dx + dy * dy <= r * r) {
        return true;
      }
    }
    return false;
  }

  function bounceCanvas(p) {
    const margin = 2;
    if (p.x < margin) {
      p.x = margin;
      p.vx = Math.abs(p.vx) * 0.9;
    }
    if (p.x > canvas.width - margin) {
      p.x = canvas.width - margin;
      p.vx = -Math.abs(p.vx) * 0.9;
    }
    if (p.y < margin) {
      p.y = margin;
      p.vy = Math.abs(p.vy) * 0.9;
    }
    if (p.y > canvas.height - margin) {
      p.y = canvas.height - margin;
      p.vy = -Math.abs(p.vy) * 0.9;
    }
  }

  function bounceBarriers(p) {
    for (const seg of state.barriers) {
      const dist = pointToSegmentDistance(p.x, p.y, seg);
      if (dist > 5) {
        continue;
      }

      const vx = seg.x2 - seg.x1;
      const vy = seg.y2 - seg.y1;
      const len = Math.hypot(vx, vy);
      if (len < 1e-5) {
        continue;
      }

      let nx = -vy / len;
      let ny = vx / len;
      let dot = p.vx * nx + p.vy * ny;

      // Make barrier collisions two-sided by orienting normal against motion.
      if (dot > 0) {
        nx = -nx;
        ny = -ny;
        dot = p.vx * nx + p.vy * ny;
      }

      if (dot >= -1e-6) {
        continue;
      }

      p.vx = p.vx - 2 * dot * nx;
      p.vy = p.vy - 2 * dot * ny;
      p.vx *= 0.9;
      p.vy *= 0.9;
      p.x += nx * 2;
      p.y += ny * 2;
    }
  }

  function renderBackground() {
    if (state.config.showTrails) {
      ctx.fillStyle = "rgba(6, 14, 25, 0.20)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(canvas.width * 0.72, 120, 100, canvas.width * 0.5, canvas.height * 0.6, canvas.height);
      grad.addColorStop(0, "#0f2d46");
      grad.addColorStop(0.55, "#0a1826");
      grad.addColorStop(1, "#050a10");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function renderBarriers() {
    ctx.save();
    ctx.strokeStyle = "#f4b860";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (const b of state.barriers) {
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
    }
    if (state.mode === "barrier" && state.dragStart && state.dragStart.current) {
      ctx.strokeStyle = "rgba(244, 184, 96, 0.55)";
      ctx.beginPath();
      ctx.moveTo(state.dragStart.x, state.dragStart.y);
      ctx.lineTo(state.dragStart.current.x, state.dragStart.current.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderCharges() {
    for (const c of state.charges) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = c.polarity === 1 ? "#7de0ff" : "#ff6b6b";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.fillStyle = "#0a1118";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.polarity === 1 ? "+" : "-", c.x, c.y + 0.5);
    }
  }

  function renderParticles() {
    for (const p of state.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(240, 248, 255, 0.9)";
      ctx.fill();
    }
  }

  function frame(ts) {
    const dt = (ts - state.lastTs) / 1000;
    state.lastTs = ts;

    spawnStep(dt);
    simulateStep(dt);

    renderBackground();
    renderBarriers();
    renderParticles();
    renderCharges();
    updateStatus();

    requestAnimationFrame(frame);
  }

  function applyDefaults() {
    state.config = { ...DEFAULTS };
    ui.spawnRate.value = String(DEFAULTS.spawnPerSecond);
    ui.simSpeed.value = String(DEFAULTS.simSpeed);
    ui.chargeStrength.value = String(DEFAULTS.forceStrength);
    ui.lifetime.value = String(DEFAULTS.particleLifetime);
    ui.damping.value = String(DEFAULTS.damping);
    ui.captureRadius.value = String(DEFAULTS.captureRadius);
    ui.showTrails.checked = DEFAULTS.showTrails;
    updateConfigLabels();
  }

  function bindEvents() {
    ui.modePlace.addEventListener("click", () => setMode("place"));
    ui.modeBarrier.addEventListener("click", () => setMode("barrier"));
    ui.modeErase.addEventListener("click", () => setMode("erase"));
    ui.chargeType.addEventListener("change", (e) => {
      state.chargeType = e.target.value;
    });

    ui.spawnRate.addEventListener("input", (e) => {
      state.config.spawnPerSecond = Number(e.target.value);
      updateConfigLabels();
    });
    ui.simSpeed.addEventListener("input", (e) => {
      state.config.simSpeed = Number(e.target.value);
      updateConfigLabels();
    });
    ui.chargeStrength.addEventListener("input", (e) => {
      state.config.forceStrength = Number(e.target.value);
      updateConfigLabels();
    });
    ui.lifetime.addEventListener("input", (e) => {
      state.config.particleLifetime = Number(e.target.value);
      updateConfigLabels();
    });
    ui.damping.addEventListener("input", (e) => {
      state.config.damping = Number(e.target.value);
      updateConfigLabels();
    });
    ui.captureRadius.addEventListener("input", (e) => {
      state.config.captureRadius = Number(e.target.value);
      updateConfigLabels();
    });
    ui.showTrails.addEventListener("change", (e) => {
      state.config.showTrails = Boolean(e.target.checked);
      updateConfigLabels();
    });

    ui.runToggle.addEventListener("click", () => {
      state.running = !state.running;
      ui.runToggle.textContent = state.running ? "Pause" : "Run";
      updateStatus();
    });

    ui.resetDefaults.addEventListener("click", () => {
      applyDefaults();
    });

    ui.clearScene.addEventListener("click", () => {
      state.charges = [];
      state.barriers = [];
      state.particles = [];
      state.spawnBuckets.clear();
      state.stats.spawned = 0;
      state.stats.annihilated = 0;
      updateStatus();
    });

    canvas.addEventListener("pointerdown", (e) => {
      const p = canvasPoint(e);
      if (state.mode === "place") {
        placeCharge(p.x, p.y);
      } else if (state.mode === "erase") {
        eraseNearestBarrier(p.x, p.y);
      } else if (state.mode === "barrier") {
        state.dragStart = { ...p, current: { ...p } };
      }
    });

    canvas.addEventListener("pointermove", (e) => {
      if (state.mode === "barrier" && state.dragStart) {
        state.dragStart.current = canvasPoint(e);
      }
      if (state.mode === "erase" && (e.buttons & 1) === 1) {
        const p = canvasPoint(e);
        eraseNearestBarrier(p.x, p.y);
      }
    });

    canvas.addEventListener("pointerup", (e) => {
      if (state.mode === "barrier" && state.dragStart) {
        const end = canvasPoint(e);
        drawBarrier(state.dragStart, end);
        state.dragStart = null;
      }
    });

    canvas.addEventListener("pointerleave", () => {
      if (state.mode === "barrier") {
        state.dragStart = null;
      }
    });
  }

  applyDefaults();
  bindEvents();
  setMode("place");
  renderBackground();
  requestAnimationFrame(frame);
})();
