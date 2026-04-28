# Requirements: SwampSimulator

## BR-001 : The application shall load and render the swamp ecosystem canvas within 3 seconds of opening in a modern desktop browser.
- TESTABLE CONDITION: From a cold page load, the canvas DOM element is present and contains at least one rendered organism sprite within 3000 ms.
- NOTES: Standard broadband connection, latest Chrome/Firefox/Safari.
- RELATED: UC-001
---

## BR-002 : The initial loaded ecosystem shall contain at least one live organism agent from each of the five trophic levels.
- TESTABLE CONDITION: At t=0 of a fresh simulation, agent counts for producer, primary consumer, secondary consumer, apex predator, and decomposer categories are each ≥ 1.
- NOTES: Trophic levels defined in goal.md ecosystem layers.
- RELATED: UC-001
---

## BR-003 : The simulation shall run autonomously without requiring any player input.
- TESTABLE CONDITION: After load, with no user interaction for 60 simulated seconds, organism populations and positions change from the initial state.
- RELATED: UC-001
---

## BR-004 : Organism agents shall move autonomously and visibly pursue prey or flee from predators.
- TESTABLE CONDITION: A predator agent placed within sensing range of a prey agent moves toward the prey within 3 simulation ticks; a prey agent placed within sensing range of a predator moves away within 3 ticks.
- RELATED: UC-001
---

## BR-005 : The ecosystem canvas shall be scrollable and pannable without resetting or pausing the simulation.
- TESTABLE CONDITION: Scroll/pan input shifts the visible viewport while the simulation tick counter continues to advance and agent positions continue to update.
- RELATED: UC-001
---

## BR-006 : The simulation shall maintain a minimum of 30 frames per second with the baseline organism population.
- TESTABLE CONDITION: Average frame rate measured over a 10-second sample on baseline population is ≥ 30 FPS.
- NOTES: Baseline = starting agent count for a pristine swamp preset.
- RELATED: UC-001
---

## BR-007 : Clicking any organism sprite shall open the Species Inspector panel within 200 ms.
- TESTABLE CONDITION: From click event to inspector visible state, elapsed time ≤ 200 ms.
- RELATED: UC-002
---

## BR-008 : The Species Inspector shall display the organism's common name, trophic level, current population, ecological role description, prey list, and predator list.
- TESTABLE CONDITION: All six fields are populated and visible when the inspector is open for any species.
- RELATED: UC-002
---

## BR-009 : Each prey and predator entry in the Species Inspector shall be a clickable link that navigates the inspector to that linked species.
- TESTABLE CONDITION: Clicking any linked species name updates the inspector contents to that species within 200 ms.
- RELATED: UC-002
---

## BR-010 : The Species Inspector population field shall match the live agent count for that species at the moment of inspection.
- TESTABLE CONDITION: Population shown equals the count of live agents of that species at the same simulation tick.
- RELATED: UC-002
---

## BR-011 : Closing the Species Inspector shall not pause or otherwise affect the simulation.
- TESTABLE CONDITION: Tick counter and agent positions continue to advance during and after closing the inspector.
- RELATED: UC-002
---

## BR-012 : Locally extinct species shall remain inspectable from the Food Web Graph.
- TESTABLE CONDITION: A species with population zero is shown as a node in the Food Web Graph and clicking it opens its Species Inspector entry.
- RELATED: UC-002, UC-003
---

## BR-013 : The Food Web Graph shall display every species in the simulation as a labelled node.
- TESTABLE CONDITION: Node count in the graph equals the number of species defined in the ecosystem model.
- RELATED: UC-003
---

## BR-014 : The Food Web Graph shall represent every defined predator-prey relationship as a directed edge from prey to predator.
- TESTABLE CONDITION: Edge count equals the number of predator-prey relationships defined in the ecosystem model; every edge has an arrow pointing from prey to predator.
- RELATED: UC-003
---

## BR-015 : Food Web Graph node radius shall scale proportionally to the species' current population and update in real time.
- TESTABLE CONDITION: When a species' population changes by ≥ 10%, the node radius visibly changes within one simulation tick.
- RELATED: UC-003
---

## BR-016 : Food Web Graph nodes shall display a red border when the species' population drops below 10% of its baseline starting count.
- TESTABLE CONDITION: A species reduced to < 10% of baseline shows a red-bordered node within one tick; restoring population above 10% removes the red border within one tick.
- RELATED: UC-003
---

## BR-017 : Clicking a Food Web Graph node shall highlight its full direct and indirect dependency chain and dim all unrelated nodes.
- TESTABLE CONDITION: Clicked node and all transitive predecessors and successors are visually highlighted; unrelated nodes have reduced opacity.
- RELATED: UC-003
---

## BR-018 : Hovering over a Food Web Graph edge shall display a tooltip with the two species names and the current energy-flow rate.
- TESTABLE CONDITION: A hover event on any edge produces a tooltip containing both species names and a numeric energy-flow value within 200 ms.
- RELATED: UC-003
---

## BR-019 : The Food Web Graph shall update live without pausing the simulation.
- TESTABLE CONDITION: While viewing the graph, simulation tick counter continues to advance.
- RELATED: UC-003
---

## BR-020 : The Population Dashboard shall display one line chart series per species, with a distinct colour per species.
- TESTABLE CONDITION: Number of legend entries equals the number of species; colour values are unique per species.
- RELATED: UC-004
---

## BR-021 : The Population Dashboard shall display a stacked bar chart of biomass distribution across the five trophic levels, updated every simulation tick.
- TESTABLE CONDITION: Stacked bar values change between consecutive ticks when populations change; bars sum to 100% of total biomass.
- RELATED: UC-004
---

## BR-022 : The Population Dashboard alert panel shall emit a warning entry when any species' population falls below 10% of its baseline starting count.
- TESTABLE CONDITION: Reducing a species below 10% of baseline produces a new alert panel entry naming that species within one tick.
- RELATED: UC-004
---

## BR-023 : The Population Dashboard alert panel shall emit an extinction entry within one tick of a species' population reaching zero.
- TESTABLE CONDITION: When a species count transitions from positive to zero, an extinction-classed alert appears within one tick.
- RELATED: UC-004
---

## BR-024 : Clicking a species in the Population Dashboard chart legend shall isolate and highlight that species' line and display its min, max, and current values.
- TESTABLE CONDITION: After clicking a legend entry, that line is rendered with full opacity, all other lines are dimmed, and a value panel shows min/max/current.
- RELATED: UC-004
---

## BR-025 : Population Dashboard charts shall continue updating in real time without page refresh.
- TESTABLE CONDITION: Chart data points are appended at the simulation tick rate while the dashboard is open.
- RELATED: UC-004
---

## BR-026 : Population time-series data shall be retained for the full simulation run duration.
- TESTABLE CONDITION: After 30 simulated minutes of runtime, every species' chart history contains at least one data point per simulated minute.
- RELATED: UC-004
---

## BR-027 : The Intervention Panel shall list every species with its live population count.
- TESTABLE CONDITION: Number of species rows in the panel equals the number of species in the model; population values match live agent counts.
- RELATED: UC-005
---

## BR-028 : Removing a species from the Intervention Panel shall eliminate all agents of that species within one simulation tick.
- TESTABLE CONDITION: After clicking "Remove all" for a species, that species' agent count is zero on the next tick.
- RELATED: UC-005
---

## BR-029 : Cascade effects on directly linked species shall be observable within 30 simulated seconds of a species removal.
- TESTABLE CONDITION: After removing a species with at least one direct prey relationship, the prey species' population changes by ≥ 5% within 30 simulated seconds.
- RELATED: UC-005
---

## BR-030 : The Intervention Panel shall log every species removal event with species name and simulation timestamp.
- TESTABLE CONDITION: After a removal action, a log entry appears in the alert panel containing the species name and the simulation tick or simulated-time stamp.
- RELATED: UC-005
---

## BR-031 : The Intervention Panel shall allow adding agents of any species at a configurable quantity.
- TESTABLE CONDITION: Add controls (+1, +N) increase the species agent count by the specified amount within one tick; new agents exhibit normal autonomous behaviour.
- RELATED: UC-005
---

## BR-032 : A "Restore Baseline" control in the Intervention Panel shall reset all species populations to their pristine starting values.
- TESTABLE CONDITION: Clicking the control sets every species' agent count back to its starting baseline within one tick.
- RELATED: UC-005
---

## BR-033 : The application shall provide at least six triggerable environmental event types: Drought, Flood, Pollution, Cold Snap, Fire, and Nutrient Runoff.
- TESTABLE CONDITION: The Intervention Panel exposes a trigger control for each of the six event types listed.
- RELATED: UC-006
---

## BR-034 : Each environmental event shall produce a distinct visual effect on the canvas lasting at least 10 simulated seconds.
- TESTABLE CONDITION: Triggering each event renders an associated visual layer (colour wash, water-level shift, or particle effect) that persists for ≥ 10 simulated seconds.
- RELATED: UC-006
---

## BR-035 : Pollution events shall cause measurable population decline in pollution-sensitive species within 60 simulated seconds.
- TESTABLE CONDITION: After triggering pollution, populations of River Otter, Frog, and Bass each decline by ≥ 10% within 60 simulated seconds.
- NOTES: Sensitive species set is data-driven and editable in the species table.
- RELATED: UC-006
---

## BR-036 : Pollution events shall cause slower population decline in hardy species than in sensitive species under identical conditions.
- TESTABLE CONDITION: 60 simulated seconds after pollution onset, percent decline of any hardy species (Catfish, Turtle, Crayfish) is less than the percent decline of any sensitive species.
- RELATED: UC-006
---

## BR-037 : The application shall log every environmental event with type, start timestamp, and primarily affected species list.
- TESTABLE CONDITION: Each triggered event creates an alert-panel entry containing event type, simulation timestamp, and a species list of length ≥ 1.
- RELATED: UC-006
---

## BR-038 : Flood events shall visually expand water-zone area on the canvas and increase aquatic-organism territory.
- TESTABLE CONDITION: After flood trigger, water-pixel area on the canvas increases by ≥ 10%; aquatic-species movement bounds expand correspondingly.
- RELATED: UC-006
---

## BR-039 : Concurrent environmental events shall compound their effects independently.
- TESTABLE CONDITION: Triggering two events simultaneously produces a combined effect equivalent to the sum of the two individual effects on each species.
- RELATED: UC-006
---

## BR-040 : The "Remove the Alligator" scenario shall start with zero alligator agents in the simulation.
- TESTABLE CONDITION: At scenario start tick, alligator agent count = 0.
- RELATED: UC-007
---

## BR-041 : In the "Remove the Alligator" scenario, fish and snake populations shall measurably increase within 2 simulated minutes of scenario start.
- TESTABLE CONDITION: At t = 2 simulated minutes from scenario start, both Bass and Water Snake populations are ≥ 110% of their start-of-scenario values.
- RELATED: UC-007
---

## BR-042 : The "Remove the Alligator" scenario shall include a checklist of at least 4 observable cascade events with auto-detection logic.
- TESTABLE CONDITION: Scenario UI shows a checklist of length ≥ 4; each item is associated with a measurable simulation condition.
- RELATED: UC-007
---

## BR-043 : Cascade-checklist items shall auto-complete when their corresponding population thresholds are crossed.
- TESTABLE CONDITION: When a checklist item's threshold is met by the live simulation, the item is marked complete without user input.
- RELATED: UC-007
---

## BR-044 : The "Remove the Alligator" scenario shall display a written trophic-cascade summary based on the actual run data after all cascades complete.
- TESTABLE CONDITION: After checklist completion, a summary panel appears containing at least one cause-effect statement derived from observed population deltas.
- RELATED: UC-007
---

## BR-045 : Reintroducing alligators mid-scenario shall be supported and shall result in observable population recovery toward baseline.
- TESTABLE CONDITION: After reintroducing alligators during the scenario, prey populations move toward baseline within 2 simulated minutes.
- RELATED: UC-007
---

## BR-046 : The alligator's gator-hole mechanic shall be absent when no alligators exist in the simulation.
- TESTABLE CONDITION: With zero alligators present, no gator-hole water-retention zones are rendered or active during drought.
- RELATED: UC-007, UC-011
---

## BR-047 : The "Mosquito Explosion" scenario shall start with all dragonfly agents removed.
- TESTABLE CONDITION: At scenario start tick, dragonfly agent count = 0.
- RELATED: UC-008
---

## BR-048 : In the "Mosquito Explosion" scenario, mosquito adult population shall at least double within 90 simulated seconds.
- TESTABLE CONDITION: At t = 90 s from scenario start, mosquito population ≥ 2× start-of-scenario value.
- RELATED: UC-008
---

## BR-049 : Frog population growth in the "Mosquito Explosion" scenario shall trail mosquito growth by at least 15 simulated seconds.
- TESTABLE CONDITION: Time of first ≥ 10% frog population increase is at least 15 s later than the time of the same threshold for mosquitoes.
- RELATED: UC-008
---

## BR-050 : The "Mosquito Explosion" scenario shall track and display at least 3 sequential trophic links.
- TESTABLE CONDITION: Scenario overlay names dragonfly → mosquito → frog → snake (or equivalent ≥ 3-link chain) explicitly.
- RELATED: UC-008
---

## BR-051 : The "Mosquito Explosion" scenario shall detect and mark an equilibrium point when mosquito growth rate falls below 5% per tick for 10 consecutive ticks.
- TESTABLE CONDITION: An equilibrium marker appears on the timeline at the first tick where this condition is met.
- RELATED: UC-008
---

## BR-052 : The "Mosquito Explosion" scenario shall include bat population modelling and show bat population rising in response to mosquito increase.
- TESTABLE CONDITION: Bats are present in the species model; bat population rises by ≥ 10% during the scenario run.
- RELATED: UC-008
---

## BR-053 : In the "Algae Bloom" scenario, algae coverage shall expand to at least 60% of the water surface area within 60 simulated seconds.
- TESTABLE CONDITION: At t = 60 s from scenario start, algae-covered water pixels ≥ 60% of total water pixels.
- RELATED: UC-009
---

## BR-054 : During the "Algae Bloom" scenario, dissolved oxygen shall drop below a marked critical threshold within 90 simulated seconds.
- TESTABLE CONDITION: Oxygen meter reading falls below the configured critical threshold by t = 90 s.
- RELATED: UC-009
---

## BR-055 : Fish population shall decline measurably within 30 simulated seconds of dissolved oxygen crossing the critical threshold.
- TESTABLE CONDITION: From the tick at which oxygen crosses the threshold, fish population declines by ≥ 5% within 30 s.
- RELATED: UC-009
---

## BR-056 : Adding sufficient algae-grazing agents (crayfish or ducks) during the "Algae Bloom" scenario shall slow algae growth within 30 simulated seconds.
- TESTABLE CONDITION: After adding ≥ N grazers (configured threshold), algae expansion rate decreases by ≥ 50% within 30 s.
- RELATED: UC-009
---

## BR-057 : If the user does not intervene during the "Algae Bloom" scenario, the run shall produce a fish mass die-off and trigger a Bass extinction alert within 3 simulated minutes.
- TESTABLE CONDITION: Without intervention, Bass population reaches zero within 3 simulated minutes; an extinction alert is logged.
- RELATED: UC-009
---

## BR-058 : The oxygen-level overlay shall be togglable and shall display both a numeric value and a colour-coded indicator.
- TESTABLE CONDITION: Toggle control shows/hides overlay; overlay always shows a numeric oxygen value and a colour mapped to that value.
- RELATED: UC-009, UC-013
---

## BR-059 : The "Algae Bloom" scenario shall set the nutrient level to 3× baseline at scenario start.
- TESTABLE CONDITION: At scenario start, nutrient level state variable equals 3× baseline.
- RELATED: UC-009
---

## BR-060 : Beaver agents in the "Beaver Dam" scenario shall visibly construct a dam structure on the canvas at the outflow location.
- TESTABLE CONDITION: A dam graphic appears at the designated outflow region during scenario execution.
- RELATED: UC-010
---

## BR-061 : Water level shall visibly rise and aquatic-zone area shall expand within 90 simulated seconds of beaver dam construction start.
- TESTABLE CONDITION: Water-pixel area increases by ≥ 10% within 90 s of dam-build start.
- RELATED: UC-010
---

## BR-062 : Fish population shall increase by at least 20% within 3 simulated minutes of full dam completion.
- TESTABLE CONDITION: Fish population at t = 3 min after dam completion ≥ 1.2× pre-dam baseline.
- RELATED: UC-010
---

## BR-063 : Terrestrial species shall visibly relocate away from flooded zones during the "Beaver Dam" scenario.
- TESTABLE CONDITION: Raccoon and firefly agents move out of newly-flooded pixels within 30 simulated seconds of flooding.
- RELATED: UC-010
---

## BR-064 : The "Beaver Dam" scenario summary shall report water area before and after as percentages of canvas, and per-species population deltas attributed to the dam event.
- TESTABLE CONDITION: Summary panel shows two water-area percentages and a table of population deltas keyed by species.
- RELATED: UC-010
---

## BR-065 : Removing the beaver dam (via intervention) shall cause water level to recede and species populations to reverse toward pre-dam values.
- TESTABLE CONDITION: After dam removal, water area returns toward pre-dam value; affected species populations move toward pre-dam values within 2 simulated minutes.
- RELATED: UC-010
---

## BR-066 : During the "Drought Year" scenario, water coverage shall shrink to at least 40% of the starting area over 3 simulated minutes.
- TESTABLE CONDITION: Water-pixel area at t = 3 min is ≤ 60% of start-of-scenario value (i.e. has shrunk by ≥ 40%).
- RELATED: UC-011
---

## BR-067 : Predation events per tick shall increase by at least 50% above baseline at peak drought.
- TESTABLE CONDITION: Tick-level predation event count exceeds 1.5× baseline during peak drought period.
- RELATED: UC-011
---

## BR-068 : Cold-blooded organism movement speed shall decrease visibly during peak drought conditions.
- TESTABLE CONDITION: Frog, snake, and alligator agent average speed during peak drought is lower than during baseline conditions.
- RELATED: UC-011
---

## BR-069 : Alligator gator-hole positions shall retain small water zones that persist when surrounding areas are dry.
- TESTABLE CONDITION: When alligators are present during drought, water zones of ≥ N pixels persist within R pixels of each alligator agent even after general water area shrinks below 50%.
- RELATED: UC-011
---

## BR-070 : At least two non-alligator species shall visibly cluster within gator-hole water zones during peak drought.
- TESTABLE CONDITION: Average distance from at least two other species' agents to nearest gator-hole drops by ≥ 30% during peak drought versus baseline.
- RELATED: UC-011
---

## BR-071 : When rainfall resumes after a drought, water level shall recover and species populations shall begin rebounding within 60 simulated seconds.
- TESTABLE CONDITION: After rain trigger, water area increases monotonically and at least 50% of declining species populations begin trending upward within 60 s.
- RELATED: UC-011
---

## BR-072 : The simulation shall support play, pause, and at least three speed levels: ×1, ×5, ×30.
- TESTABLE CONDITION: Time controls expose play, pause, and speed buttons for ×1, ×5, ×30; clicking each changes the simulation tick rate accordingly.
- RELATED: UC-012
---

## BR-073 : Simulation behaviour shall remain consistent across speed levels — no agents skipped or duplicated due to speed changes.
- TESTABLE CONDITION: Population totals computed at ×1 over N simulated seconds match totals computed at ×30 over the same N simulated seconds within ± 5%.
- RELATED: UC-012
---

## BR-074 : A "Skip to Next Season" control shall advance simulation time directly to the next seasonal boundary.
- TESTABLE CONDITION: Activating the control advances the simulated date to the next season-start without rendering intermediate ticks.
- RELATED: UC-012
---

## BR-075 : Seasonal vegetation changes shall be visually reflected on the canvas — at minimum a summer dense-growth state and a winter reduced-growth state.
- TESTABLE CONDITION: Plant sprite density and colour differ visibly between summer and winter ticks.
- RELATED: UC-012
---

## BR-076 : Migratory species shall be absent from the canvas during their off-season and reappear at the start of their return season.
- TESTABLE CONDITION: Duck and Osprey agent counts equal zero during their off-season and become positive at season-start tick of return.
- RELATED: UC-012
---

## BR-077 : Simulated time elapsed (days and seasons) shall be displayed in the UI at all times.
- TESTABLE CONDITION: A time readout containing day count and current season is visible on every screen.
- RELATED: UC-012
---

## BR-078 : Season length shall be configurable in settings, with default 90 simulated seconds per season at ×1 speed.
- TESTABLE CONDITION: Settings panel exposes a season-length control; default value is 90 s; changing the value updates the next season boundary accordingly.
- RELATED: UC-012
---

## BR-079 : The application shall provide at least four togglable canvas overlays: Food Web, Nutrient Flow, Oxygen Level, and Population Density.
- TESTABLE CONDITION: Overlay toggle bar exposes four toggle controls with these labels.
- RELATED: UC-013
---

## BR-080 : Each overlay shall be independently togglable.
- TESTABLE CONDITION: Toggling one overlay does not change the on/off state of any other overlay.
- RELATED: UC-013
---

## BR-081 : Overlays shall update in real time as the simulation runs without requiring a pause or refresh.
- TESTABLE CONDITION: With an overlay enabled and the simulation running, overlay graphics update at the simulation tick rate.
- RELATED: UC-013
---

## BR-082 : Disabling all overlays shall return the canvas to its default state with no residual overlay graphics.
- TESTABLE CONDITION: After turning off all overlays, no overlay-class graphics are rendered.
- RELATED: UC-013
---

## BR-083 : The Food Web overlay arrows on the canvas shall only display relationships between organisms within a configurable proximity radius.
- TESTABLE CONDITION: Arrows are drawn only between predator-prey agent pairs separated by ≤ R pixels; R is settable in the settings panel.
- RELATED: UC-013
---

## BR-084 : Overlay toggles shall be accessible from the main toolbar without navigating away from the canvas.
- TESTABLE CONDITION: Overlay toggle controls are visible while the canvas screen is active.
- RELATED: UC-013
---

## BR-085 : The application shall provide at least three save slots.
- TESTABLE CONDITION: Save/Load panel exposes three or more independent slots.
- RELATED: UC-014
---

## BR-086 : Saving a slot shall capture all agent positions and states, all species population counts, current environmental variable values, active event flags, and simulated time elapsed.
- TESTABLE CONDITION: After Save, the saved record contains keys for agents (with positions and states), species populations, environmental variables (nutrient, water, oxygen, temperature), active event flags, and elapsed-time.
- RELATED: UC-014
---

## BR-087 : Loading a slot shall restore the simulation to the exact saved state within 1 second.
- TESTABLE CONDITION: From Load click to fully restored simulation, elapsed wall-clock time ≤ 1000 ms; restored agent count and positions match saved values exactly.
- RELATED: UC-014
---

## BR-088 : After loading, the simulation shall resume running normally without behavioural anomalies.
- TESTABLE CONDITION: After Load, simulation tick advances and agents continue to behave per BR-004.
- RELATED: UC-014
---

## BR-089 : Save data shall persist across browser sessions via localStorage.
- TESTABLE CONDITION: After saving, closing the browser, and reopening the application, the saved slots remain available with their data intact.
- RELATED: UC-014
---

## BR-090 : Each saved slot shall display the save timestamp and a brief state summary.
- TESTABLE CONDITION: Each populated slot UI tile shows a human-readable timestamp and a one-line summary derived from the saved state.
- RELATED: UC-014
---

## BR-091 : Save data per slot shall not exceed 5 MB.
- TESTABLE CONDITION: A saved slot's serialised payload size is ≤ 5 MB; if approaching the limit, a warning is shown to the user.
- NOTES: Required to stay within typical localStorage quotas.
- RELATED: UC-014
---

---

## Vibrant Cartoon Graphics (UC-015, UC-016, UC-017)

## BR-092 : Every species defined in the food-web (28 species) shall be rendered on the canvas as a dedicated cartoon sprite — no species shall be rendered as a flat coloured circle in production.
## BR-093 : Each species sprite shall be visually distinguishable from every other species sprite at canvas baseline zoom such that a casual user can identify the species without opening the inspector.
## BR-094 : The cartoon visual style shall use thick dark outlines (~1.5 px at baseline), saturated mid-tone fills, at most two-tone shading, and no photoreal textures — consistent across all species and UI elements.
## BR-095 : Each animal species shall have at least one idle animation loop of 4 or more frames, looping at 2–6 fps, that plays whenever the agent's velocity is below a configured idle threshold.
## BR-096 : Each plant patch species (cypress, lily pad, algae, cattail, duckweed, sphagnum) shall have an idle animation (sway, ripple, or drift) so the scene is never visually static.
## BR-097 : Each animal species shall have at least one movement animation distinct from its idle animation, of 4 or more frames at 6–12 fps.
## BR-098 : Walking species shall have a "walk" movement animation with at least two facing variants (left and right). Up/down motion may reuse the nearest horizontal variant.
## BR-099 : Swimming-capable species shall have a "swim" movement animation distinct from "walk".
## BR-100 : Flying species shall have a "flight" movement animation with visible wing motion.
## BR-101 : Sprites shall flip or rotate to face the agent's direction of travel — at minimum a horizontal flip for left vs right motion.
## BR-102 : Locomotion mode (walk / swim / flight) shall be selected automatically each frame from the agent's species locomotion capabilities and current environment (in water, on land, in air) for amphibious species.
## BR-103 : Transition between idle and movement animations shall occur within one simulation frame of the agent crossing its velocity threshold — no frozen mid-step sprites.
## BR-104 : Idle and movement animations shall pause when the simulation is paused and resume on un-pause; animation playback shall advance at simulated time, not wall-clock, scaling with the active speed multiplier.
## BR-105 : With 400 active agents on canvas, animated sprite rendering shall sustain at least 30 fps on a baseline laptop (Intel UHD-class GPU).
## BR-106 : When the per-frame budget is exceeded, idle animations may be culled (held on first frame) before movement animations are degraded.
## BR-107 : The Species Inspector panel shall display a larger version of the species sprite playing its idle animation.
## BR-108 : The Intervention panel and Food Web screen shall display a small cartoon portrait (32×32 to 64×64) of each species' sprite alongside its name or node.
## BR-109 : All sprite assets shall be delivered as SVG or sprite-sheet PNG under `./build/sprites/` and loaded once at boot — per-frame draws shall not trigger network requests.
## BR-110 : The user-interface palette shall match the canvas palette (cypress green, swamp water blue-green, mud brown, sky cream, accent ochre, alert red) and shall be defined as CSS custom properties in `style.css`.
## BR-111 : All primary buttons (nav, time controls, overlays, scenario start, event triggers, save/load actions) shall use rounded corners (≥ 10 px), at least 36 px hit-target height, and a consistent cartoon icon set.
## BR-112 : Cartoon icons for nav screens, time controls, overlays, and the six event cards shall be delivered as SVG under `./build/images/ui/`.
## BR-113 : Hover, focus, and pressed states shall be visually distinct for every interactive control. Focus state shall be visible for keyboard navigation.
## BR-114 : Each scenario card shall include an illustrated header graphic (≥ 200×120 px) reflecting the scenario theme.
## BR-115 : Each save slot in the Save/Load panel shall be styled as a polaroid frame containing a thumbnail snapshot of the saved scene.
## BR-116 : All UI motion shall be subtle (≤ 200 ms transition duration, ≤ 8 px movement) and shall be disabled when `prefers-reduced-motion: reduce` is active.
## BR-117 : The introduction of cartoon sprites and cartoon UI shall not regress any functional behaviour defined in BR-001 through BR-091 — every existing screen, control, and event shall remain functional.

---

### Requirements for UC-018 — Beaver Dam Engineering

## BR-118 : Beaver agents shall exhibit a three-phase build animation — carry, drop, pack — visible at ×1 simulation speed. Each phase shall last at least 2 simulated seconds.
## BR-119 : A completed dam shall be rendered as a distinct terrain object composed of cartoon log and mud sprites, positioned above the water layer and below the sky layer.
## BR-120 : Water level upstream of a completed dam shall visibly rise (canvas water-zone expansion) within 30 simulated seconds of full dam completion.
## BR-121 : At least two non-beaver species shall display an interaction behaviour with a completed dam (perch, school, spawn).
## BR-122 : Clicking a dam on the canvas shall open an inspect tooltip showing build progress (0–100%), structural health (0–100%), and a list of at least 3 species currently using the dam habitat.
## BR-123 : Storm and drought events shall degrade dam structural health by a visible and measurable percentage; beaver patrol shall restore structural health at a measurable rate.
## BR-124 : Demolishing the dam via the Intervention panel shall trigger a breach animation (water-rush effect) and revert upstream water level within 60 simulated seconds.
## BR-125 : Up to 3 simultaneous dams shall be supported in a single simulation run.
## BR-126 : Dam position, build progress, and structural health shall be persisted in save slots and restored on load (UC-014).

---

### Requirements for UC-019 — Procedural Swamp Terrain

## BR-127 : The terrain shall be generated procedurally from an integer seed value on each new simulation run; two distinct seeds shall produce visually distinct terrain layouts.
## BR-128 : At least 6 distinct zone types shall be rendered as visually distinct canvas fills: deep water, shallow water, mud, grass/land, dry sandbar, cypress stand.
## BR-129 : Zone boundaries shall be smooth and organic, generated via Perlin-noise or equivalent; no hard grid edges shall be visible at the default 1280×800 canvas resolution.
## BR-130 : Terrestrial species shall not path through or spawn in deep-water zones; aquatic species shall not spawn on dry-land zones; the spawn-zone constraint shall be checked on agent creation.
## BR-131 : Semi-aquatic species shall display a swim-to-walk (or walk-to-swim) animation transition when their position crosses a zone boundary.
## BR-132 : A biome-zone heatmap overlay shall be accessible via the Overlays panel and shall update in real time as terrain evolves seasonally.
## BR-133 : The terrain seed shall be stored in save state and restored on load so the terrain layout matches the saved run.
## BR-134 : The terrain renderer shall maintain ≥ 30 fps at 1280×800 canvas resolution with ≥ 20 active organisms and full plant coverage.
## BR-135 : Seasonal change (summer vs winter) shall visibly alter terrain: summer raises water edges; winter expands mudbanks and drys out shallow flats.
## BR-136 : The terrain seed shall be displayed in the Settings / Info panel and appended to the URL hash (e.g. `#seed=4827`) when a new simulation starts.

---

### Requirements for UC-020 — Animated Plant Sprites

## BR-137 : Every plant species tracked in `state.plantPatches` (lily pad, cattail, cypress, mangrove, sawgrass, duckweed, water hyacinth, algae, bladderwort, arrowhead — at minimum 10 species) shall have a unique cartoon sprite-sheet with ≥ 4 idle frames.
## BR-138 : Aquatic plant patches (lily pad, duckweed, hyacinth, bladderwort) shall animate with a vertical bob driven by a per-patch sine-wave phase offset so patches animate asynchronously.
## BR-139 : Emergent plant patches (cattail, arrowhead, sawgrass) shall animate with a lateral sway driven by a per-patch wind-offset.
## BR-140 : Tall plant species (cypress, mangrove) shall show a canopy-rustle animation (top-leaf shimmer) running as a looping 4-frame cycle.
## BR-141 : Algae patches shall scale in rendered canvas area proportional to the algae count in `state.plantPatches.algae`; the algae bloom event shall trigger a visible pulse-flash frame on all algae patches.
## BR-142 : When a beaver removes a plant patch (for dam building), a harvest animation (shake, then puff-cloud vanish) shall play at that patch location and complete within 800 ms.
## BR-143 : Plant sprites shall switch between at least 2 seasonal appearance states (summer full-growth, winter sparse); the transition shall be visible when "Skip Season" is activated.
## BR-144 : Plant patch rendering shall maintain ≥ 30 fps at 1280×800 canvas resolution with full plant coverage.
## BR-145 : When `prefers-reduced-motion: reduce` is active, plant sprites shall render as static (frame 0 only) with no sway, bob, or rustle.

---

### Requirements for UC-021 — Vibrant Ecosystem Atmosphere

## BR-146 : Water ripple particles shall emanate from every swimming agent at a rate of at least 1 particle per second and shall fade and disappear within 1 second.
## BR-147 : A time-of-day colour tint shall shift the canvas and background layer across at least 4 phases: dawn (warm orange), noon (bright clear), dusk (amber-red), night (deep indigo).
## BR-148 : Firefly agents present on the canvas during the night phase shall emit visible blink particles with random phase offsets, so they blink asynchronously.
## BR-149 : Predation events shall trigger a visible particle burst (splash for aquatic, rustle for terrestrial) at the predation location; the burst shall last ≤ 500 ms.
## BR-150 : Rain particles shall fall and accumulate temporarily on the canvas surface during precipitation events.
## BR-151 : The canvas shall include a visible background layer (cypress silhouettes or sky gradient) distinct from the terrain, plant, and animal layers.
## BR-152 : At least one population milestone (first beaver-dam completion, first heron breeding pair) shall trigger a canvas-wide celebration effect (confetti or equivalent) lasting ≤ 3 seconds.
## BR-153 : An ambient-sound placeholder (equaliser icon or waveform indicator) shall be visible in the HUD and shall respond to population density with a visual pulse rate proportional to total organism count.
## BR-154 : Depth layer render order (back to front) shall be: sky-bg, terrain, water-ripples, plants, animals, particles, UI-overlay. Each layer shall be rendered as a separate canvas-context pass or compositing step.
## BR-155 : All atmosphere effects (ripples, tints, particles, confetti) shall degrade gracefully when `prefers-reduced-motion: reduce` is active, reducing to static or minimal-motion equivalents.
## BR-156 : The introduction of terrain, plant animation, and atmosphere effects (BR-118..BR-155) shall not regress any functional behaviour defined in BR-001 through BR-117.

## BR-157 : If a dam has no active builders within interaction range for 20 simulated seconds, the dam tooltip shall present a visible "construction paused" state and dam progress shall not increase during that interval.
## BR-158 : Seed parsing shall reject zero, negative, NaN, and out-of-range seed values; the runtime shall normalize to an integer in [1, 99999] and immediately write the normalized value to URL hash and seed chip.
## BR-159 : Save payloads shall exclude regenerable high-volume terrain buffers (for example `biomeMap`) and shall reconstruct those buffers deterministically from saved seed/season data on load.
## BR-160 : Dam tooltip controls shall be wired without inline HTML event attributes; interaction handlers shall be attached programmatically and remain safe under repeated open/close cycles.
## BR-161 : Ambient activity indicator shall update from live organism count at least once every 2 simulated seconds and expose the same count through both tooltip text and aria-label.
## BR-162 : Under reduced-motion preference, ambient and particle cues shall still expose state through static visual affordances (labels/icons/opacity) and shall not rely solely on animation timing.
## BR-163 : Terrain and atmosphere systems shall tolerate malformed URL hash fragments containing unrelated keys while still extracting or generating a valid seed.
## BR-164 : Stage 9 hardening changes for BR-157..BR-163 shall not regress BR-001..BR-156 behaviors; Stage 10 shall include explicit edge-case tests for seed normalization and ambient indicator metadata.
