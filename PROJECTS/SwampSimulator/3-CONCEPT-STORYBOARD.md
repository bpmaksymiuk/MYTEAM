# Concept Storyboard: SwampSimulator

## CB-001 : ECOSYSTEM VIEW (MAIN CANVAS)
- SUMMARY: Primary screen — top-down 2D swamp canvas with autonomous organism sprites, overlay toggle bar on the left, species inspector docked on the right, and a top navigation bar with time controls. Demonstrates the at-a-glance reading of the simulation: water, mudbanks, plants, agents, and the docked inspector showing a selected alligator with its prey/predator links.
- FILE: ./build/concept/concept-ecosystem-view.svg
- FORMAT: SVG
- SCREENS COVERED: Main canvas + species inspector (right rail) + overlay toggles (left rail) + top nav + time controls
- STYLE NOTES: Muted naturalistic palette (cypress green #3a5a32, slate water #4a6b6b, mud #6b5a3a, accent amber #ffd34a). Sprites stylised flat-shaded circles in concept; final art handled in Stage 8. Translucent overlay panels respect the underlying scene.
- TRACEABILITY: UC-001, UC-002, UC-012, UC-013
- RELATED: CB-002, CB-003, CB-004
---

## CB-002 : FOOD WEB GRAPH
- SUMMARY: Force-directed graph of all 25 species arranged in trophic strata — producers at the bottom, apex predators at the top, decomposers at the right. Edges show predator→prey relationships. Demonstrates a selected node (Alligator) with its full dependency chain highlighted in amber down through Bass and Tadpoles to Algae.
- FILE: ./build/concept/concept-food-web.svg
- FORMAT: SVG
- SCREENS COVERED: Food Web Graph (full screen)
- STYLE NOTES: Five trophic-layer colours fixed by category (producer green, primary yellow, secondary orange, apex red, decomposer purple). Node radius encodes population. Selected-chain edges painted amber and 3px thick. Background dark to make data legible.
- TRACEABILITY: UC-003
- RELATED: CB-001, CB-003
---

## CB-003 : POPULATION DASHBOARD
- SUMMARY: Two-column dashboard. Left column: line chart of populations over the last simulated 90 days, plus a stacked bar of biomass distribution across the five trophic levels. Right column: scrolling alert panel with extinction events, at-risk warnings, and environmental event notifications. Demonstrates a current state mid-pollution-event with an otter extinction and bass at-risk alert.
- FILE: ./build/concept/concept-population-dashboard.svg
- FORMAT: SVG
- SCREENS COVERED: Population Dashboard (full screen with three primary regions)
- STYLE NOTES: Trophic-layer colours match CB-002. Alert tiles use semantic colour coding: red (extinction), amber (at risk), blue (informational event). Charts are full-bleed inside dark cards with subtle grid lines.
- TRACEABILITY: UC-004
- RELATED: CB-002, CB-004
---

## CB-004 : INTERVENTION PANEL
- SUMMARY: Two-column panel for direct ecosystem manipulation. Left column: scrollable species list with +1, +10, and "Remove all" controls per species, plus a Restore Baseline button. Right column: six environmental event triggers (Flood, Drought, Pollution, Cold Snap, Fire, Nutrient Runoff) shown as coloured cards, with an "Active" section showing the currently-running event and its progression.
- FILE: ./build/concept/concept-intervention-panel.svg
- FORMAT: SVG
- SCREENS COVERED: Intervention Panel (species controls + environmental events)
- STYLE NOTES: Destructive actions ("Remove all") use a muted red. Event tiles use a thematic colour per event type. Locally extinct species rows greyed out but still visible. Active event uses amber highlight to indicate ongoing state.
- TRACEABILITY: UC-005, UC-006
- RELATED: CB-001, CB-005
---

## CB-005 : GUIDED SCENARIOS
- SUMMARY: Top half: scenario picker showing five cards (Remove the Alligator, Mosquito Explosion, Algae Bloom, Beaver Dam, Drought Year), each with an icon, short description, and Start Scenario button. Bottom half: live view of a running scenario with a cascade checklist (auto-checking observable events as they happen) and a population mini-chart of the affected species since scenario start.
- FILE: ./build/concept/concept-scenarios.svg
- FORMAT: SVG
- SCREENS COVERED: Scenario picker + active scenario overlay
- STYLE NOTES: Scenario cards use the trophic-layer colour of the most-affected species in their headers. Checklist uses green checks for completed cascades, neutral grey for pending. Mini-chart inside the active overlay echoes the dashboard chart style for visual continuity.
- TRACEABILITY: UC-007, UC-008, UC-009, UC-010, UC-011
- RELATED: CB-003, CB-004
---

## CB-006 : SAVE / LOAD
- SUMMARY: Three vertically stacked save-slot cards. Each filled slot shows a snapshot icon, descriptive name (day + active condition), timestamp, agent count, ecosystem health summary, and current environmental variables. Two empty slots presented with dashed border and a single Save button. Demonstrates one slot mid-drought, one stable beaver-dam state, and one empty.
- FILE: ./build/concept/concept-saveload.svg
- FORMAT: SVG
- SCREENS COVERED: Save/Load panel (3 save slots)
- STYLE NOTES: Each filled slot has a distinctive icon reflecting its key event. Health summary uses green check for stable, amber warning for at-risk states. Overwrite (destructive) action visually distinct from non-destructive Load.
- TRACEABILITY: UC-014
- RELATED: CB-004
---

---

## Addendum Frames — Cartoon Sprites & UI (UC-015, UC-016, UC-017)

### Frame A — "The swamp wakes up" (UC-015)
A wide shot of the canvas. A heron stands on the mud bank, head tilted, eye blinking. A frog squats on a lily pad, throat sac inflating-deflating in a 4-frame loop. A dragonfly hovers near the cattails, wings shimmering. Cypress trees sway in the breeze. The user has done nothing — the scene is alive.

### Frame B — "A heron stalks left" (UC-016)
Mid-shot. The heron lifts one leg and steps to the left across the mud. Its sprite is mirrored to face left; legs cycle through a 6-frame walk. As it crosses the water line, it transitions to a wading idle (legs still, head scanning).

### Frame C — "Below the waterline" (UC-016)
A bass glides through reeds, body undulating in a 4-frame swim loop. A turtle paddles diagonally, all four limbs cycling. A frog dives off a pad — mid-air it briefly plays a "leap" frame, then transitions to swim animation as it enters the water.

### Frame D — "Above the canopy" (UC-016)
An osprey banks across the sky, wings beating in a 4-frame flap. A duck flock crosses the frame in a V, each duck flapping out-of-phase with the others. The swarm of mosquitoes near the cattails reads as a shimmering directional cloud.

### Frame E — "The HUD is part of the picture" (UC-017)
The top nav bar shows five chunky rounded tabs with hand-drawn icons: a tiny lily-pad for Canvas, a vine-knot for Food Web, a leaf-chart for Dashboard, a hand-tool for Intervention, a film-reel for Scenarios, a polaroid for Save/Load. The pause button is shaped like two cattail stems. On hover, it bounces gently.

### Frame F — "Picking a scenario" (UC-017)
Scenario picker screen. Five illustrated cards: "Alligator Removed" (silhouette of a gator with a question mark), "Mosquito Explosion" (cloud of cartoon mosquitoes), "Algae Bloom" (a swirling green pond), "Beaver Dam" (a stack of cartoon logs), "Drought Year" (a cracked-mud sun). Each card has a soft drop-shadow and a "Start" button styled as a wooden plaque.

### Frame G — "Polaroid saves" (UC-017)
The Save/Load panel shows three polaroid-frame cards. Each holds a thumbnail of the saved canvas with a hand-written-style date label and a brief state summary ("Day 45 — Drought active"). Empty slots show a faded outline of a frog with the caption "Empty — click to save."

### Frame H — "Inspector close-up" (UC-015)
The user clicks a frog. A picture-book panel slides in from the right showing a large version of the same frog sprite, idle animation playing (throat pulsing, blinking). Beneath: a hand-drawn label ribbon "Green Tree Frog", role tag "Primary consumer", an eats-list with mini-portraits of dragonfly larvae and mosquitoes, an eaten-by list with mini-portraits of heron and snake.

### Frame I — "Beaver at work" (UC-018)
Close-up of a shallow channel. A beaver swims from the right carrying a branch — the cartoon branch visibly sticks out of its mouth. The beaver arrives at the build-site marker (a red-ribbon flag sunk in the mud). Frame pauses on the "drop" phase: the branch falls with a small splash effect, landing across an already-laid log skeleton. Upstream, three other logs are already in place; mud blobs mark the joints. A progress tooltip reads "Dam 34% complete".

### Frame J — "Completed dam ecosystem" (UC-018)
Wide establishing shot. The dam is finished: a low, lumpy wall of cartoon logs and mud humps stretching across the channel. On the crest a heron stands one-legged, scanning downstream. Upstream the water is calmer and slightly higher than downstream; a shimmer gradient shows the level difference. Small fish icons cluster near the dam base. A frog sits on a protruding log. The dam inspect tooltip is open: "Structural health 91%, species using dam: heron, bass, leopard frog."

### Frame K — "Procedural terrain" (UC-019)
Zoomed-out canvas showing the full swamp layout. The terrain is clearly varied: a dark-teal deep channel meanders across the centre; pale-teal shallow flats flank it on both sides; warm-brown mudbanks jut out in two places; an olive-green land patch sits in the lower right with a raccoon silhouette on it; a deep-shadow cypress island occupies the upper left. No grid lines visible. In the top-right corner: a small seed-label chip reading "#seed: 4827".

### Frame L — "Zone transition" (UC-019)
An alligator is mid-crossing, half in water (swim posture, body horizontal, tail sweep) and half on the mudbank (legs deployed, body raised). The transition pixel is highlighted with a soft zone-boundary shimmer. A bubble-tooltip on the alligator reads "Switching locomotion: swim → walk".

### Frame M — "Plant life in summer" (UC-020)
The shallow-water zone is dense with cartoon plants. Lily pads bob asynchronously (some are mid-bob, some flat). Cattails sway right — their heads sketched with soft cross-hatching. A cypress tree's top leaves have motion lines on the right-hand frond. Algae patches pulse with a subtle radial-expand ring. Seasonal label in the corner: "Summer — maximum growth".

### Frame N — "Plant harvest" (UC-020)
A beaver chomps a cattail: the plant shakes (motion lines), then three frame-steps later a cartoon puff cloud replaces it (circular puff with small "+1 log" badge floating up). The beaver swims off carrying a stick icon.

### Frame O — "Night atmosphere" (UC-021)
The canvas is deep indigo. Three fireflies blink asynchronously — each a small glowing dot with a soft radial blur halo. The water surface has a faint bioluminescent stripe of teal-green algae. A time-of-day gradient bar at the top of the canvas shows a crescent-moon icon. The ambient-sound equaliser icon in the HUD pulses gently.

### Frame P — "Predation splash + milestone confetti" (UC-021)
Split frame. Left: a heron strikes; a cartoon splash burst (white starflare, water drops in arcs) appears at the predation site with a small fish icon fragmenting at the centre. Right: a canvas-wide confetti burst (multicolour swamp-palette squares and leaf shapes raining down) with a ribbon banner reading "First Beaver Dam Complete! 🦫".

### Frame Q — "Paused Dam Construction" (edge case for UC-018)
A dam skeleton is visible but no beaver is nearby. Tooltip reads: "Dam 41% — construction paused" with a muted amber status badge. Upstream/downstream water levels are steady, signaling no hidden background progress.

### Frame R — "Seed Recovery on Load" (edge case for UC-019)
A save slot is loaded from a run with an invalid historical hash. The top chip updates to a normalized value ("#seed: 9021"), and the terrain redraws with stable zones in one frame. No blank frame or fallback flat fill appears.

### Frame S — "Reduced-Motion Atmosphere" (simple accessibility case for UC-021)
Night scene with static firefly glow dots and non-animated EQ bars. Information remains readable via color/state labels: "Activity: 63 organisms", "Night", and a visible weather badge.
