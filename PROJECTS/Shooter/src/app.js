(() => {
  const root = document.getElementById("game-root");
  const menuOverlay = document.getElementById("overlay-menu");
  const pauseOverlay = document.getElementById("overlay-pause");
  const gameOverOverlay = document.getElementById("overlay-gameover");

  const hud = {
    health: document.getElementById("hud-health"),
    weapon: document.getElementById("hud-weapon"),
    ammo: document.getElementById("hud-ammo"),
    kills: document.getElementById("hud-kills"),
    score: document.getElementById("hud-score"),
    fps: document.getElementById("hud-fps")
  };

  const finalKills = document.getElementById("final-kills");
  const finalScore = document.getElementById("final-score");

  const startBtn = document.getElementById("start-btn");
  const resumeBtn = document.getElementById("resume-btn");
  const restartBtn = document.getElementById("restart-btn");
  const muteBtn = document.getElementById("mute-btn");
  const applyBindingsBtn = document.getElementById("apply-bindings");

  const bindInputs = {
    forward: document.getElementById("bind-forward"),
    back: document.getElementById("bind-back"),
    left: document.getElementById("bind-left"),
    right: document.getElementById("bind-right")
  };

  const Phase = {
    MENU: "menu",
    RUNNING: "running",
    PAUSED: "paused",
    GAMEOVER: "gameover"
  };

  const state = {
    phase: Phase.MENU,
    pressed: new Set(),
    pointerLocked: false,
    yaw: 0,
    pitch: 0,
    kills: 0,
    score: 0,
    fps: 0,
    keybinds: {
      forward: "w",
      back: "s",
      left: "a",
      right: "d",
      jump: " ",
      sprint: "shift"
    },
    player: {
      pos: new THREE.Vector3(0, 1.6, 8),
      vel: new THREE.Vector3(),
      health: 100,
      onGround: false
    },
    weapons: {
      rifle: { name: "Rifle", ammo: 120, cooldown: 0.11, damage: 22, projectile: false, speed: 0 },
      launcher: { name: "Launcher", ammo: 20, cooldown: 0.45, damage: 52, projectile: true, speed: 28 }
    },
    activeWeapon: "rifle",
    nextFireTime: 0,
    audioEnabled: true,
    audioCtx: null,
    enemies: [],
    pickups: [],
    hazards: [],
    projectiles: [],
    enemyProjectiles: [],
    lastTime: performance.now()
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080d16);
  scene.fog = new THREE.Fog(0x080d16, 12, 90);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 180);
  camera.position.copy(state.player.pos);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  root.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0x8fb6ff, 0x2d241a, 0.7);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(8, 14, 10);
  dir.castShadow = true;
  scene.add(dir);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x3a414d, roughness: 0.85, metalness: 0.05 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x687388 });
  function makeWall(x, z, w, d, h = 4) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    wall.position.set(x, h / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.userData.collider = { minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, h };
    scene.add(wall);
    return wall;
  }

  const colliders = [
    makeWall(0, -22, 56, 2),
    makeWall(0, 22, 56, 2),
    makeWall(-28, 0, 2, 46),
    makeWall(28, 0, 2, 46),
    makeWall(0, 0, 10, 2),
    makeWall(-12, -8, 12, 2),
    makeWall(14, 10, 10, 2)
  ];

  function addHazard(minX, maxX, minZ, maxZ, dps) {
    state.hazards.push({ minX, maxX, minZ, maxZ, dps });
    const hz = new THREE.Mesh(
      new THREE.PlaneGeometry(maxX - minX, maxZ - minZ),
      new THREE.MeshBasicMaterial({ color: 0xdd4d27, transparent: true, opacity: 0.65 })
    );
    hz.rotation.x = -Math.PI / 2;
    hz.position.set((minX + maxX) / 2, 0.02, (minZ + maxZ) / 2);
    scene.add(hz);
  }
  addHazard(-24, -16, -16, -8, 12);
  addHazard(14, 24, 10, 18, 14);

  function setOverlay(phase) {
    menuOverlay.classList.toggle("visible", phase === Phase.MENU);
    pauseOverlay.classList.toggle("visible", phase === Phase.PAUSED);
    gameOverOverlay.classList.toggle("visible", phase === Phase.GAMEOVER);
  }

  function setPhase(nextPhase) {
    state.phase = nextPhase;
    setOverlay(nextPhase);
    if (nextPhase !== Phase.RUNNING && document.pointerLockElement === renderer.domElement) {
      document.exitPointerLock();
    }
  }

  function updateHUD() {
    const w = state.weapons[state.activeWeapon];
    hud.health.textContent = Math.max(0, Math.floor(state.player.health));
    hud.weapon.textContent = w.name;
    hud.ammo.textContent = String(Math.max(0, w.ammo));
    hud.kills.textContent = String(state.kills);
    hud.score.textContent = String(state.score);
    hud.fps.textContent = String(Math.round(state.fps));
  }

  function pointInHazard(x, z) {
    return state.hazards.find((h) => x >= h.minX && x <= h.maxX && z >= h.minZ && z <= h.maxZ);
  }

  function spawnEnemy(type, x, z) {
    const hp = type === "heavy" ? 120 : 70;
    const speed = type === "melee" ? 5.2 : 3.6;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, type === "heavy" ? 2.4 : 2.0, 1.1),
      new THREE.MeshStandardMaterial({ color: type === "melee" ? 0xc54f3a : 0x8a56ff })
    );
    mesh.position.set(x, mesh.geometry.parameters.height / 2, z);
    mesh.castShadow = true;
    scene.add(mesh);

    const barBg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.12), new THREE.MeshBasicMaterial({ color: 0x111111 }));
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.08), new THREE.MeshBasicMaterial({ color: 0x45ff6f }));
    barBg.position.set(0, 1.4, 0);
    bar.position.set(0, 1.4, 0.01);
    mesh.add(barBg);
    mesh.add(bar);

    state.enemies.push({
      id: `${type}-${Math.random().toString(36).slice(2)}`,
      type,
      hp,
      maxHp: hp,
      speed,
      cooldown: Math.random() * 0.8,
      mesh,
      bar,
      alive: true
    });
  }

  function spawnInitialEnemies() {
    spawnEnemy("melee", -18, -10);
    spawnEnemy("ranged", 16, -14);
    spawnEnemy("melee", 10, 12);
    spawnEnemy("ranged", -10, 14);
  }

  function createPickup(type, x, z, amount) {
    const color = type === "health" ? 0x35d976 : 0x4ec7ff;
    const geom = type === "health" ? new THREE.SphereGeometry(0.45, 12, 12) : new THREE.BoxGeometry(0.7, 0.5, 0.7);
    const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35 }));
    mesh.position.set(x, 0.6, z);
    scene.add(mesh);
    state.pickups.push({ type, amount, radius: 1.1, mesh });
  }

  function spawnPickups() {
    createPickup("health", -20, 0, 35);
    createPickup("health", 20, 0, 35);
    createPickup("ammo", 0, -18, 30);
    createPickup("ammo", 0, 18, 20);
  }

  function buildProjectilePool(targetArray, color) {
    for (let i = 0; i < 18; i += 1) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color }));
      mesh.visible = false;
      scene.add(mesh);
      targetArray.push({ active: false, mesh, vel: new THREE.Vector3(), damage: 0, fromEnemy: false, ttl: 0 });
    }
  }

  buildProjectilePool(state.projectiles, 0xffc45c);
  buildProjectilePool(state.enemyProjectiles, 0xff4d8f);

  function acquireProjectile(pool) {
    for (const p of pool) {
      if (!p.active) {
        p.active = true;
        p.mesh.visible = true;
        return p;
      }
    }
    return null;
  }

  function releaseProjectile(p) {
    p.active = false;
    p.mesh.visible = false;
    p.ttl = 0;
    p.damage = 0;
  }

  function initAudio() {
    if (!state.audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        state.audioCtx = new Ctx();
      }
    }
  }

  function playCue(freq, duration, type = "square", gain = 0.025) {
    if (!state.audioEnabled || !state.audioCtx) {
      return;
    }
    const osc = state.audioCtx.createOscillator();
    const amp = state.audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.value = gain;
    osc.connect(amp);
    amp.connect(state.audioCtx.destination);
    const t = state.audioCtx.currentTime;
    osc.start(t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.stop(t + duration);
  }

  function applyPlayerDamage(amount) {
    if (state.phase !== Phase.RUNNING) {
      return;
    }
    state.player.health -= amount;
    playCue(120, 0.07, "sawtooth", 0.04);
    if (state.player.health <= 0) {
      state.player.health = 0;
      finalKills.textContent = String(state.kills);
      finalScore.textContent = String(state.score);
      setPhase(Phase.GAMEOVER);
    }
  }

  function canMoveTo(x, z) {
    for (const c of colliders) {
      const b = c.userData.collider;
      if (x > b.minX - 0.35 && x < b.maxX + 0.35 && z > b.minZ - 0.35 && z < b.maxZ + 0.35) {
        return false;
      }
    }
    return true;
  }

  function fire(now) {
    if (state.phase !== Phase.RUNNING || now < state.nextFireTime) {
      return;
    }
    const weapon = state.weapons[state.activeWeapon];
    if (weapon.ammo <= 0) {
      playCue(220, 0.04, "triangle", 0.02);
      state.nextFireTime = now + 0.1;
      return;
    }

    weapon.ammo -= 1;
    state.nextFireTime = now + weapon.cooldown;

    if (weapon.projectile) {
      const p = acquireProjectile(state.projectiles);
      if (p) {
        const dirVec = new THREE.Vector3();
        camera.getWorldDirection(dirVec);
        p.mesh.position.copy(camera.position).addScaledVector(dirVec, 0.8);
        p.vel.copy(dirVec).multiplyScalar(weapon.speed);
        p.damage = weapon.damage;
        p.ttl = 2.3;
      }
      playCue(180, 0.1, "sawtooth", 0.04);
    } else {
      const dirVec = new THREE.Vector3();
      camera.getWorldDirection(dirVec);
      const ray = new THREE.Raycaster(camera.position, dirVec, 0, 40);
      const enemyMeshes = state.enemies.filter((e) => e.alive).map((e) => e.mesh);
      const hit = ray.intersectObjects(enemyMeshes, false)[0];
      if (hit) {
        const enemy = state.enemies.find((e) => e.mesh === hit.object);
        if (enemy) {
          damageEnemy(enemy, weapon.damage);
        }
      }
      playCue(520, 0.05, "square", 0.03);
    }
  }

  function damageEnemy(enemy, amount) {
    if (!enemy.alive) {
      return;
    }
    enemy.hp -= amount;
    enemy.bar.scale.x = Math.max(0, enemy.hp / enemy.maxHp);
    enemy.bar.position.x = -(1.15 - 1.15 * enemy.bar.scale.x) / 2;

    if (enemy.hp <= 0) {
      enemy.alive = false;
      scene.remove(enemy.mesh);
      state.kills += 1;
      state.score += enemy.type === "heavy" ? 175 : 100;
      if (Math.random() > 0.65) {
        createPickup("ammo", enemy.mesh.position.x, enemy.mesh.position.z, 12);
      }
      playCue(90, 0.14, "triangle", 0.05);
    }
  }

  function updateProjectiles(dt, pool, enemyTargeting) {
    for (const p of pool) {
      if (!p.active) {
        continue;
      }
      p.mesh.position.addScaledVector(p.vel, dt);
      p.ttl -= dt;

      if (p.ttl <= 0 || Math.abs(p.mesh.position.x) > 40 || Math.abs(p.mesh.position.z) > 40) {
        releaseProjectile(p);
        continue;
      }

      if (!enemyTargeting) {
        for (const enemy of state.enemies) {
          if (!enemy.alive) {
            continue;
          }
          if (p.mesh.position.distanceTo(enemy.mesh.position) < 0.9) {
            damageEnemy(enemy, p.damage);
            releaseProjectile(p);
            break;
          }
        }
      } else if (p.mesh.position.distanceTo(camera.position) < 0.8) {
        applyPlayerDamage(p.damage);
        releaseProjectile(p);
      }
    }
  }

  function applyPickups() {
    for (let i = state.pickups.length - 1; i >= 0; i -= 1) {
      const p = state.pickups[i];
      p.mesh.rotation.y += 0.8 * 0.016;
      if (camera.position.distanceTo(p.mesh.position) <= p.radius) {
        if (p.type === "health") {
          state.player.health = Math.min(100, state.player.health + p.amount);
        } else {
          state.weapons.rifle.ammo += p.amount;
          state.weapons.launcher.ammo += Math.round(p.amount * 0.4);
        }
        scene.remove(p.mesh);
        state.pickups.splice(i, 1);
        playCue(760, 0.07, "triangle", 0.03);
      }
    }
  }

  function updateEnemies(dt, now) {
    for (const enemy of state.enemies) {
      if (!enemy.alive) {
        continue;
      }
      const toPlayer = new THREE.Vector3().subVectors(camera.position, enemy.mesh.position);
      const dist = toPlayer.length();
      toPlayer.y = 0;
      const dirToPlayer = toPlayer.normalize();

      if (enemy.type === "melee" || dist > 7) {
        const nextX = enemy.mesh.position.x + dirToPlayer.x * enemy.speed * dt;
        const nextZ = enemy.mesh.position.z + dirToPlayer.z * enemy.speed * dt;
        if (canMoveTo(nextX, nextZ)) {
          enemy.mesh.position.x = nextX;
          enemy.mesh.position.z = nextZ;
        }
      }

      enemy.cooldown -= dt;
      if (enemy.type === "melee") {
        if (dist < 1.8 && enemy.cooldown <= 0) {
          applyPlayerDamage(10);
          enemy.cooldown = 0.9;
        }
      } else if (dist < 16 && enemy.cooldown <= 0) {
        const proj = acquireProjectile(state.enemyProjectiles);
        if (proj) {
          const vec = new THREE.Vector3().subVectors(camera.position, enemy.mesh.position).normalize();
          proj.mesh.position.copy(enemy.mesh.position).setY(1.2);
          proj.vel.copy(vec).multiplyScalar(14);
          proj.damage = 8;
          proj.ttl = 2.8;
        }
        enemy.cooldown = 1.35;
      }
    }

    if (state.enemies.filter((e) => e.alive).length < 4 && Math.random() < 0.007) {
      const type = Math.random() > 0.5 ? "melee" : "ranged";
      spawnEnemy(type, (Math.random() - 0.5) * 42, (Math.random() - 0.5) * 34);
    }
  }

  function applyGamepad(dt) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = pads && pads[0];
    if (!gp) {
      return;
    }

    const moveX = gp.axes[0] || 0;
    const moveY = gp.axes[1] || 0;
    const lookX = gp.axes[2] || 0;
    const lookY = gp.axes[3] || 0;

    const lookSensitivity = 1.9;
    state.yaw -= lookX * lookSensitivity * dt;
    state.pitch -= lookY * lookSensitivity * dt;

    if (Math.abs(moveX) > 0.15 || Math.abs(moveY) > 0.15) {
      const speed = 6.2;
      const fwd = new THREE.Vector3(Math.sin(state.yaw), 0, Math.cos(state.yaw));
      const right = new THREE.Vector3(fwd.z, 0, -fwd.x);
      state.player.vel.addScaledVector(fwd, -moveY * speed * dt * 10);
      state.player.vel.addScaledVector(right, moveX * speed * dt * 10);
    }

    if (gp.buttons[7] && gp.buttons[7].pressed) {
      fire(performance.now() * 0.001);
    }
  }

  function updatePlayer(dt) {
    const forward = new THREE.Vector3(Math.sin(state.yaw), 0, Math.cos(state.yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    const sprinting = state.pressed.has(state.keybinds.sprint);
    const speed = sprinting ? 8.5 : 5.2;

    if (state.pressed.has(state.keybinds.forward)) {
      state.player.vel.addScaledVector(forward, -speed * dt * 10);
    }
    if (state.pressed.has(state.keybinds.back)) {
      state.player.vel.addScaledVector(forward, speed * dt * 10);
    }
    if (state.pressed.has(state.keybinds.left)) {
      state.player.vel.addScaledVector(right, -speed * dt * 10);
    }
    if (state.pressed.has(state.keybinds.right)) {
      state.player.vel.addScaledVector(right, speed * dt * 10);
    }

    if (state.pressed.has(state.keybinds.jump) && state.player.onGround) {
      state.player.vel.y = 6.5;
      state.player.onGround = false;
      playCue(380, 0.05, "square", 0.02);
    }

    state.player.vel.y -= 16 * dt;

    const damping = 0.86;
    state.player.vel.x *= damping;
    state.player.vel.z *= damping;

    const nextX = state.player.pos.x + state.player.vel.x * dt;
    const nextZ = state.player.pos.z + state.player.vel.z * dt;
    if (canMoveTo(nextX, state.player.pos.z)) {
      state.player.pos.x = nextX;
    }
    if (canMoveTo(state.player.pos.x, nextZ)) {
      state.player.pos.z = nextZ;
    }

    state.player.pos.y += state.player.vel.y * dt;
    if (state.player.pos.y <= 1.6) {
      state.player.pos.y = 1.6;
      state.player.vel.y = 0;
      state.player.onGround = true;
    }

    const hz = pointInHazard(state.player.pos.x, state.player.pos.z);
    if (hz) {
      applyPlayerDamage(hz.dps * dt);
    }

    state.pitch = Math.max(-1.35, Math.min(1.35, state.pitch));
    camera.position.copy(state.player.pos);
    camera.rotation.set(state.pitch, state.yaw, 0, "YXZ");
  }

  function restartGame() {
    for (const e of state.enemies) {
      if (e.mesh.parent) {
        scene.remove(e.mesh);
      }
    }
    state.enemies = [];

    for (const p of state.pickups) {
      if (p.mesh.parent) {
        scene.remove(p.mesh);
      }
    }
    state.pickups = [];

    for (const pool of [state.projectiles, state.enemyProjectiles]) {
      for (const proj of pool) {
        releaseProjectile(proj);
      }
    }

    state.player.health = 100;
    state.player.pos.set(0, 1.6, 8);
    state.player.vel.set(0, 0, 0);
    state.kills = 0;
    state.score = 0;
    state.weapons.rifle.ammo = 120;
    state.weapons.launcher.ammo = 20;
    state.activeWeapon = "rifle";
    state.nextFireTime = 0;

    spawnInitialEnemies();
    spawnPickups();
    setPhase(Phase.RUNNING);
    renderer.domElement.requestPointerLock();
  }

  function animate(nowMs) {
    const now = nowMs * 0.001;
    let dt = (nowMs - state.lastTime) * 0.001;
    dt = Math.min(dt, 0.033);
    state.lastTime = nowMs;

    if (dt > 0) {
      state.fps = 1 / dt;
    }

    if (state.phase === Phase.RUNNING) {
      updatePlayer(dt);
      updateEnemies(dt, now);
      updateProjectiles(dt, state.projectiles, false);
      updateProjectiles(dt, state.enemyProjectiles, true);
      applyPickups();
      applyGamepad(dt);
      updateHUD();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener("pointerlockchange", () => {
    state.pointerLocked = document.pointerLockElement === renderer.domElement;
    if (!state.pointerLocked && state.phase === Phase.RUNNING) {
      setPhase(Phase.PAUSED);
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!state.pointerLocked || state.phase !== Phase.RUNNING) {
      return;
    }
    state.yaw -= e.movementX * 0.0022;
    state.pitch -= e.movementY * 0.0022;
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    state.pressed.add(key);

    if (key === "1") {
      state.activeWeapon = "rifle";
    }
    if (key === "2") {
      state.activeWeapon = "launcher";
    }

    if (key === "escape" && state.phase === Phase.RUNNING) {
      setPhase(Phase.PAUSED);
    } else if (key === "escape" && state.phase === Phase.PAUSED) {
      setPhase(Phase.RUNNING);
      renderer.domElement.requestPointerLock();
    }
  });

  document.addEventListener("keyup", (e) => {
    state.pressed.delete(e.key.toLowerCase());
  });

  document.addEventListener("mousedown", (e) => {
    if (state.phase !== Phase.RUNNING || e.button !== 0) {
      return;
    }
    fire(performance.now() * 0.001);
  });

  startBtn.addEventListener("click", () => {
    initAudio();
    restartGame();
  });

  resumeBtn.addEventListener("click", () => {
    if (state.phase === Phase.PAUSED) {
      setPhase(Phase.RUNNING);
      renderer.domElement.requestPointerLock();
    }
  });

  restartBtn.addEventListener("click", () => {
    restartGame();
  });

  muteBtn.addEventListener("click", () => {
    state.audioEnabled = !state.audioEnabled;
  });

  applyBindingsBtn.addEventListener("click", () => {
    const next = {
      forward: bindInputs.forward.value.toLowerCase() || "w",
      back: bindInputs.back.value.toLowerCase() || "s",
      left: bindInputs.left.value.toLowerCase() || "a",
      right: bindInputs.right.value.toLowerCase() || "d"
    };

    const vals = Object.values(next);
    const hasDup = new Set(vals).size !== vals.length;
    if (hasDup) {
      return;
    }

    state.keybinds.forward = next.forward;
    state.keybinds.back = next.back;
    state.keybinds.left = next.left;
    state.keybinds.right = next.right;
  });

  setPhase(Phase.MENU);
  updateHUD();
  requestAnimationFrame(animate);
})();
