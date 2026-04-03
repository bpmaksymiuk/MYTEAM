RELEASE-NOTES:
- Version ID
  PT-REL-2026-04-03-001
- Summary of features implemented
  1. Implemented browser-based Coulomb simulator in ./build with interactive canvas and futuristic UI.
  2. Added tools for placing + and - probes, drawing barriers, and erasing barriers.
  3. Added runtime controls for simulation speed, charge strength, spawn rate, damping, and particle cap.
  4. Implemented charge spawning at negative probes, Coulomb-like attraction/repulsion, inter-particle repulsion, barrier bounce, and annihilation at positive probes.
  5. Added HUD metrics for active tool and live entity counts.
- Notes
  1. Implemented DI scope for this run: DI-001 through DI-010.
  2. Build files:
     - build/index.html
     - build/styles.css
     - build/app.js
  3. Runtime caveat: verification in this pipeline run is source/artifact-based; no browser automation suite was executed.
