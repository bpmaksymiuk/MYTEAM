# Graphic Assets

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

---

## GA-001 : SYSTEM ARCHITECTURE OVERVIEW

- **SUMMARY:** A handoff diagram showing all 18 source modules (PT-001–PT-018), their
  subsystem groupings, and the primary dependency arrows between them.
- **FILE:** `./build/images/ga-001-architecture-overview.svg`
- **FORMAT:** SVG, 1200 × 800 px viewBox
- **STYLE NOTES:** Dark theme (`#0d1117` background). Subsystem swimlanes with
  labelled group borders. Module boxes colour-coded by subsystem category (renderer,
  simulation, fish, environment, audio, input, ui, state, build). Role colours from
  Graphic Artwork skill standard applied to category borders. Arrows with arrowhead markers.
  Primary font: `'Segoe UI', system-ui, sans-serif`.
- **FLAVORS:**
  1. Layered horizontal swimlanes (selected) — subsystems arranged top-to-bottom by
     dependency tier; clear data-flow direction left-to-right.
  2. Radial graph — AppState at centre, subsystems radiating outward. Rejected: difficult
     to show directed dependency ordering.
  3. Matrix grid — all modules in equal cells with a dependency matrix overlay. Rejected:
     too dense at 18 nodes.
- **SELECTED FLAVOR:** Layered horizontal swimlanes. Justification: aligns with the
  bootstrap sequence in DI-017 and makes dependency ordering immediately legible.
- **TRACEABILITY:** DI-001, DI-017
- **RELATED:** CB-001. GA-002.

---

## GA-002 : RENDER LOOP AND TICK SEQUENCE

- **SUMMARY:** A timing sequence diagram showing one rAF frame: the order of tick
  callbacks registered in `main.ts`, the render call at the end, and the delta-time
  cap boundary.
- **FILE:** `./build/images/ga-002-render-loop.svg`
- **FORMAT:** SVG, 900 × 500 px viewBox
- **STYLE NOTES:** Horizontal timeline with labelled vertical swimlanes per system.
  Frame boundary boxes at left and right edges. Delta-time cap annotation. Arrows show
  call order. Colour coding matches GA-001 subsystem palette.
- **FLAVORS:**
  1. Horizontal sequence swimlanes (selected) — clearest for showing ordered calls within a
     single frame.
  2. UML sequence diagram style. Rejected: too formal for a handoff diagram; lifelines add
     visual noise.
- **SELECTED FLAVOR:** Horizontal sequence swimlanes.
- **TRACEABILITY:** DI-003, DI-017
- **RELATED:** GA-001.

---

## GA-003 : FLUID GRID AND SUBSYSTEM INTERACTIONS

- **SUMMARY:** A data-flow diagram showing `FluidGrid` as the central shared resource,
  with annotated read/write arrows to and from `BubbleSystem`, `FishAgent`, `ParticleSystem`,
  and `PlantSystem`.
- **FILE:** `./build/images/ga-003-fluid-grid-interactions.svg`
- **FORMAT:** SVG, 900 × 600 px viewBox
- **STYLE NOTES:** `FluidGrid` in the centre as a large rounded rectangle. Surrounding
  subsystem boxes in subsystem colours. Arrows annotated with the API method name
  (`addImpulse`, `sample`, `step`). Read arrows distinguished from write arrows by
  arrowhead style (open vs filled).
- **FLAVORS:**
  1. Hub-and-spoke centred on FluidGrid (selected).
  2. Top-to-bottom flow with FluidGrid as a horizontal band. Rejected: less intuitive
     for a shared resource.
- **SELECTED FLAVOR:** Hub-and-spoke.
- **TRACEABILITY:** DI-006, DI-007, DI-008, DI-009, DI-013
- **RELATED:** CB-004. GA-001.

---

## GA-004 : INPUT AND ACTION DISPATCH FLOW

- **SUMMARY:** A flow diagram showing user input events (pointer, pinch, pan) travelling
  through `InputManager` to typed `GameAction` objects, then dispatched to `ParticleSystem`
  (feed), `HUD` (select), and `SceneManager` (zoom).
- **FILE:** `./build/images/ga-004-input-flow.svg`
- **FORMAT:** SVG, 900 × 520 px viewBox
- **STYLE NOTES:** Left-to-right flow. Input event sources on the left (browser events,
  HammerJS). Typed action discriminators in the centre. Handler destinations on the right.
  Decision diamond for action type dispatch. Consistent dark theme.
- **FLAVORS:**
  1. Left-to-right event flow (selected).
  2. Vertical swimlane per action type. Rejected: redundant lanes for only four action types.
- **SELECTED FLAVOR:** Left-to-right event flow.
- **TRACEABILITY:** DI-015, DI-016, DI-017
- **RELATED:** CB-002, CB-003. GA-001.

---

## GA-005 : HUD LAYOUT SPECIFICATION

- **SUMMARY:** A production-quality annotated wireframe of the HUD overlay showing
  exact control positions, element IDs, z-ordering, and pointer-event regions.
- **FILE:** `./build/images/ga-005-hud-layout.svg`
- **FORMAT:** SVG, 1200 × 700 px viewBox (16:9 viewport)
- **STYLE NOTES:** Semi-transparent viewport background (`#0d1117` at 40% opacity).
  HUD controls panel in top-left. Selection card in bottom-right. All DOM element IDs
  annotated with leader lines. Pointer-event regions colour-coded (pass-through grey,
  active region blue). Dimensions marked in viewport units.
- **FLAVORS:**
  1. Annotated wireframe (selected) — shows exact layout and element hierarchy.
  2. Rendered mockup (screenshot-style). Rejected: harder to annotate and maintain;
     concept work in CB-002 already covers the visual impression.
- **SELECTED FLAVOR:** Annotated wireframe.
- **TRACEABILITY:** DI-016
- **RELATED:** CB-002. GA-004.

---

## GA-006 : FISH PBR MATERIAL SYSTEM DIAGRAM

- **SUMMARY:** A handoff diagram showing the data pipeline from `ScaleTextureShader` through
  `FishMesh`, illustrating the three mesh layers (body, fin overlays, eye sphere) and the
  material properties applied to each.
- **FILE:** `./build/images/ga-006-fish-pbr-material.svg`
- **FORMAT:** SVG, 1100 × 680 px viewBox
- **STYLE NOTES:** Dark theme. Left column: `ScaleTextureShader` block showing GLSL hex
  pattern → WebGLRenderTarget → DataTexture output. Right section: exploded layering diagram
  of the three FishMesh components (body sphere, fin planes, eye sphere) with material
  property callouts (opacity, roughness, metalness). Arrows show texture assignment.
  Colour palette: fish subsystem red (`#b91c1c` border / `#f78166` text) for module boxes.
- **FLAVORS:**
  1. Exploded layer diagram (selected) — clearly separates the three mesh layers and their
     distinct material configurations.
  2. UML component diagram. Rejected: too formal; callout annotations communicate more in
     a handoff context.
  3. Screenshot-style mockup. Rejected: concept work in CB-006 already covers visual result.
- **SELECTED FLAVOR:** Exploded layer diagram with material property callouts.
- **TRACEABILITY:** DI-019
- **RELATED:** CB-006. GA-001.

---

## GA-007 : FISH SKELETAL ANIMATION RIG DIAGRAM

- **SUMMARY:** A handoff diagram showing the bone chain layout (8 spine + 4 pectoral + 1 dorsal
  bones), the AnimationMixer clip graph with crossfade durations, and a phase-offset chart
  illustrating how the sine-wave amplitude increases toward the tail.
- **FILE:** `./build/images/ga-007-fish-animation-rig.svg`
- **FORMAT:** SVG, 1200 × 720 px viewBox
- **STYLE NOTES:** Two panels. Left panel: fish silhouette with numbered bone nodes overlaid,
  pectoral bones highlighted in accent colour, amplitude multiplier labels (`×0.0` at head
  to `×1.0` at tail). Right panel: directed graph of the 4 AnimationMixer clips (idle, cruise,
  burst, cstart) with crossfade durations annotated on edges. C-start → burst edge dashed
  and labelled "0.25 s then crossfade".
- **FLAVORS:**
  1. Dual-panel silhouette + clip graph (selected) — communicates both spatial rig and
     temporal state machine in one diagram.
  2. Separate diagrams per concern. Rejected: increases artefact count; both panels fit
     comfortably at 1200 × 720.
- **SELECTED FLAVOR:** Dual-panel layout.
- **TRACEABILITY:** DI-020
- **RELATED:** CB-007. GA-001.

---

## GA-008 : CRAB ENTITY HIERARCHY DIAGRAM

- **SUMMARY:** A handoff diagram showing the `CrabEntity` `THREE.Object3D` hierarchy tree,
  the gait oscillator phase-offset table, the leg segment labelling (coxa/merus/dactyl),
  and the defensive display clip timeline.
- **FILE:** `./build/images/ga-008-crab-entity-hierarchy.svg`
- **FORMAT:** SVG, 1100 × 760 px viewBox
- **STYLE NOTES:** Three panels. Top-left: tree diagram of the Object3D hierarchy (root →
  carapace, 8 leg roots, 2 claw roots) with segment labels. Top-right: table of 4 pairs of
  legs × side with phase offsets `[0, π/4, π/2, 3π/4]` and side offset `+π`. Bottom: linear
  defensive display clip timeline (0 s → raise merus to 80° → hold → return at 2.8 s).
- **FLAVORS:**
  1. Three-panel annotated diagram (selected) — each concern (hierarchy, gait, clip) gets
     a dedicated region without crowding.
  2. Single large tree. Rejected: gait table and clip timeline do not fit naturally in a
     tree structure.
- **SELECTED FLAVOR:** Three-panel layout.
- **TRACEABILITY:** DI-021
- **RELATED:** CB-008. GA-001.

---

## GA-009 : FRONT-WINDOW MODE STATE DIAGRAM

- **SUMMARY:** A handoff diagram showing the two application states (Normal and Window Mode),
  the triggers that transition between them (button click → activate; Escape / exit-btn →
  deactivate), and the DOM and camera changes that occur on each transition.
- **FILE:** `./build/images/ga-009-front-window-mode.svg`
- **FORMAT:** SVG, 1000 × 580 px viewBox
- **STYLE NOTES:** Two large rounded-rectangle state boxes side by side. Left: Normal state
  (PerspectiveCamera, #hud-root visible, #exit-window-btn hidden). Right: Window Mode state
  (OrthographicCamera, #hud-root display:none, #exit-window-btn visible). Transition arrows
  between states labelled with trigger and DOM/camera side-effects. Consistent dark theme.
- **FLAVORS:**
  1. State machine diagram (selected) — directly mirrors the FrontWindowMode.ts `activate` /
     `deactivate` methods.
  2. Before/after screenshot comparison. Rejected: CB-009 already covers the visual result;
     handoff artifact should communicate code-level state changes.
- **SELECTED FLAVOR:** State machine diagram.
- **TRACEABILITY:** DI-022
- **RELATED:** CB-009. GA-005.

---

## Exit Gate

- [x] `./build/images/` contains final approved assets for all image-bearing DIs.
- [x] `8-GRAPHIC-ASSETS.md` has one GA record per image-bearing DI.
- [x] Every GA FILE path exists and is a non-empty SVG or PNG.
- [x] TRACEABILITY fields reference valid DI-IDs.
- [x] FLAVORS and SELECTED FLAVOR fields are completed.
- [x] Stage 3 concept files in `./build/concept/` are unmodified.
- [x] All assets follow the visual style standards for colour, typography, and layout.
- [x] `PIPELINE-STATUS.md` is updated for Stage 8 with STATUS and STATUS UPDATED date.
