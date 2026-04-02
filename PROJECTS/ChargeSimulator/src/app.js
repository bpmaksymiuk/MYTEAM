const canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");

const DEFAULTS = {
  mode: "place-negative",
  spawnRate: 12,
  simSpeed: 1,
  chargeStrength: 1.2,
  damping: 0.985,
  captureRadius: 16,
  imageThreshold: 120,
  trails: true
};

const state = {
  mode: DEFAULTS.mode,
  running: false,
  charges: [],
  barriers: [],
  particles: [],
  annihilated: 0,
  spawnAccumulator: 0,
  spawnRate: DEFAULTS.spawnRate,
  simSpeed: DEFAULTS.simSpeed,
  chargeStrength: DEFAULTS.chargeStrength,
  damping: DEFAULTS.damping,
  captureRadius: DEFAULTS.captureRadius,
  imageThreshold: DEFAULTS.imageThreshold,
  trails: DEFAULTS.trails,
  backgroundImage: null,
  backgroundDataUrl: null,
  obstacleMask: null,
  drawStart: null
};

const messageEl = document.getElementById("message");
const modeLabel = document.getElementById("mode-label");
const runLabel = document.getElementById("run-label");
const activeCount = document.getElementById("active-count");
const annihilatedCount = document.getElementById("annihilated-count");

const spawnRateInput = document.getElementById("spawn-rate");
const simSpeedInput = document.getElementById("sim-speed");
const chargeStrengthInput = document.getElementById("charge-strength");
const dampingInput = document.getElementById("damping");
const captureRadiusInput = document.getElementById("capture-radius");
const imageThresholdInput = document.getElementById("image-threshold");
const trailsInput = document.getElementById("trails");
const presetNameInput = document.getElementById("preset-name");
const presetSelect = document.getElementById("preset-select");

const drawButtons = Array.from(document.querySelectorAll("button[data-mode]"));

function setMessage(text) {
  messageEl.textContent = text;
}

function syncHUD() {
  modeLabel.textContent = state.mode;
  runLabel.textContent = state.running ? "Running" : "Paused";
  activeCount.textContent = String(state.particles.length);
  annihilatedCount.textContent = String(state.annihilated);
}

function randomDirection() {
  const a = Math.random() * Math.PI * 2;
  return { x: Math.cos(a), y: Math.sin(a) };
}

function addCharge(x, y, polarity) {
  state.charges.push({ x, y, polarity });
}

function eraseAt(x, y) {
  const chargeIndex = state.charges.findIndex((c) => (c.x - x) ** 2 + (c.y - y) ** 2 < 14 ** 2);
  if (chargeIndex >= 0) {
    state.charges.splice(chargeIndex, 1);
    return;
  }

  const barrierIndex = state.barriers.findIndex((b) => pointSegmentDistance(x, y, b.x1, b.y1, b.x2, b.y2) < 10);
  if (barrierIndex >= 0) {
    state.barriers.splice(barrierIndex, 1);
  }
}

function pointSegmentDistance(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) {
    return Math.hypot(px - x1, py - y1);
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const nx = x1 + t * dx;
  const ny = y1 + t * dy;
  return Math.hypot(px - nx, py - ny);
}

function signedArea(ax, ay, bx, by, cx, cy) {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

function onSegment(ax, ay, bx, by, px, py) {
  return (
    px >= Math.min(ax, bx) - 0.001 &&
    px <= Math.max(ax, bx) + 0.001 &&
    py >= Math.min(ay, by) - 0.001 &&
    py <= Math.max(ay, by) + 0.001
  );
}

function segmentsIntersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  const d1 = signedArea(a1x, a1y, a2x, a2y, b1x, b1y);
  const d2 = signedArea(a1x, a1y, a2x, a2y, b2x, b2y);
  const d3 = signedArea(b1x, b1y, b2x, b2y, a1x, a1y);
  const d4 = signedArea(b1x, b1y, b2x, b2y, a2x, a2y);

  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }

  if (Math.abs(d1) < 0.001 && onSegment(a1x, a1y, a2x, a2y, b1x, b1y)) {
    return true;
  }
  if (Math.abs(d2) < 0.001 && onSegment(a1x, a1y, a2x, a2y, b2x, b2y)) {
    return true;
  }
  if (Math.abs(d3) < 0.001 && onSegment(b1x, b1y, b2x, b2y, a1x, a1y)) {
    return true;
  }
  if (Math.abs(d4) < 0.001 && onSegment(b1x, b1y, b2x, b2y, a2x, a2y)) {
    return true;
  }

  return false;
}

function firstObstacleHitOnSegment(x0, y0, x1, y1) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.001) {
    const xi = Math.round(x1);
    const yi = Math.round(y1);
    if (isObstaclePixel(xi, yi)) {
      return { x: x0, y: y0, hitX: xi, hitY: yi };
    }
    return null;
  }

  const samples = Math.max(2, Math.ceil(dist));
  let lastSafeX = x0;
  let lastSafeY = y0;
  for (let i = 1; i <= samples; i += 1) {
    const t = i / samples;
    const x = x0 + dx * t;
    const y = y0 + dy * t;
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (isObstaclePixel(xi, yi)) {
      return { x: lastSafeX, y: lastSafeY, hitX: xi, hitY: yi };
    }
    lastSafeX = x;
    lastSafeY = y;
  }
  return null;
}

function segmentNormal(seg) {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

function reflectVelocity(vx, vy, nx, ny) {
  const dot = vx * nx + vy * ny;
  return {
    x: vx - 2 * dot * nx,
    y: vy - 2 * dot * ny
  };
}

function inBounds(x, y) {
  return x >= 0 && y >= 0 && x < canvas.width && y < canvas.height;
}

function isObstaclePixel(x, y) {
  if (!state.obstacleMask || !inBounds(x, y)) {
    return false;
  }
  return state.obstacleMask[y * canvas.width + x] === 1;
}

function obstacleNormal(x, y) {
  const left = isObstaclePixel(x - 2, y) ? 1 : 0;
  const right = isObstaclePixel(x + 2, y) ? 1 : 0;
  const up = isObstaclePixel(x, y - 2) ? 1 : 0;
  const down = isObstaclePixel(x, y + 2) ? 1 : 0;
  let nx = left - right;
  let ny = up - down;
  const len = Math.hypot(nx, ny) || 1;
  nx /= len;
  ny /= len;
  if (!Number.isFinite(nx) || !Number.isFinite(ny)) {
    return { x: 1, y: 0 };
  }
  return { x: nx, y: ny };
}

function buildObstacleMaskFromImage() {
  if (!state.backgroundImage) {
    state.obstacleMask = null;
    return;
  }
  const off = document.createElement("canvas");
  off.width = canvas.width;
  off.height = canvas.height;
  const offCtx = off.getContext("2d");
  offCtx.drawImage(state.backgroundImage, 0, 0, off.width, off.height);
  const img = offCtx.getImageData(0, 0, off.width, off.height);
  const out = new Uint8Array(off.width * off.height);
  for (let i = 0; i < out.length; i += 1) {
    const r = img.data[i * 4 + 0];
    const g = img.data[i * 4 + 1];
    const b = img.data[i * 4 + 2];
    const a = img.data[i * 4 + 3];
    const lum = (r + g + b) / 3;
    out[i] = a > 16 && lum <= state.imageThreshold ? 1 : 0;
  }
  state.obstacleMask = out;
}

function spawnParticles(dt) {
  const emitters = state.charges.filter((c) => c.polarity === -1);
  if (emitters.length === 0) {
    if (state.running) {
      setMessage("Place at least one negative source to spawn particles.");
    }
    return;
  }

  state.spawnAccumulator += dt * state.spawnRate;
  while (state.spawnAccumulator >= 1) {
    state.spawnAccumulator -= 1;
    const src = emitters[Math.floor(Math.random() * emitters.length)];
    const dir = randomDirection();
    state.particles.push({
      x: src.x,
      y: src.y,
      vx: dir.x * 28,
      vy: dir.y * 28,
      trail: []
    });
  }
}

function applyForces(p, dt) {
  let fx = 0;
  let fy = 0;
  const strength = state.chargeStrength * 4800;

  for (const c of state.charges) {
    const dx = c.x - p.x;
    const dy = c.y - p.y;
    const d2 = Math.max(dx * dx + dy * dy, 40);
    const inv = 1 / Math.sqrt(d2);
    const sign = c.polarity > 0 ? 1 : -1;
    const mag = sign * strength / d2;
    fx += dx * inv * mag;
    fy += dy * inv * mag;
  }

  const neighborRepel = 1900;
  for (const other of state.particles) {
    if (other === p) {
      continue;
    }
    const dx = p.x - other.x;
    const dy = p.y - other.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 4 || d2 > 2400) {
      continue;
    }
    const inv = 1 / Math.sqrt(d2);
    const mag = neighborRepel / d2;
    fx += dx * inv * mag;
    fy += dy * inv * mag;
  }

  p.vx += fx * dt;
  p.vy += fy * dt;
  p.vx *= state.damping;
  p.vy *= state.damping;
}

function applyBarrierCollision(p, prevX, prevY) {
  for (const seg of state.barriers) {
    const d = pointSegmentDistance(p.x, p.y, seg.x1, seg.y1, seg.x2, seg.y2);
    const crossed = segmentsIntersect(prevX, prevY, p.x, p.y, seg.x1, seg.y1, seg.x2, seg.y2);
    if (d < 4.5 || crossed) {
      const n = segmentNormal(seg);
      const r = reflectVelocity(p.vx, p.vy, n.x, n.y);
      p.vx = r.x;
      p.vy = r.y;
      const mvx = p.x - prevX;
      const mvy = p.y - prevY;
      const pushSign = mvx * n.x + mvy * n.y >= 0 ? 1 : -1;
      // Rewind to last known safe position before applying reflection push.
      p.x = prevX + n.x * pushSign * 2;
      p.y = prevY + n.y * pushSign * 2;
      return;
    }
  }
}

function applyImageCollision(p, prevX, prevY) {
  const hit = firstObstacleHitOnSegment(prevX, prevY, p.x, p.y);
  if (!hit) {
    return;
  }
  const n = obstacleNormal(hit.hitX, hit.hitY);
  const r = reflectVelocity(p.vx, p.vy, n.x, n.y);
  p.vx = r.x;
  p.vy = r.y;
  p.x = hit.x + n.x * 2;
  p.y = hit.y + n.y * 2;
}

function moveParticleWithCollisions(p, dt) {
  const maxSpeed = Math.hypot(p.vx, p.vy);
  const stepDistance = Math.max(1, maxSpeed * dt);
  const steps = Math.max(1, Math.ceil(stepDistance / 3));
  const subDt = dt / steps;

  for (let i = 0; i < steps; i += 1) {
    const prevX = p.x;
    const prevY = p.y;

    p.x += p.vx * subDt;
    p.y += p.vy * subDt;

    if (p.x <= 2 || p.x >= canvas.width - 2) {
      p.vx *= -1;
      p.x = Math.max(2, Math.min(canvas.width - 2, p.x));
    }
    if (p.y <= 2 || p.y >= canvas.height - 2) {
      p.vy *= -1;
      p.y = Math.max(2, Math.min(canvas.height - 2, p.y));
    }

    applyBarrierCollision(p, prevX, prevY);
    applyImageCollision(p, prevX, prevY);

    p.x = Math.max(2, Math.min(canvas.width - 2, p.x));
    p.y = Math.max(2, Math.min(canvas.height - 2, p.y));
  }
}

function updateParticles(dt) {
  const next = [];
  for (const p of state.particles) {
    applyForces(p, dt);
    moveParticleWithCollisions(p, dt);

    let captured = false;
    for (const sink of state.charges) {
      if (sink.polarity < 0) {
        continue;
      }
      const d = Math.hypot(sink.x - p.x, sink.y - p.y);
      if (d <= state.captureRadius) {
        state.annihilated += 1;
        captured = true;
        break;
      }
    }
    if (captured) {
      continue;
    }

    if (state.trails) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 10) {
        p.trail.shift();
      }
    } else {
      p.trail.length = 0;
    }

    next.push(p);
  }
  state.particles = next;
}

function drawBackground() {
  if (!state.backgroundImage) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.drawImage(state.backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawCharges() {
  for (const c of state.charges) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 11, 0, Math.PI * 2);
    ctx.fillStyle = c.polarity > 0 ? "#ffb34d" : "#5db4ff";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#0b1020";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(c.polarity > 0 ? "+" : "-", c.x, c.y + 0.5);
  }
}

function drawBarriers() {
  ctx.strokeStyle = "#9ae3cf";
  ctx.lineWidth = 2;
  for (const b of state.barriers) {
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    ctx.lineTo(b.x2, b.y2);
    ctx.stroke();
  }
}

function drawParticles() {
  for (const p of state.particles) {
    if (state.trails && p.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (let i = 1; i < p.trail.length; i += 1) {
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
      }
      ctx.strokeStyle = "rgba(83, 221, 178, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = "#53ddb2";
    ctx.fill();
  }
}

function render() {
  ctx.fillStyle = "#04101f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBarriers();
  drawCharges();
  drawParticles();
}

function canvasPos(event) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * sx,
    y: (event.clientY - rect.top) * sy
  };
}

function setMode(mode) {
  state.mode = mode;
  drawButtons.forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  syncHUD();
}

function handleCanvasDown(event) {
  const p = canvasPos(event);
  if (state.mode === "place-negative") {
    addCharge(p.x, p.y, -1);
    return;
  }
  if (state.mode === "place-positive") {
    addCharge(p.x, p.y, 1);
    return;
  }
  if (state.mode === "erase") {
    eraseAt(p.x, p.y);
    return;
  }
  if (state.mode === "draw-barrier") {
    state.drawStart = p;
  }
}

function handleCanvasUp(event) {
  if (state.mode !== "draw-barrier" || !state.drawStart) {
    return;
  }
  const p = canvasPos(event);
  const d = Math.hypot(p.x - state.drawStart.x, p.y - state.drawStart.y);
  if (d > 6) {
    state.barriers.push({ x1: state.drawStart.x, y1: state.drawStart.y, x2: p.x, y2: p.y });
  }
  state.drawStart = null;
}

function completeBarrierDraw(event) {
  if (state.mode !== "draw-barrier" || !state.drawStart) {
    return;
  }

  const p = event ? canvasPos(event) : state.drawStart;
  const d = Math.hypot(p.x - state.drawStart.x, p.y - state.drawStart.y);
  if (d > 6) {
    state.barriers.push({ x1: state.drawStart.x, y1: state.drawStart.y, x2: p.x, y2: p.y });
  }
  state.drawStart = null;
}

function syncValueLabels() {
  document.getElementById("spawn-rate-val").textContent = String(state.spawnRate);
  document.getElementById("sim-speed-val").textContent = state.simSpeed.toFixed(1);
  document.getElementById("charge-strength-val").textContent = state.chargeStrength.toFixed(1);
  document.getElementById("damping-val").textContent = state.damping.toFixed(3);
  document.getElementById("capture-radius-val").textContent = String(state.captureRadius);
  document.getElementById("image-threshold-val").textContent = String(state.imageThreshold);
}

function listPresetNames() {
  const map = JSON.parse(localStorage.getItem("chargeSimulatorBackgroundPresets") || "{}");
  return Object.keys(map).sort();
}

function refreshPresetSelect() {
  const names = listPresetNames();
  presetSelect.innerHTML = "";
  if (names.length === 0) {
    const o = document.createElement("option");
    o.value = "";
    o.textContent = "(no presets saved)";
    presetSelect.appendChild(o);
    return;
  }
  for (const name of names) {
    const o = document.createElement("option");
    o.value = name;
    o.textContent = name;
    presetSelect.appendChild(o);
  }
}

function saveBackgroundPreset() {
  if (!state.backgroundDataUrl) {
    setMessage("Load a background image before saving a preset.");
    return;
  }

  const name = presetNameInput.value.trim();
  if (!name) {
    setMessage("Enter a preset name first.");
    return;
  }

  const raw = localStorage.getItem("chargeSimulatorBackgroundPresets") || "{}";
  const map = JSON.parse(raw);
  if (map[name] && !window.confirm("Preset exists. Overwrite?")) {
    return;
  }

  map[name] = {
    imageDataUrl: state.backgroundDataUrl,
    imageThreshold: state.imageThreshold
  };
  localStorage.setItem("chargeSimulatorBackgroundPresets", JSON.stringify(map));
  refreshPresetSelect();
  presetSelect.value = name;
  setMessage(`Saved background preset: ${name}`);
}

function loadBackgroundFromDataUrl(dataUrl, threshold) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      state.backgroundImage = img;
      state.backgroundDataUrl = dataUrl;
      state.imageThreshold = threshold;
      imageThresholdInput.value = String(threshold);
      buildObstacleMaskFromImage();
      syncValueLabels();
      resolve();
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function loadSelectedPreset() {
  const name = presetSelect.value;
  if (!name) {
    setMessage("Select a saved preset first.");
    return;
  }

  const map = JSON.parse(localStorage.getItem("chargeSimulatorBackgroundPresets") || "{}");
  const preset = map[name];
  if (!preset || !preset.imageDataUrl) {
    setMessage("Preset data missing or invalid.");
    return;
  }

  try {
    await loadBackgroundFromDataUrl(preset.imageDataUrl, Number(preset.imageThreshold) || DEFAULTS.imageThreshold);
    setMessage(`Loaded background preset: ${name}`);
  } catch (error) {
    setMessage("Could not load saved image asset. Previous background kept.");
  }
}

function wireUI() {
  drawButtons.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  document.getElementById("run-toggle").addEventListener("click", () => {
    state.running = !state.running;
    document.getElementById("run-toggle").textContent = state.running ? "Pause" : "Run";
    syncHUD();
  });

  document.getElementById("clear-particles").addEventListener("click", () => {
    state.particles = [];
    syncHUD();
  });

  document.getElementById("reset-all").addEventListener("click", () => {
    state.charges = [];
    state.barriers = [];
    state.particles = [];
    state.annihilated = 0;
    setMessage("Simulation cleared.");
    syncHUD();
  });

  spawnRateInput.addEventListener("input", () => {
    state.spawnRate = Number(spawnRateInput.value);
    syncValueLabels();
  });
  simSpeedInput.addEventListener("input", () => {
    state.simSpeed = Number(simSpeedInput.value);
    syncValueLabels();
  });
  chargeStrengthInput.addEventListener("input", () => {
    state.chargeStrength = Number(chargeStrengthInput.value);
    syncValueLabels();
  });
  dampingInput.addEventListener("input", () => {
    state.damping = Number(dampingInput.value);
    syncValueLabels();
  });
  captureRadiusInput.addEventListener("input", () => {
    state.captureRadius = Number(captureRadiusInput.value);
    syncValueLabels();
  });
  imageThresholdInput.addEventListener("input", () => {
    state.imageThreshold = Number(imageThresholdInput.value);
    syncValueLabels();
    if (state.backgroundImage) {
      buildObstacleMaskFromImage();
    }
  });
  trailsInput.addEventListener("change", () => {
    state.trails = trailsInput.checked;
  });

  document.getElementById("reset-defaults").addEventListener("click", () => {
    state.spawnRate = DEFAULTS.spawnRate;
    state.simSpeed = DEFAULTS.simSpeed;
    state.chargeStrength = DEFAULTS.chargeStrength;
    state.damping = DEFAULTS.damping;
    state.captureRadius = DEFAULTS.captureRadius;
    state.imageThreshold = DEFAULTS.imageThreshold;
    state.trails = DEFAULTS.trails;

    spawnRateInput.value = String(state.spawnRate);
    simSpeedInput.value = String(state.simSpeed);
    chargeStrengthInput.value = String(state.chargeStrength);
    dampingInput.value = String(state.damping);
    captureRadiusInput.value = String(state.captureRadius);
    imageThresholdInput.value = String(state.imageThreshold);
    trailsInput.checked = state.trails;

    if (state.backgroundImage) {
      buildObstacleMaskFromImage();
    }
    syncValueLabels();
    setMessage("Advanced defaults restored.");
  });

  document.getElementById("background-file").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await loadBackgroundFromDataUrl(String(reader.result), state.imageThreshold);
        setMessage(`Background loaded: ${file.name}`);
      } catch (error) {
        setMessage("Failed to load selected image.");
      }
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("save-preset").addEventListener("click", saveBackgroundPreset);
  document.getElementById("load-preset").addEventListener("click", loadSelectedPreset);

  canvas.addEventListener("mousedown", handleCanvasDown);
  canvas.addEventListener("mouseup", handleCanvasUp);
  canvas.addEventListener("mouseleave", () => completeBarrierDraw());
  window.addEventListener("mouseup", (event) => completeBarrierDraw(event));
}

let lastTs = 0;
function loop(ts) {
  if (!lastTs) {
    lastTs = ts;
  }
  const dt = Math.min((ts - lastTs) / 1000, 0.05) * state.simSpeed;
  lastTs = ts;

  if (state.running) {
    spawnParticles(dt);
    updateParticles(dt);
  }

  render();
  syncHUD();
  requestAnimationFrame(loop);
}

function init() {
  setMode(DEFAULTS.mode);
  spawnRateInput.value = String(state.spawnRate);
  simSpeedInput.value = String(state.simSpeed);
  chargeStrengthInput.value = String(state.chargeStrength);
  dampingInput.value = String(state.damping);
  captureRadiusInput.value = String(state.captureRadius);
  imageThresholdInput.value = String(state.imageThreshold);
  trailsInput.checked = state.trails;
  syncValueLabels();
  refreshPresetSelect();
  wireUI();
  syncHUD();
  render();
  requestAnimationFrame(loop);
}

init();
