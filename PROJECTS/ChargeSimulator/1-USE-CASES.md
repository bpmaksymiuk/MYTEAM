# ElectroFlow — Use Cases

## UC-001 : End User - Place Negative Charge Emitter
- STEPS
  1. User selects the "Emitter" tool from the toolbar.
  2. User clicks a position on the canvas.
  3. A negative charge emitter ("−") appears at that position.
  4. The emitter continuously spawns negative charge particles at the configured spawn rate.
- ACCEPTANCE CRITERIA
  1. An emitter icon is rendered at the clicked canvas position.
  2. Negative particles begin spawning from the emitter immediately after placement.
  3. Multiple emitters can be placed; each emits independently.
- NOTES
  Emitters are always active unless deleted. Spawn rate is controlled by UC-005.
- RELATED
---

## UC-002 : End User - Place Positive Charge Collector
- STEPS
  1. User selects the "Collector" tool from the toolbar.
  2. User clicks a position on the canvas.
  3. A positive charge collector ("+") appears at that position.
  4. The collector attracts nearby negative particles and absorbs them.
  5. The collector grows in size/intensity as it absorbs particles.
- ACCEPTANCE CRITERIA
  1. A collector icon is rendered at the clicked canvas position.
  2. Negative particles within attraction range are visibly pulled toward the collector.
  3. Upon absorption, the collector increases in visual radius or glow intensity.
  4. Multiple collectors can be placed simultaneously.
- NOTES
  Collector strength level is selectable at placement time (UC-005).
- RELATED UC-001
---

## UC-003 : End User - Draw Barrier
- STEPS
  1. User selects the "Barrier" tool from the toolbar.
  2. User clicks and drags on the canvas to draw a wall segment.
  3. The barrier is rendered as a solid line.
  4. Negative particles bounce off the barrier elastically upon contact.
- ACCEPTANCE CRITERIA
  1. A visible barrier line is drawn along the drag path.
  2. Particles collide with and reflect off the barrier without passing through.
  3. Multiple barriers can be drawn in the same session.
  4. Barriers persist until deleted.
- NOTES
  Mirror Barrier variant reflects at angle (optical-style). Standard barriers reflect elastically.
- RELATED
---

## UC-004 : End User - Delete Canvas Element
- STEPS
  1. User selects the "Delete" tool from the toolbar.
  2. User clicks on an existing emitter, collector, or barrier.
  3. The selected element is removed from the canvas.
- ACCEPTANCE CRITERIA
  1. The clicked element is removed immediately from the canvas.
  2. Particles already in flight are unaffected by the deletion.
  3. No crash or visual artefact remains after deletion.
- NOTES
- RELATED UC-001, UC-002, UC-003
---

## UC-005 : End User - Adjust Physics Parameters
- STEPS
  1. User locates the physics control panel (sidebar or overlay).
  2. User adjusts one or more sliders: spawn rate, collector strength, field strength, friction/damping.
  3. The simulation updates in real time to reflect the new values.
- ACCEPTANCE CRITERIA
  1. Spawn rate slider changes how frequently new particles are emitted.
  2. Field strength slider changes the magnitude of attraction/repulsion forces.
  3. Friction/damping slider affects particle deceleration.
  4. Changes take effect within one animation frame after slider release.
- NOTES
  Charge magnitude may also be adjusted per emitter/collector.
- RELATED UC-001, UC-002
---

## UC-006 : End User - View Electrostatic Field Visualisation
- STEPS
  1. User toggles the "Field Visualisation" option in the control panel.
  2. The canvas shows a colour gradient or aura/glow around charges.
  3. User toggles the option off to hide the visualisation.
- ACCEPTANCE CRITERIA
  1. When enabled, a smooth colour gradient or glow is rendered around each charge source.
  2. The gradient represents the direction and magnitude of the electrostatic field.
  3. Toggling off removes the visualisation without affecting particle behaviour.
- NOTES
- RELATED UC-001, UC-002
---

## UC-007 : End User - Toggle Particle Trails
- STEPS
  1. User enables "Particle Trails" in the control panel.
  2. Moving particles leave a ghost trail showing their recent path.
  3. User disables the option to clear trails.
- ACCEPTANCE CRITERIA
  1. Each particle renders a semi-transparent trail of its last N positions.
  2. Trail fades out over time (not permanently drawn).
  3. Disabling trails removes all trail rendering immediately.
- NOTES
- RELATED UC-001
---

## UC-008 : End User - Play Maze Escape Challenge
- STEPS
  1. User selects "Maze Escape" from the Challenge Modes menu.
  2. A pre-built barrier maze is loaded onto the canvas.
  3. A set of emitters spawns particles at the maze entrance.
  4. User may add/move collectors and barriers to guide all particles to the exit collector.
  5. Challenge ends when all particles have been absorbed by the exit collector.
- ACCEPTANCE CRITERIA
  1. A maze layout with an entrance and exit is rendered on start.
  2. Particles spawn at the entrance emitter.
  3. A win state is declared when all particles reach the exit collector.
  4. Score or completion time is displayed on win.
- NOTES
  At least one initial maze layout must be included.
- RELATED UC-001, UC-002, UC-003
---

## UC-009 : End User - Play Balance Challenge
- STEPS
  1. User selects "Balance" from the Challenge Modes menu.
  2. Two collectors are placed at opposing positions.
  3. Particles must be kept suspended in equilibrium between the collectors.
  4. Challenge fails if all particles are absorbed by either collector.
- ACCEPTANCE CRITERIA
  1. Two collectors are rendered at fixed positions on challenge start.
  2. A particle equilibrium zone is visually indicated.
  3. A failure state is declared when particle count reaches zero.
  4. Duration survived is displayed as score.
- NOTES
- RELATED UC-002, UC-005
---

## UC-010 : End User - Play Containment Challenge
- STEPS
  1. User selects "Containment" from the Challenge Modes menu.
  2. A central emitter begins spawning particles at increasing rate.
  3. User draws barriers to contain the particle cloud within the canvas bounds.
  4. Challenge fails when any particle exits the canvas boundary.
- ACCEPTANCE CRITERIA
  1. Central emitter spawns at an accelerating rate.
  2. User can draw barriers in real time while particles are active.
  3. A failure state is declared when a particle exits the canvas.
  4. Duration contained is displayed as score.
- NOTES
- RELATED UC-001, UC-003
---

## UC-011 : End User - Save and Load Configuration
- STEPS
  1. User clicks "Save" in the toolbar.
  2. The current canvas state (emitters, collectors, barriers, physics settings) is saved as a named template.
  3. User clicks "Load" and selects a saved template.
  4. The saved state is restored to the canvas.
- ACCEPTANCE CRITERIA
  1. Save persists at least: emitter positions, collector positions, barrier paths, slider values.
  2. Load clears the current canvas and restores the saved state exactly.
  3. At least 3 save slots are supported.
- NOTES
  Storage via localStorage is acceptable for a browser-only implementation.
- RELATED UC-001, UC-002, UC-003, UC-005
---

## UC-012 : End User - Control Simulation Speed
- STEPS
  1. User adjusts the "Slow-Mo" slider in the control panel.
  2. Moving the slider toward minimum pauses or slows the simulation.
  3. Moving the slider toward maximum runs the simulation at normal or fast speed.
- ACCEPTANCE CRITERIA
  1. At minimum position the simulation is paused (0 speed).
  2. At mid position particles move at approximately half normal speed.
  3. At maximum position particles move at normal speed.
  4. Physics and rendering remain stable at all slider positions.
- NOTES
- RELATED
---

## UC-013 : End User - Toggle Force Vector Overlay
- STEPS
  1. User enables "Force Vectors" in the control panel.
  2. Small arrows appear on each particle indicating direction and magnitude of net force.
  3. User disables Force Vectors to hide the overlay.
- ACCEPTANCE CRITERIA
  1. Each particle displays an arrow whose direction matches the net Coulomb force.
  2. Arrow length scales with force magnitude.
  3. Disabling the overlay removes all arrows immediately.
- NOTES
- RELATED UC-001, UC-002
---

## UC-014 : End User - View Statistics Panel
- STEPS
  1. User opens the Statistics Panel from the toolbar or control panel.
  2. Panel displays: live particle count, total energy, collision rate, active element count.
  3. Statistics update in real time while the simulation runs.
- ACCEPTANCE CRITERIA
  1. Particle count reflects the current number of particles on canvas.
  2. Collision rate shows number of collisions per second (last 1 s window).
  3. Panel can be opened/closed without affecting simulation.
- NOTES
- RELATED
---

## UC-015 : End User - Visual and Audio Polish
- STEPS
  1. User enables "Dark Mode" in the control panel.
  2. Canvas background switches to dark; particles rendered with neon glow.
  3. User enables "Sound Effects".
  4. Particle events (spawn, absorb, collide) play distinct audio cues.
  5. Particle colour shifts according to velocity (blue=slow, red=fast).
- ACCEPTANCE CRITERIA
  1. Dark mode toggle switches background and particle rendering style.
  2. Sound effects play on: particle absorbed by collector, particle-barrier collision, emitter spawn.
  3. Particle hue shifts continuously from cool to warm as velocity increases.
  4. All toggles are independent of each other.
- NOTES
  Sound effects must respect browser autoplay policy (triggered by first user interaction).
- RELATED
---
