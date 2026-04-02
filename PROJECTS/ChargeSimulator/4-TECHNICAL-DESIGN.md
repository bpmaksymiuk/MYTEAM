IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-01
- GOAL: Build browser-accessible simulator shell.
- SKILLSET REQUIRED: HTML, CSS, JavaScript
- IMPLEMENTATION STEPS: Create index.html with canvas and control groups; add responsive styles for mobile and desktop breakpoints; wire bootstrap script.
- RELATED: UC-01, BR-01, AR-01

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-02
- GOAL: Implement positive and negative charge placement/edit behavior.
- SKILLSET REQUIRED: Canvas interaction handling, state management
- IMPLEMENTATION STEPS: Add tool modes for positive, negative, and erase; on pointer event place charge node or erase nearest node; keep nodes in bounded canvas space.
- RELATED: UC-02, BR-02, AR-02

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-03
- GOAL: Implement barrier drawing, barrier erasing, and image-obstacle collisions.
- SKILLSET REQUIRED: Canvas geometry, collision math
- IMPLEMENTATION STEPS: Capture drag paths into barrier segments; implement near-segment erase check; create image mask occupancy lookup and collision response reflection.
- RELATED: UC-03, BR-03, AR-03

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-04
- GOAL: Implement particle spawning from negative sources.
- SKILLSET REQUIRED: Animation loop timing, particle systems
- IMPLEMENTATION STEPS: Use dt accumulator with spawn-rate control to emit particles from each negative source while running; pause scheduler when paused.
- RELATED: UC-04, BR-04, AR-04

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-05
- GOAL: Implement sink annihilation and metric tracking.
- SKILLSET REQUIRED: Vector math, simulation bookkeeping
- IMPLEMENTATION STEPS: Detect sink-radius overlap against positive charges; remove captured particles; increment annihilation counter exactly once per capture.
- RELATED: UC-05, BR-05, AR-05

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-06
- GOAL: Implement spawn-rate live control.
- SKILLSET REQUIRED: UI binding, runtime parameter updates
- IMPLEMENTATION STEPS: Bind slider to spawn-per-second parameter with label; apply new value immediately to scheduler without full reset.
- RELATED: UC-06, BR-06, AR-06

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-07
- GOAL: Implement Coulomb-like attraction and repulsion dynamics.
- SKILLSET REQUIRED: Numerical integration, force modeling
- IMPLEMENTATION STEPS: For each particle compute force from static charges and nearby particles; clamp minima and maxima for stability; update velocity and position each frame.
- RELATED: UC-07, BR-07, AR-07

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-08
- GOAL: Support runtime speed and charge strength tuning.
- SKILLSET REQUIRED: Simulation parameterization
- IMPLEMENTATION STEPS: Bind speed and strength sliders to dt and force multipliers; apply changes immediately during run.
- RELATED: UC-08, BR-08, AR-08

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-09
- GOAL: Implement advanced controls and reset defaults.
- SKILLSET REQUIRED: Form controls, validation
- IMPLEMENTATION STEPS: Add damping, capture radius, and trails controls with bounds; implement reset-defaults action that restores documented baseline values.
- RELATED: UC-09, BR-09, AR-09

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-10
- GOAL: Provide clear tool/run status and user guidance.
- SKILLSET REQUIRED: UX feedback patterns
- IMPLEMENTATION STEPS: Render active mode indicator, run-state text, active and annihilated counters; show guidance message when running without negative source.
- RELATED: UC-10, BR-10, AR-10

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-11
- GOAL: Save background image presets with collision-mask settings.
- SKILLSET REQUIRED: Browser storage APIs, serialization
- IMPLEMENTATION STEPS: Read loaded image as data URL, collect collision threshold and solid-mode settings, save to localStorage under user-provided preset name with overwrite handling.
- RELATED: UC-11, BR-11, AR-11

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-12
- GOAL: Load saved background presets and activate image collisions.
- SKILLSET REQUIRED: Asset hydration, validation handling
- IMPLEMENTATION STEPS: Populate preset selector from localStorage, load selected payload, rebuild mask map, activate collisions, and surface error if preset image is invalid.
- RELATED: UC-12, BR-12, AR-12
