# Use Cases — Particle Physics Simulator

## UC-001 : End User - Simulate Particle Motion
- STEPS
  1. User opens the simulator in a browser.
  2. Particles appear on screen and move according to physical forces.
  3. User observes particle interactions including gravity, collisions, and electromagnetic forces.
- ACCEPTANCE CRITERIA
  1. At least 200 particles are rendered and moving on screen at launch.
  2. Particles respond to gravity (downward acceleration).
  3. Particles collide and bounce off each other and walls.
- NOTES: Core simulation loop.
- RELATED: (none)
---

## UC-002 : End User - Control Gravity
- STEPS
  1. User adjusts the gravity slider in the control panel.
  2. The simulation immediately updates particle behavior.
- ACCEPTANCE CRITERIA
  1. A slider labeled "Gravity" is visible in the control panel.
  2. Moving the slider changes the gravitational constant in real time (range: -50 to 50).
  3. Setting gravity to 0 causes particles to float freely.
- NOTES: Should support negative gravity (particles float upward).
- RELATED: UC-001
---

## UC-003 : End User - Control Particle Count
- STEPS
  1. User adjusts the "Particle Count" slider or input.
  2. Particles are added or removed from the simulation in real time.
- ACCEPTANCE CRITERIA
  1. A slider/input labeled "Particle Count" allows values from 1 to 1000.
  2. Increasing the count adds new particles immediately.
  3. Decreasing the count removes particles immediately.
- NOTES: Performance may degrade at high counts; document this.
- RELATED: UC-001
---

## UC-004 : End User - Control Particle Size
- STEPS
  1. User adjusts the "Particle Size" slider.
  2. All particles resize accordingly.
- ACCEPTANCE CRITERIA
  1. A slider labeled "Particle Size" allows values from 1px to 30px radius.
  2. Particle size updates in real time.
- NOTES: (none)
- RELATED: UC-001
---

## UC-005 : End User - Control Particle Speed (Initial Velocity)
- STEPS
  1. User adjusts the "Speed" slider.
  2. Newly spawned particles (or on reset) use the new speed setting.
- ACCEPTANCE CRITERIA
  1. A slider labeled "Speed" allows values from 0 to 20.
  2. Changing the value affects particle initial velocity magnitude.
- NOTES: Speed applies to newly created particles and on reset.
- RELATED: UC-001
---

## UC-006 : End User - Control Bounciness (Restitution)
- STEPS
  1. User adjusts the "Bounciness" slider.
  2. Collision behavior updates in real time.
- ACCEPTANCE CRITERIA
  1. A slider labeled "Bounciness" allows values from 0 (no bounce) to 1 (perfect elastic).
  2. Setting to 0 causes particles to stop on collision; setting to 1 causes full energy retention.
- NOTES: (none)
- RELATED: UC-001
---

## UC-007 : End User - Control Friction
- STEPS
  1. User adjusts the "Friction" slider.
  2. Particle velocity damping updates in real time.
- ACCEPTANCE CRITERIA
  1. A slider labeled "Friction" allows values from 0 (no friction) to 1 (maximum friction).
  2. Higher friction causes particles to slow down more quickly.
- NOTES: (none)
- RELATED: UC-001
---

## UC-008 : End User - Toggle Electromagnetic Forces
- STEPS
  1. User enables the "Electromagnetic" toggle in the control panel.
  2. Particles attract or repel each other based on assigned charge.
- ACCEPTANCE CRITERIA
  1. A toggle labeled "Electromagnetic Forces" is visible.
  2. When enabled, particles with opposite charges attract and same charges repel.
  3. When disabled, electromagnetic forces are not applied.
- NOTES: Charges are randomly assigned at spawn (positive or negative).
- RELATED: UC-001
---

## UC-009 : End User - Change Particle Color Mode
- STEPS
  1. User selects a color mode from a dropdown (e.g., Random, Speed-based, Charge-based, Single Color).
  2. Particles update their color immediately.
- ACCEPTANCE CRITERIA
  1. A dropdown labeled "Color Mode" is visible with at least 4 options.
  2. "Random" assigns each particle a random color.
  3. "Speed" colors particles from blue (slow) to red (fast).
  4. "Charge" colors positive particles red, negative particles blue.
  5. "Single Color" uses a color picker to set all particles to one color.
- NOTES: (none)
- RELATED: UC-001
---

## UC-010 : End User - Pause and Resume Simulation
- STEPS
  1. User clicks the "Pause" button.
  2. Simulation freezes; particles stop moving.
  3. User clicks "Resume" to continue.
- ACCEPTANCE CRITERIA
  1. A "Pause/Resume" button is visible.
  2. Clicking it toggles the simulation between running and paused states.
  3. Particle positions are preserved during pause.
- NOTES: (none)
- RELATED: UC-001
---

## UC-011 : End User - Reset Simulation
- STEPS
  1. User clicks the "Reset" button.
  2. All particles are re-spawned with current settings.
- ACCEPTANCE CRITERIA
  1. A "Reset" button is visible.
  2. Clicking it clears all particles and re-initializes with current control values.
- NOTES: (none)
- RELATED: UC-001
---

## UC-012 : End User - Add Particles by Clicking Canvas
- STEPS
  1. User clicks or drags on the canvas.
  2. New particles are spawned at the click/drag location.
- ACCEPTANCE CRITERIA
  1. Clicking on the canvas spawns particles at the pointer position.
  2. Dragging spawns a burst of particles along the drag path.
- NOTES: Spawned particles use current speed and size settings.
- RELATED: UC-001
---

## UC-013 : End User - View Live Statistics
- STEPS
  1. User observes the statistics panel.
  2. Live data updates in real time.
- ACCEPTANCE CRITERIA
  1. A stats panel shows: particle count, average speed, FPS.
  2. Values update at least once per second.
- NOTES: (none)
- RELATED: UC-001
---

## UC-014 : End User - Control Simulation Speed (Time Scale)
- STEPS
  1. User adjusts the "Time Scale" slider.
  2. Simulation runs faster or slower.
- ACCEPTANCE CRITERIA
  1. A slider labeled "Time Scale" allows values from 0.1x to 5x.
  2. Higher values speed up the simulation; lower values slow it down.
- NOTES: (none)
- RELATED: UC-001
---

## UC-015 : End User - Toggle Wall Boundaries
- STEPS
  1. User toggles "Wrap Edges" in the control panel.
  2. Particles either bounce off edges or wrap to the opposite side.
- ACCEPTANCE CRITERIA
  1. A toggle labeled "Wrap Edges" is visible.
  2. When enabled, particles that exit one side appear on the opposite side.
  3. When disabled, particles bounce off the canvas edges.
- NOTES: (none)
- RELATED: UC-001
---
