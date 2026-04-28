# SwampSimulator — Text Content

### GLOSSARY

| GL-ID | Term | Canonical Form | Definition | First Appears |
|-------|------|----------------|------------|---------------|
| GL-001 | trophic level | trophic level | One of five tiers in the food web: producer, primary consumer, secondary consumer, apex predator, decomposer. | DI-004 |
| GL-002 | producer | producer | An organism that converts sunlight or nutrients into biomass (algae, plants). | DI-004 |
| GL-003 | primary consumer | primary consumer | A herbivore that eats producers (e.g. tadpole, snail, deer). | DI-004 |
| GL-004 | secondary consumer | secondary consumer | A small carnivore that eats primary consumers (e.g. frog, bass, dragonfly). | DI-004 |
| GL-005 | apex predator | apex predator | A top-of-chain predator with no natural predators in this ecosystem (alligator, panther, owl). | DI-004 |
| GL-006 | decomposer | decomposer | An organism that recycles dead matter into nutrients (vulture, bacteria, beaver as engineer). | DI-004 |
| GL-007 | gator-hole | gator-hole | A small water depression maintained by an alligator that retains water through drought, sustaining other species. | DI-008 |
| GL-008 | trophic cascade | cascade | A sequence of population shifts triggered by a change at one trophic level. | DI-015 |
| GL-009 | bioindicator | bioindicator | A species whose health signals overall ecosystem condition (e.g. frog for water quality). | DI-004 |
| GL-010 | biomass | biomass | The total mass of living matter in a category, used for the stacked dashboard chart. | DI-012 |
| GL-011 | nutrient runoff | nutrient runoff | An influx of nutrients (often nitrogen/phosphorus) that overstimulates algae growth. | DI-007 |
| GL-012 | algae bloom | algae bloom | Rapid expansion of algae mass that suppresses oxygen and harms aquatic species. | DI-015 |
| GL-013 | drought year | drought year | An extended period of low rainfall that lowers water level and stresses aquatic species. | DI-015 |
| GL-014 | beaver dam | beaver dam | An engineered structure that raises baseline water level and expands aquatic zones. | DI-009 |
| GL-015 | migratory species | migratory species | A species present only during certain seasons (e.g. duck, osprey). | DI-007 |
| GL-016 | baseline | baseline | The default starting population for a species; restored by Restore Baseline. | DI-014 |
| GL-017 | tick | tick | One simulation step in the per-frame update loop. | DI-005 |
| GL-018 | overlay | overlay | A toggleable visual layer rendered over the ecosystem canvas. | DI-010 |
| GL-019 | scenario | scenario | A guided lesson that pre-configures the ecosystem and tracks a checklist of expected outcomes. | DI-015 |
| GL-020 | extinction | extinction | The state in which a species' agent count reaches zero. | DI-012 |

### PHRASEBOOK

| Category | Tone | Voice | Avoid | Example |
|----------|------|-------|-------|---------|
| Utility | Direct, calm | Imperative or stateless | Hype, exclamation marks | "Save complete." |
| UI | Brief, neutral | Noun phrases for labels | Verbose explanations | "Population" |
| Narrative | Quietly observational, naturalist | Third person | Anthropomorphism, moralising | "When the alligator is gone, the snake population rises and the bass thrive in turn." |
| Alerts | Factual | Past tense for events | Alarmist language | "Bass population dropped below 10% of baseline." |
| Scenario intro | Inviting, curious | Second person, light | Quizzing, scoring | "Watch what happens when the apex predator is removed." |
| Tooltips | Concise factual | Sentence fragments | Punctuation-heavy text | "Eats: mosquito, dragonfly, snail" |

---

## TC-001 : Top-nav and screen labels
- SUMMARY: Static button labels for the top navigation and screen headings.
- FILE: ./build/text/ui/tc-001-nav-labels.md
- CATEGORY: UI
- TONE NOTES: Brief noun phrases.
- GLOSSARY REFERENCES: GL-018, GL-019
- TRACEABILITY: DI-001
- RELATED: UC-001, UC-002, UC-004, UC-014
---

## TC-002 : Time control labels and readouts
- SUMMARY: Pause/play, speed, skip-season labels and the time readout format.
- FILE: ./build/text/ui/tc-002-time-controls.md
- CATEGORY: UI
- TONE NOTES: Direct, minimal punctuation.
- GLOSSARY REFERENCES: GL-017
- TRACEABILITY: DI-001, DI-017
- RELATED: UC-012
---

## TC-003 : Species role descriptions
- SUMMARY: One-sentence ecological role text per species, used by the species inspector.
- FILE: ./build/text/narrative/tc-003-species-roles.md
- CATEGORY: Narrative
- TONE NOTES: Naturalist, third person, factual.
- GLOSSARY REFERENCES: GL-001, GL-002, GL-003, GL-004, GL-005, GL-006, GL-009
- TRACEABILITY: DI-004, DI-013
- RELATED: UC-002
---

## TC-004 : Inspector panel labels
- SUMMARY: Section labels: Trophic level, Population, Eats, Eaten by, Sensitivities.
- FILE: ./build/text/ui/tc-004-inspector-labels.md
- CATEGORY: UI
- GLOSSARY REFERENCES: GL-001, GL-009
- TRACEABILITY: DI-013
- RELATED: UC-002
---

## TC-005 : Dashboard labels and units
- SUMMARY: Chart titles, axis labels, biomass legend.
- FILE: ./build/text/ui/tc-005-dashboard-labels.md
- CATEGORY: UI
- GLOSSARY REFERENCES: GL-010, GL-001
- TRACEABILITY: DI-012
- RELATED: UC-004
---

## TC-006 : Alert panel message templates
- SUMMARY: Templates for extinction, near-extinction, event-start, event-end, scenario completion alerts.
- FILE: ./build/text/utility/tc-006-alert-templates.md
- CATEGORY: Alerts
- TONE NOTES: Factual, past tense for events.
- GLOSSARY REFERENCES: GL-016, GL-020
- TRACEABILITY: DI-012
- RELATED: UC-004, UC-006
---

## TC-007 : Intervention panel labels and confirmations
- SUMMARY: Species-control row labels, +1/+10/Remove all buttons, Restore Baseline confirmation, event-trigger card titles.
- FILE: ./build/text/ui/tc-007-intervention-labels.md
- CATEGORY: UI
- GLOSSARY REFERENCES: GL-016, GL-008
- TRACEABILITY: DI-014
- RELATED: UC-005, UC-006
---

## TC-008 : Environmental event card text
- SUMMARY: Title + one-line description for each of the six event triggers (drought, flood, pollution, fire, runoff, cold-snap).
- FILE: ./build/text/utility/tc-008-event-cards.md
- CATEGORY: Utility
- GLOSSARY REFERENCES: GL-011, GL-013
- TRACEABILITY: DI-007, DI-014
- RELATED: UC-006
---

## TC-009 : Scenario intros, checklists and summary templates
- SUMMARY: Title, intro paragraph, four checklist labels, and summary template for each of the five scenarios.
- FILE: ./build/text/narrative/tc-009-scenarios.md
- CATEGORY: Scenario intro + Narrative
- TONE NOTES: Inviting and observational; checklists must be testable propositions.
- VARIANTS: One narrative variant per scenario intro chosen from two drafts.
- SELECTED VARIANT: V-1 for all five (calm naturalist tone consistent with PHRASEBOOK).
- GLOSSARY REFERENCES: GL-005, GL-008, GL-012, GL-014, GL-013
- TRACEABILITY: DI-015
- RELATED: UC-007, UC-008, UC-009, UC-010, UC-011
---

## TC-010 : Save/Load slot labels and confirmation messages
- SUMMARY: Slot card labels, Save / Load / Delete / Overwrite confirmations, quota-warning text.
- FILE: ./build/text/utility/tc-010-saveload.md
- CATEGORY: Utility
- GLOSSARY REFERENCES: GL-016
- TRACEABILITY: DI-016
- RELATED: UC-014
---

## TC-011 : Overlay toggle labels and tooltips
- SUMMARY: Labels and tooltips for the four overlays.
- FILE: ./build/text/ui/tc-011-overlays.md
- CATEGORY: UI / Tooltips
- GLOSSARY REFERENCES: GL-018
- TRACEABILITY: DI-010, DI-017
- RELATED: UC-013
---

---

## Addendum — Cartoon UI strings (UC-017)

### TC-012 : Loading overlay
- File: `./build/text/utility/tc-012-loading.json`
- Strings:
  - `loading.title` = "Waking up the swamp…"
  - `loading.progress` = "{loaded} of {total}"
  - `loading.fail` = "Couldn't load the swamp art. Please reload the page."

### TC-013 : Tooltip / aria-label strings for cartoon icon-only buttons
- File: `./build/text/ui/tc-013-tooltips.json`
- Strings (one per button) — used as both `title` and `aria-label`:
  - `tooltip.nav.canvas` = "Ecosystem canvas"
  - `tooltip.nav.foodweb` = "Food web"
  - `tooltip.nav.dashboard` = "Dashboard"
  - `tooltip.nav.intervention` = "Interventions"
  - `tooltip.nav.scenarios` = "Scenarios"
  - `tooltip.nav.saveload` = "Save & load"
  - `tooltip.time.pause` = "Pause"
  - `tooltip.time.play` = "Play"
  - `tooltip.time.speed1` = "Normal speed"
  - `tooltip.time.speed5` = "Fast (×5)"
  - `tooltip.time.speed30` = "Very fast (×30)"
  - `tooltip.time.skipSeason` = "Skip to next season"
  - `tooltip.overlay.foodweb` = "Show food-web arrows"
  - `tooltip.overlay.nutrient` = "Show nutrient flow"
  - `tooltip.overlay.oxygen` = "Show oxygen levels"
  - `tooltip.overlay.density` = "Show population density"

### Empty-save polaroid caption
- Add to existing `tc-010-saveload.json`: `slot.empty` = "Empty — click to save"

---

### TC-014 — Terrain & dam UI labels (UC-018, UC-019)
| Key | Text |
|-----|------|
| `dam.tooltip.progress` | "Dam {pct}% complete" |
| `dam.tooltip.health` | "Structural health: {pct}%" |
| `dam.tooltip.species` | "Species using this dam: {list}" |
| `dam.tooltip.demolish` | "Demolish dam" |
| `dam.breach.alert` | "Beaver dam breached! Water level dropping…" |
| `dam.milestone.first` | "First beaver dam complete! 🦫 The swamp has been reshaped." |
| `terrain.seed.label` | "#seed: {n}" |
| `terrain.overlay.label` | "Biome zones" |
| `zone.deep` | "Deep water" |
| `zone.shallow` | "Shallow flats" |
| `zone.mud` | "Mudbank" |
| `zone.grass` | "Land patch" |
| `zone.sand` | "Dry sandbar" |
| `zone.cypress` | "Cypress stand" |

### TC-015 — Ambient sound placeholder (UC-021)
| Key | Text |
|-----|------|
| `ambient.eq.tooltip` | "Ecosystem activity — {n} organisms" |
| `ambient.eq.label` | "Activity" |

### TC-016 — Edge-case microcopy (second pass)
| Key | Text |
|-----|------|
| `dam.tooltip.paused` | "Construction paused" |
| `dam.tooltip.users.none` | "Users: none observed" |
| `terrain.seed.normalized` | "Seed normalized to {n}" |
| `ambient.eq.a11y` | "Ecosystem activity: {n} organisms" |
| `save.rebuild.terrain` | "Rebuilding terrain from saved seed…" |
