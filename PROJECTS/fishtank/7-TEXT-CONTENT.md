# Text Content

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

---

## TC-001 : PAGE TITLE AND META DESCRIPTION

- **SUMMARY:** Browser tab title and HTML meta description for the Fish Tank Simulator application.
- **FILE:** `build/text/tc-001-meta.json`
- **CATEGORY:** `utility`
- **TONE NOTES:** Concise, evocative. Title: ≤ 32 characters. Description: 1 sentence,
  ≤ 155 characters. No exclamation marks. Present-tense, inviting.
- **GLOSSARY REFERENCES:** GL-001, GL-002
- **TRACEABILITY:** DI-001

---

## TC-002 : CAMERA MODE BUTTON LABELS

- **SUMMARY:** Button labels and aria-labels for the two camera mode toggle buttons in the
  HUD controls panel.
- **FILE:** `build/text/tc-002-camera-mode.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Single-word or two-word labels. Capitalised noun. Consistent with the
  spatial vocabulary of the glossary. No verbs.
- **GLOSSARY REFERENCES:** GL-003, GL-004
- **TRACEABILITY:** DI-016, DI-005

---

## TC-003 : SUBSTRATE SELECTOR LABELS

- **SUMMARY:** Label text for the substrate dropdown control and its three option values
  as they appear in the HUD.
- **FILE:** `build/text/tc-003-substrate.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Single common nouns, title case. Each option name should evoke the
  material without being technical (e.g. "Sand", not "Silica substrate").
- **GLOSSARY REFERENCES:** GL-005
- **TRACEABILITY:** DI-016, DI-010

---

## TC-004 : DECORATION TOGGLE LABELS

- **SUMMARY:** Label text for each decoration checkbox in the HUD, plus an accessible
  group heading.
- **FILE:** `build/text/tc-004-decorations.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Short noun phrases. Evocative and slightly playful (consistent with
  "Discoverable Wonder" theme). Each label ≤ 16 characters. Avoid generic terms like "Object 1".
- **GLOSSARY REFERENCES:** GL-006, GL-007, GL-008
- **TRACEABILITY:** DI-016, DI-010

---

## TC-005 : AUDIO TOGGLE BUTTON LABELS

- **SUMMARY:** Button label text for the audio toggle in the HUD in both enabled and
  disabled states, plus an aria-label.
- **FILE:** `build/text/tc-005-audio.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Imperative mood for the action state, declarative for the current state.
  Both states ≤ 12 characters. Friendly, not technical.
- **GLOSSARY REFERENCES:** GL-009
- **TRACEABILITY:** DI-016, DI-014

---

## TC-006 : SELECTION CARD CONTENT — FISH SPECIES

- **SUMMARY:** Display name and one-line description for each of the four fish species,
  shown in the HUD selection card when a fish is clicked.
- **FILE:** `build/text/tc-006-fish-species.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Warm, nature-documentary register. Display name: common English name,
  capitalised. Description: 1 sentence, ≤ 80 characters, present tense. Evokes personality
  and movement rather than Latin taxonomy.
- **GLOSSARY REFERENCES:** GL-010, GL-011, GL-012, GL-013
- **TRACEABILITY:** DI-016, DI-011, DI-012

---

## TC-007 : SELECTION CARD CONTENT — DECORATIONS

- **SUMMARY:** Display name and one-line description for each of the three interactive
  decoration objects, shown in the HUD selection card when a decoration is clicked.
- **FILE:** `build/text/tc-007-decorations-card.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Same register as TC-006. One sentence, ≤ 80 characters, present tense.
  Each decoration should feel like it has a story or a past.
- **GLOSSARY REFERENCES:** GL-006, GL-007, GL-008
- **TRACEABILITY:** DI-016, DI-010

---

## TC-008 : HUD CONTROL PANEL SECTION HEADING

- **SUMMARY:** Accessible heading text for the HUD controls panel, used as a screen-reader
  label for the region.
- **FILE:** `build/text/tc-008-hud-heading.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** 2–4 words, noun phrase. Should convey "controls for the tank" without
  being dry or overly technical. Used only by assistive technology — not visible on screen.
- **GLOSSARY REFERENCES:** GL-001
- **TRACEABILITY:** DI-016

---

## TC-009 : LOADING / INIT STATE TEXT

- **SUMMARY:** Brief status message displayed (or announced to screen readers) while the
  WebGL scene is initialising.
- **FILE:** `build/text/tc-009-loading.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** 1 short sentence. Calm, unhurried. Present continuous tense. Must not
  imply the app is broken or slow.
- **GLOSSARY REFERENCES:** GL-001, GL-002
- **TRACEABILITY:** DI-017

---

## TC-010 : ERROR FALLBACK TEXT

- **SUMMARY:** User-facing message displayed when WebGL is unavailable or initialisation
  fails.
- **FILE:** `build/text/tc-010-error.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Sympathetic, non-technical. 2 sentences maximum. Does not blame the user
  or expose internal error details. Offers a constructive suggestion (upgrade browser or
  enable hardware acceleration).
- **GLOSSARY REFERENCES:** GL-001
- **TRACEABILITY:** DI-017

---

## TC-011 : WINDOW MODE BUTTON

- **SUMMARY:** Button label for the clean front-window view toggle in the HUD, plus the
  aria-label for the corner exit button.
- **FILE:** `build/text/tc-011-window-mode.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Button label: single noun, ≤ 8 characters, title case. Communicates the
  transition to a clean view without implying fullscreen or browser-level action. Exit
  aria-label: imperative verb phrase ≤ 20 characters.
- **GLOSSARY REFERENCES:** GL-020
- **TRACEABILITY:** DI-022

---

## TC-012 : CRAB SELECTION CARD

- **SUMMARY:** Display name, one-line description, and interaction tooltip for the crab
  entity, shown in the HUD selection card when the crab is clicked.
- **FILE:** `build/text/tc-012-crab-card.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** Same warm, nature-documentary register as TC-006. Display name: common
  English name, capitalised. Description: 1 sentence, ≤ 80 characters, present tense.
  Interaction tooltip: ≤ 24 characters, present tense, evokes behaviour rather than mechanics.
- **GLOSSARY REFERENCES:** GL-019, GL-021
- **TRACEABILITY:** DI-021

---

## TC-013 : LOCOMOTION MODE ACCESSIBLE LABELS

- **SUMMARY:** Short accessible labels for each fish locomotion mode, shown as a secondary
  line in the species selection card below the fish description.
- **FILE:** `build/text/tc-013-locomotion-labels.json`
- **CATEGORY:** `ui`
- **TONE NOTES:** 2–4 words per label. Plain English — do not use scientific Latin terms in
  the visible label. Scientific name may appear in a parenthetical for curious users. Conveys
  the observable motion pattern rather than anatomy.
- **GLOSSARY REFERENCES:** GL-022, GL-023
- **TRACEABILITY:** DI-020

---

## GLOSSARY

| GL-ID | Term | Definition |
|-------|------|------------|
| GL-001 | Fish Tank Simulator | The application: a browser-based, interactive, real-time aquarium rendered in WebGL. |
| GL-002 | Tank | The virtual aquarium environment visible in the browser viewport. |
| GL-003 | Isometric View | A camera perspective that presents the tank at a fixed 45° overhead angle, emphasising the full layout of the environment. |
| GL-004 | 3/4 View | A perspective camera angle that positions the viewer slightly above and in front of the tank, giving depth and dimensionality. |
| GL-005 | Substrate | The material covering the floor of the tank (sand, gravel, or rock). |
| GL-006 | Shipwreck | A decorative sunken vessel resting on the tank floor, providing shelter and visual interest. |
| GL-007 | Rocks | A cluster of stone formations on the tank floor that fish navigate around. |
| GL-008 | Artifacts | Treasure-chest decorations on the tank floor — the small, storied objects of the tank world. |
| GL-009 | Ambient Sound | The looping underwater audio atmosphere: flowing water and bubbling. Not music. |
| GL-010 | Clownfish | A bold orange-and-white reef fish that darts actively near the mid-water column. |
| GL-011 | Angelfish | A graceful, sail-finned fish that drifts slowly through the mid-tank, preferring open space. |
| GL-012 | Tetra | A small, fast schooling fish that moves in tight coordinated groups near the surface. |
| GL-013 | Gourami | A calm, deliberate fish that lingers near the substrate, exploring the lower reaches of the tank. |
| GL-014 | Bubbler | The aerator device at the back-left corner of the tank that produces a rising column of bubbles. |
| GL-015 | Water Current | The invisible flow of water through the tank, influenced by the bubbler, fish movement, and feeding. Visible through its effect on plants and particles. |
| GL-016 | Caustics | The shimmering light patterns projected onto the substrate and walls by refraction through the water surface. |
| GL-017 | Feeding | The act of dropping food particles into the tank by clicking or tapping the water surface. Fish swim to consume them. |
| GL-018 | Selection | Clicking or tapping a fish or decoration to reveal its name and description in the info card. |
| GL-019 | Crab | The bottom-dwelling crustacean resident of the tank substrate zone, characterised by sideways locomotion and prominent claws. |
| GL-020 | Window Mode | A clean, chrome-free view of the tank that hides all HUD controls, activated by the Window button and exited via Escape or the corner exit control. |
| GL-021 | Defensive Display | The crab's behavioural response to a nearby interaction: raising both claws outward and holding them elevated for approximately 2.5 seconds before returning to idle. |
| GL-022 | Fin-rowing swim | Locomotion driven by sculling pectoral fins while the body remains largely still. Characteristic of angelfish. Scientific name: labriform. |
| GL-023 | Body-wave swim | Locomotion driven by an undulating wave propagating through the rear half of the body. Characteristic of tetras. Scientific name: subcarangiform. |

---

## PHRASEBOOK

| Category | Correct Phrasing | Incorrect Phrasing | Notes |
|----------|------------------|--------------------|-------|
| Product name | Fish Tank Simulator | Fish Tank Sim, FTS, the simulator | Always write the full product name in UI-visible text. |
| Tank reference | "the tank" | "the aquarium", "the scene", "the canvas" | Consistent with the "Tank as World" mental model. |
| Camera modes | "Isometric View", "3/4 View" | "Top-down", "Perspective", "Camera 1/2" | Use the glossary terms exactly, including capitalisation. |
| Substrate options | "Sand", "Gravel", "Rock" | "sandy", "gravel substrate", "rocks" | Single capitalised nouns only. |
| Decoration names | "Shipwreck", "Rocks", "Artifacts" | "obstacle", "object", "item", "prop" | Capitalised nouns as defined in glossary. |
| Fish species | "Clownfish", "Angelfish", "Tetra", "Gourami" | "clownfish (Amphiprioninae)", lowercase species names | Common English names, capitalised in card headings. Lowercase in running body text. |
| Audio control | "Sound On" / "Sound Off" | "Enable Audio", "Mute", "Toggle Sound" | Match TC-005 exactly. |
| Feeding action | "Feed the fish" / "Drop food" | "Add particles", "Spawn food", "Click to feed" | Use human-scale language, not technical. |
| Water movement | "the current", "the flow" | "fluid grid", "velocity field", "simulation" | Never expose simulation internals in UI text. |
| Caustics | "shimmering light" (in descriptive text) | "caustics", "GLSL", "shader" | Technical terms belong in the glossary only, not in UI copy. |
| Error messages | "your browser may not support…" | "WebGL context creation failed", "Error: …" | Sympathetic, non-technical. Never expose stack traces. |
| Loading state | "Setting up your tank…" | "Loading…", "Initialising WebGL…", "Please wait" | Vivid and unhurried. |
| Selection card | "Species:", "Decoration:" | "Type:", "Object:", "ID:" | Match TC-006 / TC-007 labels exactly. |
| Plural fish | "fish" (plural) | "fishes" | Standard English for aquatic species. |
| Window mode button | "Window" | "Full Screen", "Clean Mode", "Cinema", "Window View" | Single noun. Does not imply OS-level fullscreen. |
| Exit window mode | aria-label: "Exit window mode" | "Close", "Back", "Exit fullscreen" | Matches the corner exit button aria-label in TC-011. |
| Crab name | "Crab" (in card heading), "the crab" (in body text) | "crustacean", "creature", "bottom dweller" | Capitalised in card heading; lowercase in running text. |
| Crab interaction | "Claw display" | "defensive posture", "attack animation", "triggered behaviour" | Evokes the observable action without exposing animation terminology. |
| Locomotion labels | "Fin-rowing swim", "Body-wave swim", "Tail-drive swim" | "labriform", "subcarangiform", "carangiform" | Plain English labels in visible UI; scientific name in parenthetical only. |
| Speed state | "gliding", "cruising", "darting" | "idle", "cruise", "burst" | Human-scale motion words if locomotion state ever surfaces in UI copy. |

---

## Exit Gate

- [x] `7-TEXT-CONTENT.md` contains a GLOSSARY table and a PHRASEBOOK table.
- [x] Every text-bearing DI (DI-001, DI-005, DI-010, DI-011, DI-012, DI-014, DI-016, DI-017, DI-020, DI-021, DI-022) has a corresponding TC record.
- [x] Every TC record has a FILE path that will exist in `./build/text/`.
- [x] Every TC record includes TRACEABILITY to at least one DI-ID.
- [x] Glossary entries are consistent with phrasebook entries (no contradictions).
- [x] `PIPELINE-STATUS.md` is updated for Stage 7 with STATUS and STATUS UPDATED date.
