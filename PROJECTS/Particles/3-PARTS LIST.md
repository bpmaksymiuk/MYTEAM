PT-001 : HTML application shell
- DESCRIPTION
  1. Static layout containing header, controls panel, metrics panel, and simulation canvas.
- TECHNOLOGY RECOMMENDATIONS
  1. Semantic HTML5 with form controls and ARIA labels.
- NOTES
  1. Keep structure simple for easy scripting.
- RELATED UC-001, UC-008, BR-001, BR-018, AR-001

PT-002 : Visual design system
- DESCRIPTION
  1. CSS tokens and component styles for futuristic polished UI and readable controls.
- TECHNOLOGY RECOMMENDATIONS
  1. CSS custom properties, gradients, glass-like panels, responsive layout.
- NOTES
  1. Maintain contrast for accessibility.
- RELATED UC-008, BR-018, AR-001

PT-003 : Simulation state model
- DESCRIPTION
  1. In-memory structures for probes, barriers, particles, and runtime config.
- TECHNOLOGY RECOMMENDATIONS
  1. Plain JavaScript objects/arrays with clear update lifecycle.
- NOTES
  1. Include particle cap safety.
- RELATED UC-004, UC-005, BR-010, BR-014, BR-020, AR-004, AR-005

PT-004 : Input and tool controller
- DESCRIPTION
  1. Pointer and UI events mapped to active tool actions.
- TECHNOLOGY RECOMMENDATIONS
  1. Canvas pointer events and toolbar button handlers.
- NOTES
  1. Prevent accidental mode ambiguity.
- RELATED UC-002, UC-003, BR-004, BR-007, AR-003

PT-005 : Physics integrator
- DESCRIPTION
  1. Computes forces, integrates velocity/position, applies damping and bounds.
- TECHNOLOGY RECOMMENDATIONS
  1. Fixed-step Euler/semi-implicit integration with force clamps.
- NOTES
  1. Keep dt small and stable.
- RELATED UC-005, BR-012, BR-013, BR-014, AR-002, AR-005

PT-006 : Barrier collision and erase engine
- DESCRIPTION
  1. Handles line-segment bounce and erase hit-testing.
- TECHNOLOGY RECOMMENDATIONS
  1. Segment math utilities and reflection vector calculation.
- NOTES
  1. Configure bounce damping via UI.
- RELATED UC-003, BR-008, BR-009, BR-016, AR-006

PT-007 : Probe spawn and annihilation manager
- DESCRIPTION
  1. Spawns particles from negative probes and removes particles at positive probes.
- TECHNOLOGY RECOMMENDATIONS
  1. Spawn accumulators per probe and distance-based capture checks.
- NOTES
  1. Respect global particle cap.
- RELATED UC-004, UC-006, BR-010, BR-011, BR-015, AR-004, AR-007

PT-008 : Runtime controls and metrics HUD
- DESCRIPTION
  1. Control bindings and live statistics panel synchronized with simulation state.
- TECHNOLOGY RECOMMENDATIONS
  1. Input event listeners updating config and animation-loop HUD refresh.
- NOTES
  1. Show active tool and entity counts.
- RELATED UC-007, UC-008, BR-017, AR-008, AR-009

PT-009 : Build packaging artifact
- DESCRIPTION
  1. Final static web app output under ./build.
- TECHNOLOGY RECOMMENDATIONS
  1. Include index.html, styles.css, app.js, optional assets.
- NOTES
  1. Browser loads app without server-side runtime logic.
- RELATED UC-009, BR-019, AR-010
