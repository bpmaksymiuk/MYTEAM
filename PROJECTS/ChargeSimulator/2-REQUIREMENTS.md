# ElectroFlow — Business Requirements

## BR-001 : System shall render a full-screen HTML canvas as the simulation workspace
- TESTABLE CONDITION: A `<canvas>` element fills the viewport on page load; no scroll bar appears.
- NOTES
- RELATED: UC-001
---

## BR-002 : System shall provide a toolbar with selectable tools: Emitter, Collector, Barrier, Delete
- TESTABLE CONDITION: Four distinct tool buttons are visible; the active tool is highlighted; clicking a button activates that tool.
- NOTES
- RELATED: UC-001, UC-002, UC-003, UC-004
---

## BR-003 : System shall place a negative-charge emitter at the canvas position the user clicks while the Emitter tool is active
- TESTABLE CONDITION: Clicking canvas with Emitter tool active creates an emitter icon at the click coordinates (±5 px).
- NOTES
- RELATED: UC-001
---

## BR-004 : System shall spawn negative charge particles continuously from each emitter at a configurable rate
- TESTABLE CONDITION: With spawn rate slider at default, at least 1 new particle is created per emitter per second; particle count increases over time.
- NOTES Spawn rate controlled by BR-012.
- RELATED: UC-001
---

## BR-005 : System shall place a positive-charge collector at the canvas position the user clicks while the Collector tool is active
- TESTABLE CONDITION: Clicking canvas with Collector tool active creates a collector icon at the click coordinates (±5 px).
- NOTES
- RELATED: UC-002
---

## BR-006 : System shall attract negative particles toward each collector using inverse-square Coulomb force
- TESTABLE CONDITION: A particle within 200 px of a collector accelerates toward it; trajectory curves visibly toward collector.
- NOTES Force magnitude configurable by BR-013.
- RELATED: UC-002
---

## BR-007 : System shall absorb a negative particle when it contacts a collector, increasing the collector's visual size or glow
- TESTABLE CONDITION: On contact, particle is removed; collector radius or CSS glow increases by a measurable step within 100 ms.
- NOTES
- RELATED: UC-002
---

## BR-008 : System shall draw a barrier line segment along the user's drag path while the Barrier tool is active
- TESTABLE CONDITION: Dragging from point A to B with Barrier tool draws a visible line between those coordinates.
- NOTES
- RELATED: UC-003
---

## BR-009 : System shall reflect negative particles off barrier surfaces elastically (angle of incidence = angle of reflection)
- TESTABLE CONDITION: A particle travelling at a 45° angle to a straight barrier reverses its perpendicular velocity component on contact; it does not pass through.
- NOTES
- RELATED: UC-003
---

## BR-010 : System shall remove the clicked emitter, collector, or barrier when the Delete tool is active
- TESTABLE CONDITION: Clicking an element with Delete tool removes it from the canvas within 100 ms; in-flight particles are unaffected.
- NOTES
- RELATED: UC-004
---

## BR-011 : System shall apply repulsion between negative particles using Coulomb's law
- TESTABLE CONDITION: Two particles placed in close proximity accelerate apart; velocity magnitude increases as they get closer.
- NOTES
- RELATED: UC-001
---

## BR-012 : System shall expose a spawn-rate slider that adjusts particle emission frequency in real time
- TESTABLE CONDITION: Moving slider to minimum produces ≤1 particle/s per emitter; moving to maximum produces ≥10 particles/s per emitter; change takes effect within one frame.
- NOTES
- RELATED: UC-005
---

## BR-013 : System shall expose a field-strength slider that scales Coulomb force magnitude in real time
- TESTABLE CONDITION: Doubling field-strength slider value visibly increases the curvature of particle trajectories near charges.
- NOTES
- RELATED: UC-005
---

## BR-014 : System shall expose a friction/damping slider that decelerates particles over time
- TESTABLE CONDITION: At maximum damping, a particle with no nearby forces decelerates to zero within 3 seconds; at zero damping it maintains constant speed.
- NOTES
- RELATED: UC-005
---

## BR-015 : System shall render a colour gradient or glow around each charge source when field visualisation is enabled
- TESTABLE CONDITION: Toggling field visualisation on produces a visible radial gradient or glow centred on each emitter and collector; toggling off removes it within one frame.
- NOTES
- RELATED: UC-006
---

## BR-016 : System shall render a fading ghost trail behind each particle when particle trails are enabled
- TESTABLE CONDITION: Each particle leaves a semi-transparent path showing its last ≥10 positions; trail opacity decreases toward the tail; disabling clears all trails within one frame.
- NOTES
- RELATED: UC-007
---

## BR-017 : System shall load a pre-built maze barrier layout when the user starts Maze Escape mode
- TESTABLE CONDITION: Selecting Maze Escape clears the canvas and renders a barrier maze with a labelled entrance emitter and exit collector.
- NOTES
- RELATED: UC-008
---

## BR-018 : System shall declare a win state in Maze Escape when all particles have been absorbed by the exit collector
- TESTABLE CONDITION: When particle count reaches zero and exit collector has absorbed ≥1 particle, a win overlay is shown with a completion time.
- NOTES
- RELATED: UC-008
---

## BR-019 : System shall place two fixed collectors and track particle equilibrium in Balance mode
- TESTABLE CONDITION: Starting Balance mode renders two collectors at opposing positions; a particle equilibrium zone indicator is visible.
- NOTES
- RELATED: UC-009
---

## BR-020 : System shall declare a failure state in Balance mode when particle count reaches zero
- TESTABLE CONDITION: When all particles are absorbed, a failure overlay is shown displaying the survival duration in seconds.
- NOTES
- RELATED: UC-009
---

## BR-021 : System shall spawn particles from a central emitter at an accelerating rate when Containment mode starts
- TESTABLE CONDITION: In Containment mode, particle count increases at a rate that visibly grows over 10 s; emitter spawn interval decreases over time.
- NOTES
- RELATED: UC-010
---

## BR-022 : System shall declare a failure state in Containment mode when any particle exits the canvas boundary
- TESTABLE CONDITION: When a particle's position exceeds canvas width or height, a failure overlay is shown with survival duration.
- NOTES
- RELATED: UC-010
---

## BR-023 : System shall save the full canvas state to localStorage when the user clicks Save
- TESTABLE CONDITION: After placing elements and clicking Save, refreshing the page and clicking Load on the saved slot restores the same elements at the same positions.
- NOTES State includes: emitter positions/rates, collector positions/strengths, barrier paths, slider values.
- RELATED: UC-011
---

## BR-024 : System shall support at least 3 named save slots
- TESTABLE CONDITION: Three save slots are displayed; saving to slot 1, 2, and 3 independently stores different states retrievable without overwriting each other.
- NOTES
- RELATED: UC-011
---

## BR-025 : System shall pause or scale simulation speed according to the Slow-Mo slider position
- TESTABLE CONDITION: At slider minimum the simulation is paused (particles do not move); at 50% particles move at half the default speed; at maximum particles move at normal speed.
- NOTES
- RELATED: UC-012
---

## BR-026 : System shall render a force-vector arrow on each particle when Force Vectors are enabled
- TESTABLE CONDITION: Each particle displays an arrow pointing in the direction of its net Coulomb force; arrow length is proportional to force magnitude; disabling removes arrows within one frame.
- NOTES
- RELATED: UC-013
---

## BR-027 : System shall display a live statistics panel showing particle count, total energy, collision rate, and active element count
- TESTABLE CONDITION: Statistics panel shows: integer particle count matching visible particles; a collision rate value that updates each second; a count of placed elements.
- NOTES
- RELATED: UC-014
---

## BR-028 : System shall switch canvas and particle rendering to a dark neon theme when Dark Mode is enabled
- TESTABLE CONDITION: Enabling Dark Mode changes canvas background to near-black; particles render with a neon glow effect; toggling off restores the default theme.
- NOTES
- RELATED: UC-015
---

## BR-029 : System shall play distinct audio cues for particle spawn, absorption, and barrier collision events
- TESTABLE CONDITION: After first user interaction, each event type (spawn, absorb, wall-hit) produces a unique audible sound; sounds do not play before user interaction (browser autoplay policy).
- NOTES Sound toggled independently from visuals.
- RELATED: UC-015
---

## BR-030 : System shall shift particle colour continuously from cool (blue) to warm (red) proportional to particle velocity
- TESTABLE CONDITION: A slow particle renders in a blue hue; the same particle after acceleration by a collector renders in a red/orange hue; colour interpolation is continuous.
- NOTES
- RELATED: UC-015
---
