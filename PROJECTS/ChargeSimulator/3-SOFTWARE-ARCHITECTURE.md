ARCHITECTURE:
- ARCHITECTURE ID: UC-01.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/styles.css, src/app.js
- TECHNOLOGY DECISIONS: Deliver as a single-page browser app using HTML5 Canvas and vanilla JavaScript.
- TRADEOFFS: Vanilla approach avoids build tooling but requires careful structure for maintainability.

ARCHITECTURE:
- ARCHITECTURE ID: UC-02.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Use an explicit placement mode and polarity selector to create static source/sink charges.
- TRADEOFFS: Mode-driven interaction is simple but requires clear visual state to avoid user confusion.

ARCHITECTURE:
- ARCHITECTURE ID: UC-03.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Represent barriers as line segments and resolve collisions with vector reflection against segment normals.
- TRADEOFFS: Segment-based collisions are efficient but can miss very high-speed tunneling edge cases.

ARCHITECTURE:
- ARCHITECTURE ID: UC-04.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Maintain per-source spawn timers that emit particles while simulation state is running.
- TRADEOFFS: Timer-accumulator logic is deterministic but sensitive to large frame-time spikes.

ARCHITECTURE:
- ARCHITECTURE ID: UC-05.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Apply sink capture radius checks each update step and remove captured particles.
- TRADEOFFS: Radius checks are fast but simplify annihilation to radial zones.

ARCHITECTURE:
- ARCHITECTURE ID: UC-06.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/app.js
- TECHNOLOGY DECISIONS: Bind spawn-rate range input to simulation config and recompute spawn intervals on input events.
- TRADEOFFS: Continuous slider updates are responsive but may increase update churn.

ARCHITECTURE:
- ARCHITECTURE ID: UC-07.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/app.js
- TECHNOLOGY DECISIONS: Compute net acceleration from static charges plus pairwise inter-particle repulsion with softening.
- TRADEOFFS: O(n^2) particle interactions limit max particle counts for smooth frame rates.

ARCHITECTURE:
- ARCHITECTURE ID: UC-08.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/app.js
- TECHNOLOGY DECISIONS: Expose simulation speed and force scale as live multipliers in the integration loop.
- TRADEOFFS: High multipliers can reduce physical realism and require damping safeguards.

ARCHITECTURE:
- ARCHITECTURE ID: UC-09.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/app.js
- TECHNOLOGY DECISIONS: Provide advanced controls for lifetime, damping, capture radius, and trails with a reset-to-default action.
- TRADEOFFS: Extra controls improve experimentation at the cost of UI complexity.

ARCHITECTURE:
- ARCHITECTURE ID: UC-10.BR-01.ARCH-01
- COMPONENTS AFFECTED: src/index.html, src/styles.css, src/app.js
- TECHNOLOGY DECISIONS: Use a dashboard layout with persistent status bar, highlighted active tool state, and live counters.
- TRADEOFFS: Rich styling improves engagement but adds visual tuning overhead.
