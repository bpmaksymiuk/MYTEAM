BUSINESS REQUIREMENT:
- BR ID: BR-01
- REQUIREMENT STATEMENT: The simulator shall run as a browser-based application using standard web assets from src without native installation.
- PRIORITY: High
- TESTABLE CONDITION: Opening src/index.html in a modern browser renders the full simulator interface and interactive controls.
- RELATED: UC-01

BUSINESS REQUIREMENT:
- BR ID: BR-02
- REQUIREMENT STATEMENT: The simulator shall allow placement and removal of positive and negative static charges on the canvas.
- PRIORITY: High
- TESTABLE CONDITION: User can place + and - nodes with pointer input and remove nodes with erase mode.
- RELATED: UC-02

BUSINESS REQUIREMENT:
- BR ID: BR-03
- REQUIREMENT STATEMENT: The simulator shall support drawn barriers and collision-enabled background image obstacles that reflect moving particles.
- PRIORITY: High
- TESTABLE CONDITION: Particles bounce off both user-drawn barrier segments and configured solid image regions.
- RELATED: UC-03

BUSINESS REQUIREMENT:
- BR ID: BR-04
- REQUIREMENT STATEMENT: The simulator shall spawn moving particles continuously from negative sources while running.
- PRIORITY: High
- TESTABLE CONDITION: With at least one negative source, active particle count increases over time in running state and pauses on pause.
- RELATED: UC-04

BUSINESS REQUIREMENT:
- BR ID: BR-05
- REQUIREMENT STATEMENT: The simulator shall remove moving particles when they enter positive sink capture radius and increment annihilation counters.
- PRIORITY: High
- TESTABLE CONDITION: Particle entering sink radius is removed once and annihilation count increments by exactly one.
- RELATED: UC-05

BUSINESS REQUIREMENT:
- BR ID: BR-06
- REQUIREMENT STATEMENT: The simulator shall expose a spawn-rate control that updates particle emission frequency during runtime.
- PRIORITY: Medium
- TESTABLE CONDITION: Slider changes visibly alter particle emission cadence without reload.
- RELATED: UC-06

BUSINESS REQUIREMENT:
- BR ID: BR-07
- REQUIREMENT STATEMENT: The simulator shall apply Coulomb-like attraction and repulsion for source/sink interactions and inter-particle repulsion.
- PRIORITY: High
- TESTABLE CONDITION: Particle trajectories curve toward sinks, away from sources, and diverge in dense local clusters.
- RELATED: UC-07

BUSINESS REQUIREMENT:
- BR ID: BR-08
- REQUIREMENT STATEMENT: The simulator shall allow runtime tuning of simulation speed and charge strength.
- PRIORITY: Medium
- TESTABLE CONDITION: Speed and strength controls immediately modify trajectory progression and force magnitude while running.
- RELATED: UC-08

BUSINESS REQUIREMENT:
- BR ID: BR-09
- REQUIREMENT STATEMENT: The simulator shall include advanced options for damping, capture radius, trails visibility, and reset defaults.
- PRIORITY: Medium
- TESTABLE CONDITION: Advanced controls mutate behavior, enforce valid bounds, and reset to documented defaults.
- RELATED: UC-09

BUSINESS REQUIREMENT:
- BR ID: BR-10
- REQUIREMENT STATEMENT: The simulator shall provide intuitive state visibility for active tools, run state, counters, and guidance messaging.
- PRIORITY: Medium
- TESTABLE CONDITION: Tool highlights, run/pause state text, and contextual warnings update within one second of user actions.
- RELATED: UC-10

BUSINESS REQUIREMENT:
- BR ID: BR-11
- REQUIREMENT STATEMENT: The simulator shall save selected background image plus collision-mask settings as named reusable presets.
- PRIORITY: High
- TESTABLE CONDITION: Saving a background preset persists image + mask config and survives page refresh.
- RELATED: UC-11

BUSINESS REQUIREMENT:
- BR ID: BR-12
- REQUIREMENT STATEMENT: The simulator shall load saved background presets and immediately apply obstacle collisions from loaded settings.
- PRIORITY: High
- TESTABLE CONDITION: Loading preset restores image and mask config, then particles bounce from loaded solid regions during simulation.
- RELATED: UC-12
