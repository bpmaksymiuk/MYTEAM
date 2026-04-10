# Goal

ElectroFlow: An Interactive Charge Simulator
Core Mechanics
Negative Charge Emitters ("−" particles): Continuously spawn negative charges that repel each other and bounce off barriers
Positive Charge Collectors ("+""): Attract negative charges and absorb them, growing in size/intensity as they consume charges
Barriers: User-drawn walls that particles bounce off elastically
Electrostatic Field Visualization: Optional aura/glow showing the invisible force field around charges
Interactive Features
Placement Tools:

Click to place emitters (spawn rate adjustable via slider)
Click to place collectors (with different "strength" levels)
Drag to draw barriers (straight lines, curves, polygons)
Delete tool to remove any element
Physics Sandbox:

Real-time Coulomb force calculations with configurable charge magnitude
Adjustable friction/damping for particle behavior
Variable field strength slider to make repulsion/attraction stronger or weaker
Particle trail visualization (optional ghost paths showing recent movement)
Fun Twists
Challenge Modes:

"Maze Escape": Guide all particles through a barrier maze to reach a collector
"Balance": Keep particles suspended in equilibrium between two collectors
"Containment": Draw barriers to trap an expanding charge cloud before it escapes the canvas
Particle Behaviors:

Particles gain speed over time as they're repelled (momentum building)
Collectors "pulse" when feeding, creating waves in the field
Add rare "neutral gray particles" (no charge) that just bounce around—fun visual noise
Advanced Interactions:

Mirror Barriers: Reflect particles at angles (optical-style physics)
Energy Drain: Collectors slowly weaken unless fed regularly
Chain Reactions: When a collector gets full, it explosively repels all nearby particles
Temporary Charges: Place time-limited charges that fade away
Visual Polish:

Particle colors shift based on velocity/energy
Smooth field gradients showing potential energy regions
Sound effects (zaps, pings, whooshes) for particle interactions
Dark mode with neon glowing particles
Sandbox Tools:

Save/Load: Store particle configurations as templates
Slow-Mo Slider: Pause/slow time to observe forces in detail
Force Vectors: Toggle tiny arrows showing the direction/magnitude of forces
Statistics Panel: Track particle count, energy, collision rate, etc.
Educational Elements
Real Coulomb's law formula displayed: F = k(q₁q₂)/r²
Toggle to show force magnitude numbers between particles
"Lessons" mode with guided challenges teaching physics concepts
Particle inspector: hover over a charge to see its properties (q, v, acceleration)
Sharing & Community
Export configurations as shareable URLs
Gallery of user-created "sculptures" (stable patterns)
Leaderboards for challenge modes
This would be a mesmerizing blend of education + toy-like fun—users could spend hours creating chaotic patterns or hunting for stable equilibrium states. The visual feedback is inherently satisfying, and the physics feel "magical" even though it's pure math.

TECH NOTES: web-based implementation (Canvas/WebGL), 
set up the physics engine,optimize for performance with many particles, and design an intuitive UI for drawing barriers and placing charges. Potential libraries: Matter.js for physics, D3.js for field visualization, and a custom canvas renderer for particles.
---

## Tasks

- Generate use cases in `1-USE-CASES-PROPOSED.md`
