ARCHITECTURE:
- ARCH ID: AR-01
- DESCRIPTION: Host the simulator as a single-page browser application.
- TECHNOLOGY DECISION: Vanilla HTML, CSS, and JavaScript with a canvas-rendered simulation surface.
- TRADEOFFS: No framework overhead but requires manual state orchestration and UI wiring.
- RELATED: UC-01, BR-01

ARCHITECTURE:
- ARCH ID: AR-02
- DESCRIPTION: Model static charges as typed nodes in simulation state.
- TECHNOLOGY DECISION: Store charge nodes in an in-memory array with polarity and position fields.
- TRADEOFFS: Simple representation but no built-in persistence unless explicitly serialized.
- RELATED: UC-02, BR-02

ARCHITECTURE:
- ARCH ID: AR-03
- DESCRIPTION: Support collisions against both drawn barriers and image-derived solid masks.
- TECHNOLOGY DECISION: Keep barrier segments in vector list and background obstacle mask in an offscreen pixel map.
- TRADEOFFS: Pixel mask checks are fast at runtime but can be resolution-dependent.
- RELATED: UC-03, BR-03

ARCHITECTURE:
- ARCH ID: AR-04
- DESCRIPTION: Spawn mobile particles from negative charge emitters at configurable cadence.
- TECHNOLOGY DECISION: Use accumulator-based spawn scheduler driven by animation timestep.
- TRADEOFFS: Deterministic cadence control but burst behavior can occur after long frame delays.
- RELATED: UC-04, BR-04

ARCHITECTURE:
- ARCH ID: AR-05
- DESCRIPTION: Remove particles on sink capture and track annihilation metrics.
- TECHNOLOGY DECISION: Distance-threshold sink capture test integrated into particle update loop.
- TRADEOFFS: Radius capture is stable but approximates complex field absorption behavior.
- RELATED: UC-05, BR-05

ARCHITECTURE:
- ARCH ID: AR-06
- DESCRIPTION: Provide live spawn frequency control.
- TECHNOLOGY DECISION: Bind slider value to particles-per-second scheduler input.
- TRADEOFFS: Slider precision is bounded by UI range granularity.
- RELATED: UC-06, BR-06

ARCHITECTURE:
- ARCH ID: AR-07
- DESCRIPTION: Implement Coulomb-like motion forces from static charges and neighboring particles.
- TECHNOLOGY DECISION: Per-frame force integration using inverse-distance-squared style weighting with clamped minima.
- TRADEOFFS: Approximate physics for interactivity; not a physically exact solver.
- RELATED: UC-07, BR-07

ARCHITECTURE:
- ARCH ID: AR-08
- DESCRIPTION: Expose speed and strength runtime tuning.
- TECHNOLOGY DECISION: Multiply simulation dt and force constants using bound slider parameters.
- TRADEOFFS: Broad tunability can produce unstable dynamics at extreme values if not damped.
- RELATED: UC-08, BR-08

ARCHITECTURE:
- ARCH ID: AR-09
- DESCRIPTION: Maintain advanced options and default reset behavior.
- TECHNOLOGY DECISION: Central defaults object and validated control synchronization for damping/capture/trails.
- TRADEOFFS: Requires strict UI-state synchronization to avoid stale values.
- RELATED: UC-09, BR-09

ARCHITECTURE:
- ARCH ID: AR-10
- DESCRIPTION: Keep the interaction model understandable through explicit status and mode indicators.
- TECHNOLOGY DECISION: Dedicated HUD labels for active tool, run state, and counters with guidance messages.
- TRADEOFFS: Additional UI state branching but improved usability.
- RELATED: UC-10, BR-10

ARCHITECTURE:
- ARCH ID: AR-11
- DESCRIPTION: Persist background image and mask settings as reusable named presets.
- TECHNOLOGY DECISION: Save preset payloads (data URL plus mask settings) in browser localStorage JSON.
- TRADEOFFS: Large images increase storage usage and can approach browser quota.
- RELATED: UC-11, BR-11

ARCHITECTURE:
- ARCH ID: AR-12
- DESCRIPTION: Restore background presets and apply obstacle collision mapping immediately.
- TECHNOLOGY DECISION: Hydrate image and mask settings from selected preset, rebuild offscreen mask, and bind to collision checks.
- TRADEOFFS: Corrupted preset assets must be validated to prevent runtime collision-map failures.
- RELATED: UC-12, BR-12
