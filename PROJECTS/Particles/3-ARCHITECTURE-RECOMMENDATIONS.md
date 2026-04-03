AR-001 : Single-page browser app with HTML shell, CSS design system, and modular JavaScript simulation engine.
- RATIONALE
  1. Separation of concerns supports fast iteration and maintainability for interactive physics UI.
- NOTES
  1. No framework dependency required for this scope.
- RELATED UC-009, BR-001, BR-019

AR-002 : Canvas 2D renderer with fixed-step simulation loop and requestAnimationFrame presentation.
- RATIONALE
  1. Fixed dt improves physics stability while animation frames keep rendering smooth.
- NOTES
  1. Use speed multiplier to scale effective timestep.
- RELATED UC-001, UC-007, BR-002, BR-020

AR-003 : Tool-state controller for place-positive, place-negative, draw-barrier, and erase-barrier modes.
- RATIONALE
  1. Explicit mode handling avoids ambiguous pointer actions and improves UX clarity.
- NOTES
  1. Active tool is reflected in visible UI state.
- RELATED UC-002, UC-003, BR-004, BR-005, BR-007, BR-008, BR-017

AR-004 : Probe model with polarity and spawn scheduling attached to negative probes.
- RATIONALE
  1. Co-locating probe metadata and emission timers simplifies charge generation logic.
- NOTES
  1. Spawn interval derived from UI slider.
- RELATED UC-002, UC-004, BR-010, BR-011

AR-005 : Coulomb-like force aggregator combining probe forces and inter-particle repulsion.
- RATIONALE
  1. Net-force composition is required to satisfy attraction/repulsion behavior simultaneously.
- NOTES
  1. Clamp minimum distance to avoid singularities.
- RELATED UC-005, BR-012, BR-013, BR-014

AR-006 : Barrier collision subsystem using line-segment intersection and velocity reflection with damping.
- RATIONALE
  1. Segment-based collisions map naturally to user-drawn lines and enable bounce behavior.
- NOTES
  1. Include erase hit-testing by distance-to-segment threshold.
- RELATED UC-003, BR-008, BR-009, BR-016

AR-007 : Positive-probe annihilation using configurable capture radius check.
- RATIONALE
  1. Radius-based capture is efficient and visually intuitive.
- NOTES
  1. Remove captured particles before next integration step.
- RELATED UC-006, BR-015

AR-008 : Runtime control binding layer maps sliders/inputs to simulation config object.
- RATIONALE
  1. Central config object ensures immediate live updates from UI controls.
- NOTES
  1. Include controls for speed, force strength, spawn rate, damping, and particle cap.
- RELATED UC-001, UC-007, BR-002, BR-003, BR-011, BR-016

AR-009 : HUD metrics panel updated from simulation state each frame.
- RATIONALE
  1. Real-time counters make system behavior understandable and improve perceived responsiveness.
- NOTES
  1. Expose counts for charges, probes, barriers, and current tool.
- RELATED UC-008, BR-017

AR-010 : Build output packaged as static files under ./build for direct browser hosting.
- RATIONALE
  1. Static packaging satisfies browser-only requirement and Stage 5 output contract.
- NOTES
  1. Entry point is build/index.html.
- RELATED UC-009, BR-019
