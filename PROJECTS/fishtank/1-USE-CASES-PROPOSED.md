# Proposed Use Cases

> Stage 0 advisory. Does not trigger the pipeline until promoted to 1-USE-CASES.md.

---

## UC-001 : USER — VIEW IMMERSIVE AQUARIUM SCENE

- **GOAL:** Experience a calming, visually rich virtual fish tank with realistic underwater ambiance.
- **STEPS:**
  1. User opens the Fish Tank Simulator.
  2. System loads the tank, lighting, water effects, and background ambiance.
  3. User observes fish, plants, particles, and environmental animations.
- **ACCEPTANCE CRITERIA:**
  - AC1: The scene renders at a responsive layout with a minimum supported viewport of 1280x720.
  - AC2: The scene includes visible underwater lighting effects (for example caustics or light diffusion).
  - AC3: UI overlay is present and does not obstruct the primary tank view.
- **NOTES:** Constraint: Visual output must prioritize immersion and readability. Caveat: Exact engine choice is implementation-stage scope.
- **RELATED:** UC-002, UC-003.

---

## UC-002 : USER — CONFIGURE VIEW MODE AND PRESENTATION

- **GOAL:** Choose a preferred camera/view style and presentation options for comfortable viewing.
- **STEPS:**
  1. User opens view or settings controls.
  2. User selects static isometric or 3/4 camera mode.
  3. User adjusts available presentation settings (for example audio on/off).
- **ACCEPTANCE CRITERIA:**
  - AC1: User can switch between at least two camera modes without restarting the app.
  - AC2: The selected camera mode applies immediately to the tank scene.
  - AC3: Audio ambiance can be enabled or disabled by the user.
- **NOTES:** Constraint: Controls must be discoverable in the interface. Caveat: Advanced camera customization is out of scope.
- **RELATED:** UC-001.

---

## UC-003 : USER — CUSTOMIZE TANK ENVIRONMENT

- **GOAL:** Configure tank dimensions, substrate, and decorative environment to create a preferred aquarium layout.
- **STEPS:**
  1. User opens environment configuration.
  2. User selects tank size and substrate type.
  3. User applies decorative and structural options (for example shipwreck, artifacts, rocks).
  4. System updates the tank scene to match selections.
- **ACCEPTANCE CRITERIA:**
  - AC1: User can select at least one substrate option and see it reflected in the scene.
  - AC2: User can enable decorative structures and observe their placement in the tank.
  - AC3: The configured environment persists for the active session.
- **NOTES:** Constraint: Decorations must remain within tank boundaries. Caveat: Full freeform placement precision is not required in this version.
- **RELATED:** UC-001, UC-004, UC-005.

---

## UC-004 : USER — OBSERVE DYNAMIC WATER PHYSICS

- **GOAL:** See convincing water motion and interactions that respond to fish, bubbles, and particles.
- **STEPS:**
  1. User views the active tank scene.
  2. Fish swim and bubbler emits bubbles.
  3. System simulates currents, ripples, and particle movement.
- **ACCEPTANCE CRITERIA:**
  - AC1: Bubble streams visibly rise and pop near the water surface.
  - AC2: At least one dynamic water response (ripples, currents, or particle drift) is visible during simulation.
  - AC3: Plant motion reflects water movement in real time.
- **NOTES:** Constraint: Motion must be continuous and visually coherent. Caveat: Scientific-grade fluid accuracy is out of scope.
- **RELATED:** UC-001, UC-005, UC-010.

---

## UC-005 : USER — SEE DIVERSE FISH SPECIES AND BEHAVIORS

- **GOAL:** Observe multiple fish species with distinct visual traits and movement behaviors.
- **STEPS:**
  1. User starts a new simulation session.
  2. System populates the tank with a compatible species mix.
  3. User observes fish swimming patterns and interactions over time.
- **ACCEPTANCE CRITERIA:**
  - AC1: Simulation initializes with a population within configured limits.
  - AC2: At least three distinct movement styles are observable across fish.
  - AC3: Fish avoid static obstacles (for example decorations or tank walls) during movement.
- **NOTES:** Constraint: Population composition must avoid incompatible predator-prey combinations. Caveat: Breeding and mortality are out of scope for current version.
- **RELATED:** UC-003, UC-004, UC-006.

---

## UC-006 : USER — FEED FISH THROUGH INTERACTIVE INPUT

- **GOAL:** Provide food to fish using direct interactions and observe fish response.
- **STEPS:**
  1. User chooses a food type.
  2. User clicks or taps near the water surface to release food.
  3. System applies food particle behavior and fish feeding response.
  4. User repeats feeding within allowed limits.
- **ACCEPTANCE CRITERIA:**
  - AC1: Feeding action spawns visible food particles at or near input location.
  - AC2: Fish respond to available food by moving toward and consuming particles.
  - AC3: A cooldown or rate limit prevents feeding spam above configured threshold.
- **NOTES:** Constraint: Uneaten food must despawn after a bounded interval. Caveat: Nutritional simulation depth is out of scope.
- **RELATED:** UC-005, UC-007.

---

## UC-007 : USER — TRACK INDIVIDUAL FISH AND DECORATIONS

- **GOAL:** Interact with fish and decorations to get focus feedback and context information.
- **STEPS:**
  1. User clicks or taps a fish.
  2. System highlights or tracks the selected fish.
  3. User clicks a decoration item.
  4. System shows contextual tooltip or detail feedback.
- **ACCEPTANCE CRITERIA:**
  - AC1: Selecting a fish produces a clear visual selection state.
  - AC2: Selecting a decoration produces visible contextual information.
  - AC3: Selection updates when the user selects a different target.
- **NOTES:** Constraint: Interaction feedback must be visible without obscuring core scene content. Caveat: Deep encyclopedia content is not required.
- **RELATED:** UC-005, UC-006.

---

## UC-008 : USER — EXPERIENCE RESPONSIVE PERFORMANCE

- **GOAL:** Use the simulator smoothly across supported hardware tiers and resolutions.
- **STEPS:**
  1. User runs the simulator on supported hardware.
  2. System renders graphics, simulation, and UI continuously.
  3. User performs normal interactions (camera/view changes, feeding, selection).
- **ACCEPTANCE CRITERIA:**
  - AC1: System targets 60 FPS on modern hardware during normal operation.
  - AC2: System maintains at least 30 FPS on lower-end supported hardware during normal operation.
  - AC3: Scene remains functional across the specified responsive resolution range up to 4K.
- **NOTES:** Constraint: Performance requirements are part of release acceptance criteria. Caveat: Extreme stress beyond documented limits is out of scope.
- **RELATED:** UC-001, UC-004, UC-005.

---

## UC-009 : USER — OBSERVE PLANT AND DECOR MOTION DYNAMICS

- **GOAL:** See plants and environmental particles react naturally to currents and disturbances.
- **STEPS:**
  1. User observes the tank over time.
  2. Fish, bubbles, and user actions introduce movement disturbances.
  3. System updates plant sway and particle drift/settling.
- **ACCEPTANCE CRITERIA:**
  - AC1: Plant elements visibly sway in relation to local water movement.
  - AC2: At least one particle class (dust, sediment, or food debris) shows drift and settling behavior.
  - AC3: Disturbances produce observable temporary motion changes that dampen over time.
- **NOTES:** Constraint: Visual dynamics must remain stable and not jitter excessively. Caveat: Botanical growth realism is visual-only in this version.
- **RELATED:** UC-003, UC-004.

---

## UC-010 : USER — EXPERIENCE BUBBLER-DRIVEN WATER EFFECTS

- **GOAL:** Observe a configurable bubbler that contributes both visual ambiance and localized current behavior.
- **STEPS:**
  1. User enables or configures the bubbler.
  2. System emits bubbles with variable sizes and rates.
  3. Bubbles rise, drift, and pop at the surface while influencing nearby water motion.
- **ACCEPTANCE CRITERIA:**
  - AC1: Bubble emission rate can be configured within defined bounds.
  - AC2: Bubble size variation is visually observable during runtime.
  - AC3: Localized current effects around bubbler output are visible in nearby particles or plant movement.
- **NOTES:** Constraint: Bubble simulation must remain performant under maximum configured rate. Caveat: Bubble-fish physical collisions are visual-only.
- **RELATED:** UC-004, UC-009.

---

## UC-011 : USER — USE MOBILE-FRIENDLY TOUCH INTERACTIONS

- **GOAL:** Interact with the aquarium on touch devices with responsive controls.
- **STEPS:**
  1. User opens the simulator on a touch-capable device.
  2. User performs touch actions such as tap, drag, and pinch.
  3. System responds with corresponding visual and interaction behavior.
- **ACCEPTANCE CRITERIA:**
  - AC1: Tap interaction can trigger fish/decor selection or feeding input.
  - AC2: Drag interaction can move food release location across the tank surface.
  - AC3: Pinch gesture adjusts zoom level where mobile zoom is supported.
- **NOTES:** Constraint: Touch feedback should be immediate and visible. Caveat: Full parity with desktop input shortcuts is not required.
- **RELATED:** UC-002, UC-006, UC-007.

---

## UC-012 : USER — RUN A CALMING SESSION WITHOUT FAILURE

- **GOAL:** Enjoy a complete simulation session without crashes while core interactions and visuals remain available.
- **STEPS:**
  1. User starts a session and lets the simulation run for an extended period.
  2. User performs normal interactions (feeding, selection, view changes).
  3. System continues rendering and simulation without interruption.
- **ACCEPTANCE CRITERIA:**
  - AC1: Session remains interactive for the defined soak interval without crash or forced reload.
  - AC2: Core features (rendering, fish motion, interaction, and UI controls) remain available throughout the session.
  - AC3: No blocking error state prevents continued user interaction during normal usage.
- **NOTES:** Constraint: Stability evaluation uses normal usage patterns defined by test cases. Caveat: Network-disconnected operation behavior is unspecified in this goal.
- **RELATED:** UC-001, UC-005, UC-008.

---

## UC-013 : USER — OBSERVE PHOTOREALISTIC FISH AND TANK RENDERING

- **GOAL:** See fish and all tank elements rendered with photorealistic visual detail rather than stylised or cartoon graphics.
- **STEPS:**
  1. User opens the Fish Tank Simulator.
  2. System renders fish with scale texture, translucent fin membranes, and realistic eye highlights.
  3. System renders tank glass with light refraction at the water boundary and caustic light patterns on substrate and fish.
  4. Substrate material (gravel, sand, or planted bed) appears with depth-shaded surface texture.
- **ACCEPTANCE CRITERIA:**
  - AC1: Each fish species renders with visible scale texture, translucent fin membranes showing individual fin rays, and a specular eye highlight.
  - AC2: Tank glass produces visible light refraction distortion at the water-glass boundary, and the water surface shows animated caustic light patterns on the tank floor.
  - AC3: Substrate material appears with depth-varied shading and surface texture clearly observable at the standard tank-view distance.
- **NOTES:** Constraint: Photorealistic rendering must not drop frame rate below the UC-008 performance floor. Caveat: Ray-traced global illumination is not required; shader-based approximation is acceptable.
- **RELATED:** UC-001, UC-005, UC-008.

---

## UC-014 : USER — EXPERIENCE SPECIES-AUTHENTIC SWIMMING ANIMATIONS

- **GOAL:** Observe each fish species swimming with anatomically correct locomotion — the right fin movements, body wave patterns, and speed-state transitions specific to that species' swimming mode.
- **STEPS:**
  1. User observes the populated tank.
  2. Each fish species uses its species-appropriate locomotion mode during normal cruise swimming: labriform (pectoral-fin rowing with a near-still body, typical of reef fish such as angelfish and discus), subcarangiform (rear-half body undulation with tail beat, typical of schooling fish such as tetras and danios), or carangiform (stiff body with rapid rear-third and tail oscillation, typical of goldfish and cichlids).
  3. Fish transition between idle hover, cruise, and burst speed states with visually distinct changes in amplitude and frequency.
  4. When startled (for example by a cursor or nearby fish), the fish executes a C-start escape reflex.
  5. Fish fan pectoral fins outward when decelerating or hovering, and fold them during burst swimming.
- **ACCEPTANCE CRITERIA:**
  - AC1: At least two fish species render with biomechanically distinct locomotion modes (for example one labriform pectoral-rowing species and one subcarangiform body-undulating species), with correct fin coordination throughout swimming.
  - AC2: Each fish transitions visibly between idle, cruise, and burst states with body-wave amplitude and tail-beat frequency proportional to speed.
  - AC3: Fish execute a C-start escape response (sharp body bend to one side then rapid straightening into burst propulsion) when triggered by a close-proximity event such as cursor hover or a nearby fish.
  - AC4: Pectoral fins fan outward perpendicular to the body during deceleration and hover phases, and flatten against the body during burst swimming.
- **NOTES:** Constraint: Animation must loop smoothly without visible seams during continuous cruise. Caveat: Hydrodynamically accurate vortex wake simulation is out of scope; visual plausibility is the target.
- **RELATED:** UC-005, UC-008, UC-013.

---

## UC-015 : USER — OBSERVE PHOTOREALISTIC BOTTOM-DWELLING CRAB

- **GOAL:** See a photorealistic crab at the tank bottom that scuttles sideways, opens and closes its claws, and reacts to user interaction.
- **STEPS:**
  1. User views the active tank scene.
  2. A crab is visible on the substrate with detailed carapace, articulated legs, and claws.
  3. The crab periodically scuttles sideways using an alternating lateral leg gait (legs on one side step forward while the opposite side's legs push off in sequence).
  4. The crab's claws open and close on an idle animation cycle.
  5. When the user clicks or taps the crab, it raises its claws in a brief defensive display before returning to normal behavior.
- **ACCEPTANCE CRITERIA:**
  - AC1: The crab renders with a photorealistic carapace texture, independently jointed legs, and articulated claws visible at standard viewing distances.
  - AC2: The crab locomotes sideways across the substrate using an anatomically correct alternating leg gait.
  - AC3: The crab's claws open and close visibly on an idle cycle independent of locomotion.
  - AC4: Clicking or tapping the crab triggers a claw-raise defensive display animation that completes before the crab resumes idle behavior.
- **NOTES:** Constraint: The crab must remain within the substrate zone and not pass through tank walls or decorations. Caveat: Multiple crabs and crab-fish interaction physics are out of scope for this version.
- **RELATED:** UC-003, UC-005, UC-007, UC-013.

---

## UC-016 : USER — VIEW TANK IN CLEAN FRONT-WINDOW MODE

- **GOAL:** See the tank from directly in front with all UI controls hidden, as if looking through clean aquarium glass.
- **STEPS:**
  1. User activates the clean window mode from the main interface.
  2. System transitions to a front-facing view showing the full tank width and height with no UI chrome visible.
  3. The simulation continues running (fish swim, animations play) in window mode.
  4. User exits window mode using a minimal, unobtrusive control.
- **ACCEPTANCE CRITERIA:**
  - AC1: User can activate clean window mode without restarting the simulation and without more than two user interactions from the main view.
  - AC2: In window mode, all UI controls (menus, buttons, overlays) are hidden and the viewport shows only the tank scene in a front-facing orthographic or near-orthographic view.
  - AC3: The simulation continues running without pause or visual interruption during the transition into and out of window mode.
  - AC4: A minimal, unobtrusive exit control (for example a small corner icon or the Escape key) returns the user to the standard view without restarting the session.
- **NOTES:** Constraint: The front-facing view must render the full tank contents without clipping. Caveat: Window mode does not need to persist across page reloads.
- **RELATED:** UC-001, UC-002, UC-012.
