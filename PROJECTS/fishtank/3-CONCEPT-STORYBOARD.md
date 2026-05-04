# Concept Storyboard

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

---

## CB-001 : MAIN TANK SCENE

- **SUMMARY:** Full-viewport aquarium scene showing all primary visual zones, HUD overlay, lighting,
  fish swim zone, substrate, bubbler, and decorations in a single annotated layout.
- **FILE:** `./build/concept/cb-001-main-tank-scene.svg`
- **FORMAT:** SVG — labelled regions, dark background, clear zone boundaries.
- **SCREENS COVERED:** Primary tank view, HUD overlay bar, water surface, fish swim zone,
  substrate layer, bubbler column, light-ray caustics annotation.
- **STYLE NOTES:** Dark underwater palette (#0d1117 base); blue-tinted water column (#071830);
  warm substrate (#1c1408); muted annotation borders; soft particle opacity.
- **TRACEABILITY:** UC-001, UC-008, UC-012.
- **RELATED:** CB-002, CB-003, CB-004, CB-005.

---

## CB-002 : CONTROLS AND CONFIGURATION PANEL

- **SUMMARY:** Side-panel controls screen showing camera mode selector, substrate dropdown,
  decoration toggles, and audio ambiance toggle alongside a live mini tank view.
- **FILE:** `./build/concept/cb-002-controls-panel.svg`
- **FORMAT:** SVG — two-column layout (tank preview + controls panel), toggle switches, dropdown.
- **SCREENS COVERED:** Settings/controls overlay, camera mode selection (Isometric / 3-4),
  substrate selector, decoration on/off toggles, audio enable/disable control.
- **STYLE NOTES:** Controls panel uses #161b22 surface; active selections use blue accent (#1f6feb);
  inactive toggles in muted (#21262d); immediate scene update feedback noted in tank preview.
- **TRACEABILITY:** UC-002, UC-003.
- **RELATED:** CB-001.

---

## CB-003 : FEEDING AND INTERACTION FLOW

- **SUMMARY:** Three-frame sequential storyboard illustrating the complete feeding and fish/decor
  selection interaction: user input, fish response, and selection tooltip feedback.
- **FILE:** `./build/concept/cb-003-feeding-interaction.svg`
- **FORMAT:** SVG — three side-by-side frames with directional arrows, each labelled with AC references.
- **SCREENS COVERED:** Frame 1 — click/tap input at water surface; Frame 2 — food particle drop
  and fish movement response; Frame 3 — fish selection highlight and decoration context tooltip.
- **STYLE NOTES:** Each frame uses a distinct role-colour border (blue, amber, red) to convey the
  three actor types: user, system physics, and selection feedback. Dashed arrows for movement intent.
- **TRACEABILITY:** UC-006, UC-007, UC-011.
- **RELATED:** CB-001, CB-005.

---

## CB-004 : WATER AND ENVIRONMENTAL DYNAMICS

- **SUMMARY:** Cross-section diagram of the tank annotating all dynamic physics systems: bubble
  column, current field vectors, plant sway, particle drift, fish wake, and substrate.
- **FILE:** `./build/concept/cb-004-water-dynamics.svg`
- **FORMAT:** SVG — annotated cross-section with current-flow arrows, bubble trail, plant curves,
  and drift particle dots.
- **SCREENS COVERED:** Water physics overlay on primary tank scene — not a separate UI screen but
  a visual documentation of simulation layers active in the main view.
- **STYLE NOTES:** Current vectors in blue dashed lines; bubble column in low-opacity cyan circles;
  plant motion in green curves; particle field in muted grey dots; fish wake in amber dashes.
- **TRACEABILITY:** UC-004, UC-009, UC-010.
- **RELATED:** CB-001, CB-003.

---

## CB-005 : FISH SPECIES AND BEHAVIOURS

- **SUMMARY:** Multi-species tank view showing four distinct species with labelled swim paths,
  movement style annotations, contextual info cards, and a selection highlight on one fish.
- **FILE:** `./build/concept/cb-005-fish-species.svg`
- **FORMAT:** SVG — annotated fish positions with individual path trails, info-card tooltips,
  and a selection ring around one active species.
- **SCREENS COVERED:** Main tank species view; fish selection interaction state; per-species
  behaviour annotation (shoaling, territorial, darting, bottom-hugging).
- **STYLE NOTES:** Each species uses a distinct accent colour (red, green, blue, amber) from
  the role palette to differentiate characters; info cards use role-border colour matching the
  species; selection ring uses primary white (#e6edf3) to stand out clearly from species colour.
- **TRACEABILITY:** UC-005, UC-007.
- **RELATED:** CB-001, CB-003.

---

## CB-006 : PHOTOREALISTIC FISH DETAIL VIEW

- **SUMMARY:** Close-up annotated view of two fish species demonstrating photorealistic rendering
  features: PBR scale texture with per-scale specular highlights, translucent fin membranes,
  iridescent flank markings, and a specular point-highlight on the eye. Annotations call out each
  material property.
- **FILE:** `./build/concept/cb-006-photorealistic-fish-detail.svg`
- **FORMAT:** SVG — two-fish comparison panel; left fish fully lit (scale detail visible), right
  fish in profile showing fin translucency. Annotation lines with labels for: scale texture,
  fin membrane, eye specular, caustic light falling on body.
- **SCREENS COVERED:** Main tank view, any camera mode — this is a rendering-quality documentation
  panel, not a separate UI screen.
- **STYLE NOTES:** Deep blue background (#071830); scale highlights in warm gold (#c9a84c);
  translucent fin in low-opacity cyan (#80d4e0, opacity 0.35); eye specular as a pure white
  point (#ffffff) with a radial gradient halo; caustic overlay as irregular amber patches.
- **TRACEABILITY:** UC-013.
- **RELATED:** CB-001, CB-005.

---

## CB-007 : SPECIES LOCOMOTION MODE COMPARISON

- **SUMMARY:** Three-column storyboard panel comparing three biomechanically distinct swimming
  modes side by side — labriform (reef fish: pectoral-fin rowing), subcarangiform (schooling fish:
  rear-half body undulation), and carangiform (goldfish/cichlid: stiff body + tail oscillation).
  Each column shows idle, cruise, and burst speed states with silhouette-overlay to illustrate
  body-wave amplitude change.
- **FILE:** `./build/concept/cb-007-locomotion-modes.svg`
- **FORMAT:** SVG — three columns × three rows (mode × speed state). Each cell shows a fish
  silhouette with body-wave overlay arc and an amplitude annotation. Column headers: LABRIFORM /
  SUBCARANGIFORM / CARANGIFORM. Row headers: IDLE / CRUISE / BURST.
- **SCREENS COVERED:** Background simulation — no UI screen; documents the animation parameter
  range for design instruction traceability.
- **STYLE NOTES:** Silhouettes in white (#e6edf3); body-wave arcs in blue-green (#3fb950) for
  idle, amber (#d29922) for cruise, red (#f85149) for burst; column-header rule colours match
  the accent palette.
- **TRACEABILITY:** UC-014.
- **RELATED:** CB-005, CB-006.

---

## CB-008 : PHOTOREALISTIC CRAB — BOTTOM ZONE VIEW

- **SUMMARY:** Tank bottom-zone panel centred on the photorealistic crab showing carapace texture,
  all eight jointed legs with alternating gait positions (four left/four right in mid-step),
  articulated claws (one raised, one lowered in idle cycle), and substrate context (gravel,
  plant bases, bubbler near-field). An inset shows the defensive claw-raise display triggered
  by click/tap.
- **FILE:** `./build/concept/cb-008-crab-bottom-view.svg`
- **FORMAT:** SVG — main panel (bottom-zone side view) plus an inset box (defensive display state).
  Annotation lines point to: carapace texture region, leg joint pivot points, claw anatomy, gait
  direction arrow.
- **SCREENS COVERED:** Main tank view (substrate layer); defensive-display inset is a documentation
  state, not a separate screen.
- **STYLE NOTES:** Carapace in warm reddish-brown (#7c3f1e) with lighter highlight streaks;
  legs and claws in slightly darker tone (#5a2d12); substrate in muted sandy tan (#1c1408);
  gait direction arrow in blue; defensive claw-raise inset has an amber border to indicate
  interactive trigger state.
- **TRACEABILITY:** UC-015.
- **RELATED:** CB-001, CB-004.

---

## CB-009 : CLEAN FRONT-WINDOW VIEW MODE

- **SUMMARY:** Full-viewport panel showing the product in front-window mode: no HUD, no controls
  panel, no tooltips — only the aquarium glass face with fish and crab visible. An annotation
  overlay shows the single corner-icon exit control (low-opacity, appears on hover). A before/after
  comparison strip at the top shows the normal HUD state transitioning to the clean window state.
- **FILE:** `./build/concept/cb-009-front-window-mode.svg`
- **FORMAT:** SVG — primary panel (clean window, full viewport); comparison strip (two mini
  thumbnails: HUD-visible and HUD-hidden states); corner icon annotation with expand-arrow symbol.
- **SCREENS COVERED:** Clean front-window view mode (UC-016 primary screen); hover-reveal corner
  exit control.
- **STYLE NOTES:** Primary panel is near-frameless — thin glass border only (#1f2937 1px);
  corner icon in #8b949e (muted grey) with opacity 0.5; comparison strip uses a thin amber
  border (#d29922) to mark the "before" thumbnail and a thin blue (#1f6feb) border for the
  "after" thumbnail.
- **TRACEABILITY:** UC-016.
- **RELATED:** CB-001, CB-002.

---

## Exit Gate

- [x] `3-CONCEPT-STORYBOARD.md` contains at least one CB record per major UC flow.
- [x] Every CB record follows the schema (all fields present).
- [x] Every CB FILE path exists and is a non-empty SVG.
- [x] No CB file is a placeholder stub — each must contain meaningful visual structure.
- [x] TRACEABILITY field references valid UC-IDs.
- [x] SVG files are legible at standard screen resolution.
- [x] `PIPELINE-STATUS.md` is updated for Stage 3 with STATUS and STATUS UPDATED date.
