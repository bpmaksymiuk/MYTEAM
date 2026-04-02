RELEASE-NOTES:
- Version ID: v0.1.3
- Summary of features implemented:
  - Reworked barrier and obstacle collision resolution to rewind particles to a last-safe position before reflection, removing remaining wall leakage.
  - Added segment-sweep detection for image obstacles so collisions trigger along full movement paths, not only at final sample points.

RELEASE-NOTES:
- Version ID: v0.1.2
- Summary of features implemented:
  - Strengthened barrier collision reliability by integrating particle movement in substeps per frame and checking collisions at each substep.
  - Eliminated remaining fast-path tunneling cases where particles could still skip barrier contact during larger frame deltas.

RELEASE-NOTES:
- Version ID: v0.1.1
- Summary of features implemented:
  - Fixed barrier collision reliability so fast-moving particles no longer tunnel through thin barriers by adding swept path-to-segment intersection checks.
  - Improved barrier drawing completion when mouse release occurs off-canvas by finalizing draw on global mouse-up and canvas leave.

RELEASE-NOTES:
- Version ID: v0.1.0
- Summary of features implemented:
  - Implemented browser-based Charge Simulator UI in src/index.html and src/styles.css.
  - Added tool modes for placing positive and negative charges, drawing barriers, and erasing.
  - Added simulation runtime loop with continuous spawning from negative sources, sink annihilation, and live counters.
  - Implemented Coulomb-like force updates and inter-particle repulsion with speed and strength controls.
  - Added advanced controls for damping, capture radius, trails, image collision threshold, and reset defaults.
  - Added background image loading, obstacle mask generation, and particle bounce collisions against image-defined solids.
  - Added background preset save/load with named localStorage entries including image data URL and mask threshold.
  - Added responsive control panel with run/pause, clear particles, and reset all actions.
