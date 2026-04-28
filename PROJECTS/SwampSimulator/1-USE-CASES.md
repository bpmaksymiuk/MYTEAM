# Use Cases: SwampSimulator — Interactive Wetland Ecosystem

## UC-001 : USER - OBSERVE THE LIVE SWAMP ECOSYSTEM CANVAS
- STEPS
  1. The user opens the application in a web browser.
  2. The main canvas loads showing a 2D top-down swamp environment with water channels, mudbanks, lily pads, and cypress trees.
  3. Organism sprites — frogs, herons, fish, dragonflies, turtles, and others — appear and move autonomously across the canvas.
  4. The user scrolls and pans the canvas to explore different zones of the swamp.
  5. The simulation runs continuously with organisms eating, reproducing, and dying in real time.
  6. Population numbers update visibly as the ecosystem self-regulates.
- ACCEPTANCE CRITERIA
  1. The canvas must load and display a populated swamp environment within 3 seconds on a standard connection.
  2. At least one organism from each trophic level (producer, primary consumer, secondary consumer, apex predator, decomposer) must be visible on load.
  3. Organisms must move autonomously without player input and must visibly pursue prey or flee from predators.
  4. The canvas must be scrollable and pannable without loss of simulation state.
  5. Simulation must run at a minimum of 30 FPS with the baseline organism population.
- NOTES
  - The ecosystem must run without any player intervention; interaction is optional, not required for the simulation to function.
- RELATED
  - UC-002, UC-012, UC-013
---

## UC-002 : USER - INSPECT A SPECIES AND VIEW ITS ECOSYSTEM ROLE
- STEPS
  1. The user clicks on any visible organism sprite on the canvas.
  2. The Species Inspector panel opens, displaying the organism's common name, trophic level, current population count, and a written description of its ecological role.
  3. The panel lists the organism's prey (what it eats) and its predators (what eats it) as clickable links.
  4. The user clicks a linked predator species name.
  5. The view scrolls to the nearest instance of that predator on the canvas and the Species Inspector updates to show that predator's information.
  6. The user closes the inspector by clicking outside the panel.
- ACCEPTANCE CRITERIA
  1. Clicking any organism must open the Species Inspector within 200 ms.
  2. The inspector must display: common name, trophic level, current population, ecological role description, prey list, and predator list.
  3. All prey and predator entries in the inspector must be clickable and navigate to that species' inspector data.
  4. The current population count displayed must match the live agent count in the simulation at the time of inspection.
  5. Closing the inspector must not pause or affect the simulation.
- NOTES
  - Species with zero current population (locally extinct) must still be inspectable from the Food Web Graph.
- RELATED
  - UC-001, UC-003
---

## UC-003 : USER - VIEW THE FOOD WEB GRAPH AND TRACE A DEPENDENCY CHAIN
- STEPS
  1. The user clicks the "Food Web" button in the navigation bar.
  2. The screen transitions to the Food Web Graph view showing all species as circular nodes connected by directional edges (arrows from prey to predator).
  3. Node radius reflects current population size; nodes with population below 10% of baseline are outlined in red.
  4. Edge thickness reflects the current rate of energy transfer (predation frequency) between two species.
  5. The user clicks the "Alligator" node.
  6. The graph highlights all species that depend directly or indirectly on the alligator, dimming unrelated species.
  7. The user hovers over an edge to see the predation relationship label and current energy-flow value.
- ACCEPTANCE CRITERIA
  1. The Food Web Graph must display all species present in the simulation as labelled nodes.
  2. All predator→prey relationships defined in the ecosystem model must be represented as directed edges.
  3. Node radius must scale proportionally to population count and update in real time as populations change.
  4. Nodes must turn red-bordered when population drops below 10% of starting baseline.
  5. Clicking a node must highlight its full direct and indirect dependency chain and dim all unrelated nodes.
  6. Edge hover must display a tooltip with the species names and current energy-flow rate.
- NOTES
  - The food web graph must remain live; it does not pause the simulation when viewed.
- RELATED
  - UC-002, UC-004, UC-005
---

## UC-004 : USER - MONITOR POPULATION TRENDS ON THE DASHBOARD
- STEPS
  1. The user opens the Population Dashboard from the navigation bar.
  2. A panel displays a line chart per species showing population count over elapsed simulation time.
  3. A stacked bar chart shows the current biomass distribution across the five trophic levels.
  4. The alert panel on the right lists active warnings: species in danger, extinction events, algae bloom alerts, and environmental event notifications.
  5. The user clicks a species name in the line chart legend.
  6. That species' line is highlighted and the chart zooms to show its population range over the last simulated season.
  7. An extinction event notification appears in the alert panel when a species population reaches zero.
- ACCEPTANCE CRITERIA
  1. The dashboard must display one line per species on the population chart, with a distinct colour per species.
  2. The biomass stacked bar chart must update every simulation tick to reflect current population totals per trophic level.
  3. The alert panel must display a warning when any species population falls below 10% of its baseline starting count.
  4. An extinction alert must appear within one simulation tick of a species population reaching zero.
  5. Clicking a species in the legend must isolate and highlight that species' line and show its min/max/current values.
  6. All charts must continue updating in real time without requiring a page refresh.
- NOTES
  - Chart data must be retained for the full simulation run duration to allow retrospective review.
- RELATED
  - UC-003, UC-005, UC-006
---

## UC-005 : USER - ADD OR REMOVE A SPECIES TO TRIGGER A CASCADE EFFECT
- STEPS
  1. The user opens the Intervention Panel from the navigation bar.
  2. The panel lists all species with current population counts and Add / Remove buttons next to each.
  3. The user clicks "Remove All" next to "Dragonflies."
  4. All dragonfly agents are removed from the simulation immediately.
  5. Over the next simulated minutes, mosquito adult population rises visibly on the canvas and in the population chart.
  6. As mosquito population rises, frog and bat populations increase due to increased food availability, followed by a decline in mosquito numbers as predators catch up.
  7. The alert panel logs the removal event and any cascade population changes that cross the 10% warning threshold.
- ACCEPTANCE CRITERIA
  1. The Intervention Panel must list every species with its live population count.
  2. Removing a species must eliminate all agents of that species from the simulation within one tick.
  3. The cascade effect on dependent species must be observable within 30 simulated seconds for directly linked species.
  4. The alert panel must log the removal event with species name and simulation timestamp.
  5. The user must also be able to add a species back; newly added agents must spawn at a configurable quantity and resume normal autonomous behaviour.
  6. A "Restore Baseline" button must return all species populations to their starting values.
- NOTES
  - Adding a species that was previously removed must reintroduce it without resetting the rest of the ecosystem.
- RELATED
  - UC-003, UC-004, UC-007, UC-008, UC-009, UC-010, UC-011
---

## UC-006 : USER - TRIGGER AN ENVIRONMENTAL EVENT AND OBSERVE ECOSYSTEM RESPONSE
- STEPS
  1. The user opens the Intervention Panel and navigates to the Environmental Events section.
  2. The user clicks "Trigger Pollution Event."
  3. A visual effect (dark discoloration spreading across water zones) renders on the canvas.
  4. Sensitive species — River Otter, Frogs, Bass — begin dying at an accelerated rate; population charts drop sharply.
  5. Hardier species — Catfish, Turtles, Crayfish — show slower decline or hold steady.
  6. The alert panel logs the event onset, lists affected species, and issues a warning for each species crossing the 10% threshold.
  7. The user triggers a "Flood Event." Water level rises on the canvas, expanding aquatic zones and temporarily boosting plant growth and fish habitat.
- ACCEPTANCE CRITERIA
  1. At least six environmental event types must be triggerable: Drought, Flood, Pollution, Cold Snap, Fire (shoreline), and Nutrient Runoff.
  2. Each event must have a distinct visual effect on the canvas lasting at least 10 simulated seconds.
  3. Sensitive species must show a statistically measurable population decline within 60 simulated seconds of a pollution event.
  4. Hardier species must show a slower or lesser decline than sensitive species under the same pollution event.
  5. The alert panel must log every environmental event with its type, start timestamp, and list of primarily affected species.
  6. Flood events must visually expand water areas on the canvas and increase aquatic organism territory.
- NOTES
  - Environmental events may be stacked; two concurrent events (e.g., drought + pollution) must compound their effects independently.
- RELATED
  - UC-004, UC-005, UC-011
---

## UC-007 : USER - PLAY THE "REMOVE THE ALLIGATOR" GUIDED SCENARIO
- STEPS
  1. The user opens the Guided Scenarios screen and selects "Remove the Alligator."
  2. A brief introductory text explains the alligator's role as apex predator and gator-hole creator.
  3. The scenario starts with alligators removed from the simulation.
  4. The user observes: fish and snake populations rise (reduced predation pressure), heron population increases (more prey), eventually fish overpopulate and deplete the smaller fish and tadpole populations.
  5. The scenario overlays a checklist of observable cascade events the user should watch for; each item checks off automatically when the event occurs.
  6. After all cascade events fire, a summary panel shows the trophic cascade chain that resulted from alligator removal.
- ACCEPTANCE CRITERIA
  1. The scenario must start with zero alligator agents in the simulation.
  2. Fish and snake population increases must be detectable within 2 simulated minutes of scenario start.
  3. The cascade checklist must include at least 4 observable events with auto-detection logic.
  4. All checklist items must auto-complete when the corresponding population threshold is crossed; the user must not need to mark them manually.
  5. The summary panel must display a written trophic cascade chain (e.g., "Alligator removed → Snake population +40% → Frog population −30%") based on actual simulation data from the run.
  6. The user must be able to reintroduce alligators mid-scenario and observe population recovery.
- NOTES
  - The alligator's gator-hole mechanic (retaining water in dry season) must be absent in this scenario, causing localised dry patches during drought ticks.
- RELATED
  - UC-005, UC-006, UC-012
---

## UC-008 : USER - PLAY THE "MOSQUITO EXPLOSION" GUIDED SCENARIO
- STEPS
  1. The user selects the "Mosquito Explosion" guided scenario.
  2. An intro panel explains that all dragonflies have been removed, eliminating the primary mosquito predator.
  3. The scenario starts; mosquito adult agents multiply rapidly over the first simulated minute.
  4. The user observes frog populations rise as frogs benefit from the increased food supply.
  5. As frogs increase, snake populations grow in response; the scenario overlay tracks each link in the chain.
  6. Eventually mosquito numbers begin to stabilise as frog predation catches up; the scenario marks this equilibrium point.
  7. A summary shows the boom-and-bust population wave and the time delay between each trophic response.
- ACCEPTANCE CRITERIA
  1. The scenario must start with all dragonfly agents removed from the simulation.
  2. Mosquito adult population must at least double within 90 simulated seconds of scenario start.
  3. Frog population increase must follow mosquito increase with a visible time delay of at least 15 simulated seconds.
  4. The scenario overlay must track and display at least 3 sequential trophic links (dragonfly → mosquito → frog → snake).
  5. The scenario must detect and mark the equilibrium point when mosquito population growth rate drops below 5% per tick for 10 consecutive ticks.
  6. The summary panel must show a time-series graph of all affected species throughout the scenario run.
- NOTES
  - Bat population (a secondary mosquito predator) must also be modelled and shown rising in response to the mosquito explosion.
- RELATED
  - UC-005, UC-004
---

## UC-009 : USER - PLAY THE "ALGAE BLOOM" GUIDED SCENARIO
- STEPS
  1. The user selects the "Algae Bloom" guided scenario.
  2. An intro panel explains that fertiliser runoff has caused a nutrient spike in the water.
  3. The scenario starts; algae coverage on the canvas expands rapidly, turning large water areas green.
  4. As algae overgrows, oxygen levels drop (shown on the oxygen overlay); fish begin dying from hypoxia.
  5. With fish declining, crayfish and snail populations initially rise due to reduced predation, then crash as algae suffocates the substrate.
  6. The scenario overlays an oxygen level meter on screen; the user watches it drop below the critical threshold.
  7. The user can intervene by adding crayfish or ducks to graze algae; the scenario tracks whether the user's intervention successfully reverses the bloom within a time limit.
- ACCEPTANCE CRITERIA
  1. Algae coverage must visually expand to at least 60% of the water surface area within 60 simulated seconds of scenario start.
  2. The oxygen level meter must drop below a marked critical threshold within 90 simulated seconds of algae bloom onset.
  3. Fish population must decline measurably within 30 simulated seconds of the oxygen level crossing the critical threshold.
  4. The intervention mechanic must allow the user to add crayfish or duck agents; adding sufficient quantities must slow algae growth within 30 simulated seconds.
  5. If the user does not intervene, the scenario must proceed to a fish mass die-off and trigger an extinction alert for bass within 3 simulated minutes.
  6. The oxygen level overlay must be togglable and must display a numeric value as well as a colour-coded indicator.
- NOTES
  - Nutrient level is a shared environmental variable; the bloom scenario must set it to 3× the baseline value at start.
- RELATED
  - UC-006, UC-004, UC-013
---

## UC-010 : USER - PLAY THE "BEAVER DAM" GUIDED SCENARIO
- STEPS
  1. The user selects the "Beaver Dam" guided scenario.
  2. An intro panel explains that a beaver has begun damming the main outflow channel.
  3. The scenario starts with beaver agents actively building; water level visibly rises on the canvas over the first simulated minute.
  4. New aquatic habitat zones expand at the canvas edges; fish and frog populations grow as habitat increases.
  5. Terrestrial species — raccoons, fireflies — are displaced from flooded shoreline zones and relocate to higher ground.
  6. Wading bird habitat improves; heron and osprey populations increase due to expanded shallow fishing zones.
  7. A summary shows the habitat-engineering effect: water area before and after, and the population changes per species.
- ACCEPTANCE CRITERIA
  1. Beaver agents must visibly construct a dam structure on the canvas at the outflow location.
  2. Water level must visibly rise and expand the aquatic zone area within 90 simulated seconds of dam construction start.
  3. Fish population must increase by at least 20% compared to pre-dam baseline within 3 simulated minutes of full dam completion.
  4. Terrestrial species must visibly relocate away from flooded areas; their territory markers must update accordingly.
  5. The summary panel must display water area (before/after in percentage of canvas), and per-species population change attributed to the dam event.
  6. The user must be able to remove the beaver dam (via intervention) and observe water level receding and population reversal.
- NOTES
  - The beaver is the only engineer species in the simulation; dam removal must be a distinct intervention action.
- RELATED
  - UC-005, UC-006
---

## UC-011 : USER - PLAY THE "DROUGHT YEAR" GUIDED SCENARIO
- STEPS
  1. The user selects the "Drought Year" guided scenario.
  2. An intro panel explains that seasonal rainfall has failed and water levels are dropping.
  3. The scenario starts; water coverage on the canvas shrinks progressively, leaving mudbanks and dry zones.
  4. Predators and prey concentrate around the remaining pools; predation rate increases sharply as density rises.
  5. Oxygen levels drop in the remaining pools due to reduced water volume; fish die-off begins.
  6. Cold-blooded species (frogs, snakes, alligators) reduce their activity rate as temperature drops with reduced water.
  7. Alligator "gator holes" become critical refuges: small water pockets persist around alligator positions; the user can observe other species clustering near them for survival.
  8. The scenario ends when rainfall resumes; the user observes recovery speed across different species.
- ACCEPTANCE CRITERIA
  1. Water coverage must visibly shrink to at least 40% of the starting area over 3 simulated minutes of drought.
  2. Predation events per tick must increase measurably (at least 50% above baseline) as organisms concentrate in remaining pools.
  3. Cold-blooded organism movement speed must decrease visibly during peak drought conditions.
  4. Alligator gator-hole positions must retain small water zones that persist even when surrounding areas are dry.
  5. At least two other species must visibly cluster within the gator-hole water zones during peak drought.
  6. When rainfall resumes, water level must recover and species populations must begin rebounding within 60 simulated seconds.
- NOTES
  - If no alligators are present (e.g., after the "Remove the Alligator" scenario), gator-hole refuges must be absent, causing more severe fish die-off during drought.
- RELATED
  - UC-006, UC-007
---

## UC-012 : USER - CONTROL SIMULATION TIME AND OBSERVE SEASONAL CHANGE
- STEPS
  1. The user uses the time control bar to pause the simulation.
  2. The user resumes the simulation at normal speed (×1).
  3. The user accelerates time to ×5; organisms visibly move and reproduce faster; population curves on the dashboard update more rapidly.
  4. The user advances to ×30 speed; a full simulated season passes within seconds; plant growth and die-back cycles are visible.
  5. The user clicks "Skip to Next Season"; the simulation jumps forward and the canvas updates to show seasonal vegetation changes (e.g., winter: reduced lily pads; summer: dense algae).
  6. Migratory species (ducks, osprey) disappear from the canvas in winter and return in spring.
- ACCEPTANCE CRITERIA
  1. The simulation must support play, pause, and at least three speed levels: ×1, ×5, ×30.
  2. All organism agents and population counts must scale correctly at each speed level; no agents must be skipped or duplicated due to speed changes.
  3. A "Skip to Next Season" control must advance simulation time to the next seasonal boundary without intermediate frames.
  4. Seasonal vegetation changes must be visually reflected on the canvas: at minimum, summer dense growth and winter reduced growth states.
  5. Migratory species must be absent from the canvas during their off-season and must reappear at the start of their return season.
  6. Time elapsed (in simulated days/seasons) must be displayed in the UI at all times.
- NOTES
  - Season length is configurable in settings; default is 90 simulated seconds per season at ×1 speed.
- RELATED
  - UC-001, UC-007, UC-011
---

## UC-013 : USER - TOGGLE ENVIRONMENTAL DATA OVERLAYS
- STEPS
  1. The user is viewing the main ecosystem canvas with the simulation running.
  2. The user clicks the "Food Web" overlay toggle.
  3. Thin directional arrows appear on the canvas connecting organisms, showing live predator→prey relationships between nearby agents.
  4. The user toggles the "Nutrient Flow" overlay; colour-coded gradients appear in the water showing nutrient concentration zones.
  5. The user toggles the "Oxygen Level" overlay; a blue-to-red heatmap shows dissolved oxygen distribution across water zones.
  6. The user toggles the "Population Heatmap" overlay; a density map highlights zones with high organism concentration.
  7. The user disables all overlays and the canvas returns to its default visual state.
- ACCEPTANCE CRITERIA
  1. At least four overlays must be available: Food Web arrows, Nutrient Flow gradient, Oxygen Level heatmap, and Population Density heatmap.
  2. Each overlay must be independently togglable; enabling one must not disable another.
  3. Overlays must update in real time as the simulation runs; they must not require a pause or refresh.
  4. Disabling all overlays must return the canvas to its default state with no residual overlay graphics.
  5. The Food Web overlay arrows must only display relationships between organisms within a configurable proximity radius.
  6. Overlay toggles must be accessible via the main toolbar without navigating away from the canvas.
- NOTES
  - Overlays are for observation only; they do not affect simulation logic.
- RELATED
  - UC-001, UC-003, UC-009
---

## UC-014 : USER - SAVE AND RESTORE AN ECOSYSTEM STATE
- STEPS
  1. The user has modified the ecosystem by removing dragonflies and triggering a flood event, and wants to save this state.
  2. The user opens the Save/Load panel from the navigation bar.
  3. The user clicks "Save to Slot 1"; the current simulation state — all agent positions, populations, environmental conditions, and elapsed time — is saved.
  4. The user continues the simulation; populations change significantly over the next simulated season.
  5. The user opens Save/Load and clicks "Load Slot 1."
  6. The simulation restores to the saved state; organism counts, positions, and environmental conditions match the saved snapshot.
  7. The simulation resumes from the restored state without error.
- ACCEPTANCE CRITERIA
  1. At least three save slots must be available.
  2. A save must capture: all agent positions and states, all species population counts, current environmental variable values (nutrient level, water level, oxygen, temperature), active event flags, and simulated time elapsed.
  3. Loading a slot must restore the simulation to the exact saved state within 1 second.
  4. After loading, the simulation must resume running normally without agent behavioural anomalies.
  5. Save data must persist across browser sessions (localStorage); closing and reopening the browser must not delete saved slots.
  6. Each saved slot must display the save timestamp and a brief state summary (e.g., "Day 45 — Drought active — 3 species in danger").
- NOTES
  - Saves are stored in localStorage; save data must not exceed 5 MB per slot to avoid storage quota errors.
- RELATED
  - UC-005, UC-006
---

## UC-015 : USER - SEE EVERY ORGANISM AS A CARTOON SPRITE WITH IDLE LIFE
- STEPS
  1. The user opens the simulator; the canvas paints with the vibrant cartoon swamp scene already running.
  2. Each living agent on the canvas is drawn as a hand-drawn-style cartoon sprite of that organism — round eyes, soft outlines, saturated swamp palette — instead of a flat coloured circle. A frog reads as a frog at a glance; an alligator reads as an alligator; a dragonfly reads as a dragonfly.
  3. While an agent is not moving (resting, basking, perched), it plays an idle animation loop: the frog's throat sac pulses, the alligator's tail curls slowly, the heron shifts its head, the dragonfly hovers with shimmering wings, the cypress trees sway, the lily pads bob.
  4. The user pauses the simulation; idle animations stop on the next frame and resume on un-pause.
  5. The user zooms out (or in) using the canvas zoom control; sprites stay legible — they do not become pixelated mush at small sizes nor lose their cartoon outline at large sizes.
  6. The user opens the Species Inspector on a frog; the inspector shows a larger version of the same cartoon sprite playing its idle animation.
- ACCEPTANCE CRITERIA
  1. Every species defined in the food-web (producers, primary, secondary, apex, decomposers, mosquito, bat — 28 species in total) MUST have a dedicated cartoon sprite. No species may render as a flat circle in production.
  2. Each sprite MUST be visually distinguishable from every other species at canvas baseline zoom — a casual user must be able to identify the species without opening the inspector.
  3. Each animal sprite MUST have at least one idle animation loop of 4 or more frames, looping at 2–6 fps, that plays whenever the agent's velocity is below an "idle" threshold.
  4. Idle animations MUST pause when the simulation is paused and resume on un-pause; they MUST advance at simulated time, not wall-clock, when speed multipliers are active (so ×5 plays idle frames roughly 5× faster).
  5. Plant patches (cypress, lily pad, algae, cattail, duckweed, sphagnum) MUST also have idle animations (sway, ripple, drift) so the scene never appears static even with no animal movement.
  6. The Species Inspector MUST reuse the same sprite at a larger size with the idle animation playing.
  7. Sprite assets MUST be vector (SVG) or sprite-sheet PNGs delivered under `./build/sprites/` and loaded once at boot; per-frame draws MUST NOT trigger network requests.
- NOTES
  - Cartoon style guideline: thick dark outline (~1.5 px at baseline), saturated mid-tones, two-tone shading at most. No photoreal textures. Target "children's nature picture-book."
- RELATED
  - UC-001, UC-002, UC-016, UC-017
---

## UC-016 : USER - WATCH ORGANISMS PLAY DIRECTIONAL MOVEMENT ANIMATIONS
- STEPS
  1. The user is observing the canvas; agents move around naturally as the simulation runs.
  2. A heron walks along the mud bank to the right; its sprite plays a "walk-right" animation with legs cycling. The user pans focus to a heron walking left; the same animation is mirrored.
  3. An alligator crawls toward prey; its body undulates left-right as legs swing. When it stops to ambush, it switches back to its idle animation within one frame.
  4. A turtle swims under the surface; it plays a "swim" animation (limbs paddling, body gliding) instead of its on-land walk animation.
  5. An osprey flies over the swamp; it plays a "flight" animation with flapping wings. When it perches in a cypress, it transitions to its perched idle.
  6. A dragonfly hovers in place (idle) and then darts; the dart is a brief flight animation with wing-blur.
  7. The user opens the dashboard; while it is open the canvas stops animating, but motion resumes intact when the user returns to the canvas screen.
- ACCEPTANCE CRITERIA
  1. Every animal species MUST have at least one movement animation in addition to its idle animation. Movement animations MUST be at least 4 frames at 6–12 fps.
  2. Movement animations MUST be selected automatically based on the agent's velocity vector and species locomotion mode:
     - Walking species (heron, alligator, raccoon, otter on land, turtle on land) play "walk" animations with at least two facing variants (left, right). Up/down motion may reuse the nearest horizontal variant.
     - Swimming species (fish, tadpole, frog when in water, otter in water, turtle in water, alligator partially submerged) play a "swim" animation distinct from "walk".
     - Flying species (heron in flight, osprey, duck, dragonfly, mosquito, bat, butterfly) play a "flight" animation with visible wing motion.
  3. Sprites MUST flip or rotate to face the direction of motion: at minimum, a horizontal flip for left vs right travel. Up/down rotation is optional but recommended for flying species.
  4. Transition between idle and movement animations MUST occur within one simulation frame of the agent crossing its velocity threshold; no "frozen mid-step" sprites.
  5. Locomotion mode MUST be selected from the agent's current environment (in water vs on land vs in air) for amphibious species (frog, alligator, turtle, otter, duck) — they do not play a "walk" animation while in open water.
  6. Performance budget: with 400 active agents on canvas, sprite animation MUST sustain at least 30 fps on a baseline laptop (Intel UHD-class GPU). If frame budget is exceeded, low-priority idle animations MAY be culled before movement animations.
- NOTES
  - Direction-facing supports the mosquito-explosion and predation overlays so the user can intuitively read which way prey is fleeing and predator is chasing.
- RELATED
  - UC-001, UC-005, UC-008, UC-013, UC-015
---

## UC-017 : USER - ENJOY A CARTOON-STYLED USER INTERFACE
- STEPS
  1. The user opens the simulator; the top navigation bar, time controls, overlay bar, and side panels are styled as a cartoon HUD — chunky rounded buttons, hand-drawn iconography, soft drop shadows, the same saturated swamp palette as the canvas.
  2. The user hovers over the "Pause" button; the icon gently bounces and brightens. On click it presses inward with a small squash-and-stretch animation.
  3. The user opens the Intervention panel; species rows show a small cartoon portrait of each species next to its name, matching the sprites on the canvas.
  4. The user opens the Scenario picker; each scenario card has an illustrated header (cartoon alligator silhouette for "Alligator Removed", swarm of dragonflies for "Mosquito Explosion", etc.).
  5. The user triggers the pollution event; an event card slides into the active-events panel with a cartoon oil-drum icon and a soft pulse highlight.
  6. The user opens the Save/Load panel; each save slot shows a cartoon polaroid frame holding a thumbnail snapshot of the saved scene.
  7. All UI animations (hover, press, slide-in, pulse) honour the OS "prefers-reduced-motion" setting and degrade to instant transitions when it is on.
- ACCEPTANCE CRITERIA
  1. The complete UI palette MUST match the canvas palette (cypress green, swamp water blue-green, mud brown, sky cream, accent ochre, alert red) and be defined as CSS custom properties in `style.css`.
  2. All primary buttons (nav, time controls, overlays, scenario start, event triggers, save/load actions) MUST use rounded corners (≥ 10 px), at least 36 px hit-target height, and a consistent cartoon icon set.
  3. Cartoon icons for nav screens, time controls, overlays, and the six event cards MUST be delivered as SVG under `./build/images/ui/` and inlined or referenced consistently.
  4. Hover, focus, and pressed states MUST be visually distinct for every interactive control. Focus state MUST be keyboard-accessible (visible outline) for accessibility.
  5. Each species row in the Intervention panel and each species node in the Food Web screen MUST display a small cartoon portrait (32×32 to 64×64) of the species sprite.
  6. Each scenario card MUST have an illustrated header graphic (≥ 200×120 px) reflecting the scenario theme.
  7. UI motion MUST be subtle (≤ 200 ms transitions, ≤ 8 px movement) and MUST be disabled when `prefers-reduced-motion: reduce` is active.
  8. The cartoon styling MUST NOT regress any existing UC: every screen, control, and event in UC-001 through UC-014 MUST remain functional and visible.
- NOTES
  - This is a presentation-layer UC; it adds visual richness without changing simulation behaviour.
- RELATED
  - UC-002, UC-004, UC-006, UC-007, UC-014, UC-015, UC-016
---

## UC-018 : USER - WATCH BEAVERS ENGINEER LIVING DAMS IN REAL TIME
- STEPS
  1. One or more beaver agents are present on the canvas; they patrol the main outflow channel looking for a build site.
  2. When a beaver reaches a suitable spot, it begins placing logs and mud in a multi-step build animation: log-carry, log-drop, mud-pack.
  3. The dam structure grows frame by frame across the channel, rendered as a cartoon stick-and-mud barrier with woody texture.
  4. As the dam grows, the shallow-water zone behind it expands visibly; water ripples spread outward from the dam face.
  5. Once complete, the dam is a persistent terrain object: wading birds perch on it, small fish school in the raised pond, frogs spawn in the calm upstream water.
  6. The user can click the dam to inspect its build-progress percentage, structural health (affected by storms or drought), and the list of species currently using it.
  7. Beavers periodically patrol the dam; when structural health degrades they perform a repair animation and restore integrity.
  8. The user can demolish the dam via the Intervention panel; the breach animation shows water rushing downstream, habitat returning to baseline.
- ACCEPTANCE CRITERIA
  1. Beaver agents MUST display a 3-phase build animation (carry, drop, pack) visible at normal simulation speed.
  2. The dam structure MUST be rendered as a distinct terrain layer (above water, below sky) using cartoon log and mud sprites.
  3. Water-level rise upstream MUST be reflected in the canvas water-zone fill within 30 simulated seconds of dam completion.
  4. At least two non-beaver species MUST visibly interact with the completed dam (perching, schooling, spawning).
  5. The dam inspect tooltip MUST show build progress (0–100%), structural health (0–100%), and at least 3 species currently using the dam habitat.
  6. A storm or drought event MUST degrade dam structural health by a visible amount; beaver patrol MUST restore it.
  7. Demolishing the dam via Intervention MUST trigger a breach animation and revert water level within 60 simulated seconds.
  8. Multiple dams per simulation run MUST be supported (up to 3 simultaneous dams).
- NOTES
  - Dam health, position, and stage are persisted in save slots (UC-014).
  - Beavers are the sole builder species; their absence leaves existing dams without repair.
- RELATED
  - UC-001, UC-006, UC-010, UC-014, UC-018

---

## UC-019 : USER - EXPLORE A RICHLY VARIED SWAMP TERRAIN WITH LAND PATCHES
- STEPS
  1. On each new simulation (and on page load), a procedural terrain generator lays down a unique swamp landscape: deep-water channels, shallow wading flats, mudbanks, grassy land patches, and cypress-tree islands.
  2. The user can see the terrain as distinct canvas layers: deep water (dark teal), shallow water (lighter teal), mud (brown), grass/land (dark green), dry sand (ochre), and cypress stands.
  3. Land-patch boundaries are organic (Perlin-noise shaped) and irregular, not grid-aligned.
  4. Terrestrial species (raccoons, fireflies, deer, snakes) prefer land patches and avoid open water; aquatic species (fish, frogs, turtles) prefer deep and shallow water zones.
  5. Semi-aquatic species (alligators, herons, otters) move freely across the zone boundaries, and their movement animation changes at the water/land transition.
  6. A separate terrain overlay (accessible via the Overlays panel) shows the biome-zone heatmap in false colour for educational inspection.
  7. Seasonal change alters terrain: summer raises water edges slightly (heavier rainfall), winter shrinks water and expands mudbanks.
  8. The terrain seed is shown in the Settings/Info panel so interesting landscapes can be recreated or shared.
- ACCEPTANCE CRITERIA
  1. The terrain MUST be generated procedurally from a seed value on each new simulation; two different seeds MUST produce visually distinct layouts.
  2. At least 5 distinct zone types MUST be rendered as visually distinct canvas fills: deep water, shallow water, mud, grass/land, cypress stand.
  3. Zone boundaries MUST be smooth and organic (Perlin-noise or equivalent); no hard grid edges visible at default zoom.
  4. Each species MUST respect zone affinity: terrestrial species MUST NOT path through deep water; aquatic species MUST NOT spawn on dry land.
  5. Semi-aquatic species MUST display a swim-to-walk (or walk-to-swim) animation transition when crossing zone boundaries.
  6. The biome-zone overlay MUST be accessible via the Overlays panel toggle and MUST update in real time as terrain evolves seasonally.
  7. Terrain seed MUST be stored in the save state and restored on load so the landscape matches the saved run.
  8. The terrain renderer MUST maintain ≥ 30 fps at 1280×800 canvas resolution with ≥ 20 active organisms.
- NOTES
  - The terrain seed is an integer appended to the URL hash on new game, e.g. `#seed=4827`.
  - Cypress stand zones block terrestrial movement but support bird perching and plant life.
- RELATED
  - UC-001, UC-011, UC-012, UC-015, UC-016

---

## UC-020 : USER - SEE ALL PLANTS RENDERED AS ANIMATED CARTOON SPRITES
- STEPS
  1. Every plant species (lily pad, cattail, cypress, mangrove, sawgrass, duckweed, water hyacinth, algae, bladderwort, arrowhead) has a cartoon sprite-sheet distinct from all animal sprites.
  2. Aquatic plants (lily pads, duckweed, hyacinth, bladderwort) bob gently in idle animation, with leaves swaying on a sine-wave cycle offset per patch.
  3. Emergent plants (cattails, arrowhead) sway left-right in a slow wind wobble animation.
  4. Tall plants (cypress, mangrove) have a canopy-rustle animation (top leaves shimmer) and root flare.
  5. Algae patches pulse in size — expanding and contracting — with a bloom flash when the algae bloom event fires.
  6. When a beaver harvests a plant (for dam building), a harvest animation plays on the plant: it shakes, then vanishes with a puff sprite.
  7. Seasonal changes alter plant appearance: summer = dense green; autumn = browning tips; winter = sparse or buried under ice sheen.
  8. All plant animations honour `prefers-reduced-motion`; reduced-motion falls back to static sprite with no movement.
- ACCEPTANCE CRITERIA
  1. Every plant species listed in Steps 1 MUST have a unique cartoon sprite-sheet (≥ 4 idle frames) in `./build/sprites/`.
  2. Aquatic plant patches MUST visibly animate (bob or sway) at ≥ 4 fps in normal playback.
  3. Emergent and tall plant sprites MUST show a distinct sway or rustle animation cycle at ≥ 4 fps.
  4. Algae patches MUST scale in canvas area proportional to algae count in `state.plantPatches.algae`; bloom event MUST trigger a visible flash frame.
  5. Harvest animation (shake + vanish) MUST play when a beaver removes a plant, lasting ≤ 800 ms.
  6. Plant sprites MUST switch between at least 2 seasonal appearance states (summer full-growth vs. winter sparse); the transition MUST be visible when "Skip Season" is used.
  7. All plant patch rendering MUST maintain ≥ 30 fps at 1280×800 canvas resolution with full plant coverage.
  8. When `prefers-reduced-motion: reduce` is active, plant sprites MUST be static (frame 0 only); no sway or bob.
- NOTES
  - Plant patches are tracked in `state.plantPatches` (array of {x, y, size, phase} objects per species). The phase drives the animation offset.
  - Sprite-sheets for plants use the same row = state, col = frame schema as animal sheets (DI-022).
- RELATED
  - UC-001, UC-012, UC-015, UC-016, UC-018

---

## UC-021 : USER - EXPERIENCE A VIBRANT, LIVING ECOSYSTEM
- STEPS
  1. The canvas is alive at all times: water ripples propagate from every moving aquatic organism; wind-sway passes across plant patches in waves; light rays shimmer from the surface.
  2. The swamp ambient colour shifts with time of day: dawn (warm orange tint), noon (bright clear), dusk (amber-red), night (deep indigo with glowing fireflies and bioluminescent algae).
  3. Fireflies produce visible blink particles at night; frogs produce bubble sprites when diving; herons cast feather-flick sprites when landing.
  4. Predation events trigger a brief splash or rustle sprite burst at the event location; death of an organism leaves a brief decay-glow fading over 2 seconds.
  5. Rain particles fall during precipitation events; lightning flickers during the storm event; fog overlays the canvas during early-morning in autumn/winter.
  6. Population milestones are celebrated with a brief canvas-wide confetti burst (e.g., first successful beaver-dam completion, first heron breeding pair).
  7. The canvas has depth: far-background cypress silhouettes, mid-layer water and land terrain, foreground sprites, and a particle layer on top.
  8. At minimum density (very few organisms), ambient sound cues (crickets, frogs, bird calls) are hinted at via visible waveform equaliser icons in the HUD — audio is deferred but the UI placeholder is present.
- ACCEPTANCE CRITERIA
  1. Water ripple particles MUST emanate from every swimming agent; ripples MUST fade in ≤ 1 second.
  2. Time-of-day colour tint MUST shift the canvas via a full-screen CSS/Canvas colour overlay across at least 4 phases (dawn, noon, dusk, night).
  3. Firefly blink particles MUST appear within the canvas during night phase when firefly agents are present.
  4. Predation events MUST trigger a visible particle burst (splash or rustle) at the predation location.
  5. Rain particles MUST fall and accumulate temporarily on the canvas surface during precipitation events.
  6. The canvas MUST have a visible background layer (cypress silhouettes or equivalent) that is distinct from the terrain and sprite layers.
  7. At least one population milestone MUST produce a visible celebration effect (confetti or equivalent).
  8. The ambient sound placeholder (equaliser icon or equivalent) MUST be visible in the HUD and respond to population density.
- NOTES
  - Depth layers (back to front): sky-bg, terrain, water, plants, animals, particles, UI-overlay.
  - Audio implementation is out of scope; only the UI placeholder and reactive icon are required.
  - Firefly blink cadence: each firefly has a random phase offset so they blink asynchronously.
- RELATED
  - UC-001, UC-012, UC-015, UC-016, UC-017, UC-018, UC-019, UC-020
---
