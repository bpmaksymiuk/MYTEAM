UC-001 : End User - Configure Simulation Workspace
- STEPS
  1. User opens the simulator in a browser.
  2. System loads a canvas and control panel with default values.
  3. User adjusts simulation speed, charge strength, and related options.
- ACCEPTANCE CRITERIA
  1. Canvas and controls render in under 2 seconds on a typical desktop browser.
  2. Every control change updates runtime simulation behavior without reload.
  3. Control values remain visible and understandable while simulation runs.
- RELATED None

UC-002 : End User - Place Positive And Negative Probes
- STEPS
  1. User selects probe tool for positive (+) or negative (-).
  2. User clicks canvas to place probes.
  3. System renders probe marker and polarity immediately.
- ACCEPTANCE CRITERIA
  1. User can place both + and - probes at arbitrary canvas positions.
  2. Probe markers clearly indicate polarity.
  3. Newly placed probes participate in physics instantly.
- RELATED UC-001

UC-003 : End User - Draw And Erase Barriers
- STEPS
  1. User switches to draw mode and drags on canvas to create barrier segments.
  2. User switches to erase mode and removes barrier segments.
  3. System updates collision geometry used by moving charges.
- ACCEPTANCE CRITERIA
  1. Barriers are visible immediately as drawn lines.
  2. Charges bounce off existing barriers during simulation.
  3. Erased barriers no longer affect charge movement.
- RELATED UC-001

UC-004 : End User - Spawn Charges From Negative Probes
- STEPS
  1. User places at least one negative probe.
  2. System continuously spawns charges at negative probes.
  3. User changes spawn-rate slider.
- ACCEPTANCE CRITERIA
  1. Charges begin spawning automatically when a negative probe exists.
  2. Spawn-rate control measurably changes spawn frequency.
  3. Spawning remains stable under normal interactive load.
- RELATED UC-002

UC-005 : End User - Move Charges According To Coulomb Physics
- STEPS
  1. Simulation computes net force on each charge each frame.
  2. Charges are attracted to positive probes and repelled from negative probes.
  3. Charges repel each other.
- ACCEPTANCE CRITERIA
  1. Motion direction reflects configured Coulomb-like attraction/repulsion.
  2. Changing charge-strength control alters force magnitude.
  3. Visual behavior clearly demonstrates interactions among probes and charges.
- RELATED UC-002, UC-004

UC-006 : End User - Annihilate Charges At Positive Probes
- STEPS
  1. Moving charge reaches annihilation radius around a positive probe.
  2. System removes the charge from active particle list.
  3. System updates any visible counters/metrics.
- ACCEPTANCE CRITERIA
  1. Charges are removed when entering positive probe capture radius.
  2. Removed charges do not continue rendering or influencing physics.
  3. Annihilation events are visible and understandable to the user.
- RELATED UC-002, UC-005

UC-007 : End User - Tune Runtime Parameters During Simulation
- STEPS
  1. User adjusts simulation speed control.
  2. User adjusts charge strength control.
  3. User adjusts any additional exposed settings.
- ACCEPTANCE CRITERIA
  1. Parameter changes apply without restarting simulation.
  2. Effects are visible within one second of control change.
  3. Controls remain responsive while many charges are active.
- RELATED UC-001, UC-005

UC-008 : End User - Experience Advanced And Intuitive UI
- STEPS
  1. User observes layout, visuals, and interactions.
  2. User uses tools and controls without external instructions.
  3. User interprets simulation state from on-screen feedback.
- ACCEPTANCE CRITERIA
  1. Interface communicates tool state and control intent clearly.
  2. Visual design appears polished and technologically advanced.
  3. Common actions (place probe, draw barrier, tune controls) are discoverable in first use.
- RELATED UC-001, UC-002, UC-003, UC-007

UC-009 : End User - Run Entire Experience In Browser
- STEPS
  1. User opens simulator URL in a modern browser.
  2. System loads all assets and starts interactive loop.
  3. User interacts without platform-specific installation.
- ACCEPTANCE CRITERIA
  1. Simulator runs in-browser using standard web technologies.
  2. No native or server-side rendering dependency is required for core interaction.
  3. Core features work on recent Chromium and Firefox versions.
- RELATED UC-001
