BUSINESS REQUIREMENT:
- BR ID: UC-01.BR-01
- REQUIREMENT STATEMENT: The product shall run as a browser-based web application using standard web technologies without native installation.
- PRIORITY: HIGH
- TESTABLE CONDITION: Opening src/index.html in a modern Chromium-based browser loads the simulator UI without runtime errors, with core controls visible at viewport widths of 375px and 1280px.

BUSINESS REQUIREMENT:
- BR ID: UC-02.BR-01
- REQUIREMENT STATEMENT: The user shall be able to place positive and negative charges on the simulation canvas.
- PRIORITY: HIGH
- TESTABLE CONDITION: In Place Charge mode, selecting + or - and clicking the canvas creates a visible node of matching polarity; 20 placements in one session remain responsive.

BUSINESS REQUIREMENT:
- BR ID: UC-03.BR-01
- REQUIREMENT STATEMENT: The user shall be able to draw and erase barriers, and moving charges shall bounce from these barriers.
- PRIORITY: HIGH
- TESTABLE CONDITION: Drawing a barrier segment causes particle reflection at contact and erase mode removes nearby segments; behavior remains stable at 0.5x, 1.0x, and 2.0x simulation speed.

BUSINESS REQUIREMENT:
- BR ID: UC-04.BR-01
- REQUIREMENT STATEMENT: Negative source charges shall spawn moving particles continuously while simulation is running.
- PRIORITY: HIGH
- TESTABLE CONDITION: With at least one negative source, particles spawn repeatedly while running, stop within one second after pause, and resume after returning to running.

BUSINESS REQUIREMENT:
- BR ID: UC-05.BR-01
- REQUIREMENT STATEMENT: Moving particles shall be annihilated when they enter the positive sink capture radius.
- PRIORITY: HIGH
- TESTABLE CONDITION: A particle entering capture radius is removed from active count and increments annihilation count exactly once.

BUSINESS REQUIREMENT:
- BR ID: UC-06.BR-01
- REQUIREMENT STATEMENT: A spawn-rate slider shall control how frequently particles are emitted from negative sources.
- PRIORITY: MEDIUM
- TESTABLE CONDITION: Raising slider value increases observed emission frequency, lowering value decreases it, and changes apply during runtime without reload.

BUSINESS REQUIREMENT:
- BR ID: UC-07.BR-01
- REQUIREMENT STATEMENT: Particle motion shall follow Coulomb-like interactions: attracted to positives, repelled by negatives, with inter-particle repulsion.
- PRIORITY: HIGH
- TESTABLE CONDITION: In mixed-polarity scenes, particles trend toward + and away from -, nearby particles diverge due to inter-particle repulsion, and default 60-second run remains numerically stable.

BUSINESS REQUIREMENT:
- BR ID: UC-08.BR-01
- REQUIREMENT STATEMENT: The UI shall provide runtime controls for simulation speed and charge strength.
- PRIORITY: MEDIUM
- TESTABLE CONDITION: Increasing simulation speed accelerates trajectory progression, increasing charge strength increases force-driven curvature, and both changes apply without clearing scene state.

BUSINESS REQUIREMENT:
- BR ID: UC-09.BR-01
- REQUIREMENT STATEMENT: The UI shall provide additional configurable simulation options and reset behavior.
- PRIORITY: MEDIUM
- TESTABLE CONDITION: Particle lifetime, damping, capture radius, and trails controls are editable, produce observable behavior change, and reset action restores default values.

BUSINESS REQUIREMENT:
- BR ID: UC-10.BR-01
- REQUIREMENT STATEMENT: The interface shall be intuitive and engaging with clear feedback for mode selection and simulation state.
- PRIORITY: MEDIUM
- TESTABLE CONDITION: Active tool mode, run or pause state, and counters update within one second of interaction; running without a negative source shows a guidance message.
