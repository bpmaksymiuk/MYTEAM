# Narrative Vision

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

---

## OVERVIEW

The Fish Tank Simulator is an interactive, browser-based virtual aquarium that delivers the aesthetic
and psychological benefits of a living aquarium to any modern device. Intended for users who seek a
visually rich, meditative digital experience — whether aquarium enthusiasts, casual ambient-experience
seekers, or those wanting the calming presence of underwater life without ownership overhead — the
application simulates a self-contained aquatic world running in real time.

The product occupies the space between passive screensaver-style aquarium visualisations and complex
aquarium management simulations. It offers a considered middle ground: a system that looks alive,
behaves convincingly, and invites optional interaction without demanding it. Users may watch passively,
feed fish, select creatures for contextual information, configure their environment, or adjust their
camera mode — all without instruction or tutorial pressure.

The simulator targets a responsive range from 1280×720 desktop layouts to 4K displays and
touch-enabled mobile devices. Performance is a first-class concern: 60 FPS on modern hardware and at
least 30 FPS on lower-end devices are product acceptance criteria, not aspirational targets.

---

## COMPETITIVE & CREATIVE RESEARCH

Six reference products informed the thematic and technical direction of this product:

1. **Aqua Real 2 (Endless Mobile)** — A high-fidelity mobile aquarium simulator widely cited as a
   benchmark for realistic fish animation and water rendering. Key lesson: individual fish character —
   distinct species with recognisable swimming styles and idle behaviours — creates emotional investment
   far more effectively than quantity. Each species swims with a visually distinct gait that maps to
   its real biology: reef fish beat pectoral fins in a rowing (labriform) motion; open-water species
   undulate the rear half of their body (subcarangiform). Species authenticity is the quality signal.

2. **My Aquarium (Hudson Soft, WiiWare)** — An interactive console aquarium notable for its feeding
   and selection mechanics tied to motion control. Key lesson: the act of feeding, even in a virtual
   context, creates a sense of responsibility and attachment. Immediate, visible fish response to food
   input is the interaction loop that elevates a passive screensaver into a living-pet experience.

3. **WebGL Fluid Simulation (Pavel Dobryakov)** — A widely referenced browser-based real-time fluid
   simulation demonstrating that WebGL can deliver convincing dynamic fluid rendering at interactive
   rates without server infrastructure. Key lesson: fluid dynamics do not need to be physically
   accurate to feel real; perceptually convincing motion — wakes, turbulence, particle drift — at
   consistent frame rates is sufficient and achievable in-browser.

4. **Google Chrome Experiment: "The Wilderness Downtown"** — A media-rich ambient web experience that
   demonstrated the emotional power of immersive, non-interactive browser content. Key lesson:
   audio-visual coherence — where ambient sound, visual motion, and interaction rhythm align —
   produces a disproportionately strong sense of presence, even without gameplay.

5. **Depth Hunter (Crytek / BugByte Ltd)** — A spearfishing simulation notable for its underwater
   lighting model including caustics, volumetric light shafts, and particle scatter, and for its
   photorealistic fish renderings: scaled skin with translucent fin membranes, specular eye
   highlights, and iridescent body markings. Key lesson: lighting is the primary carrier of
   "underwater-ness", but photorealism in the creatures themselves is the differentiating quality
   benchmark. A beautifully lit tank filled with cartoon fish breaks the illusion immediately;
   biological accuracy in both locomotion and appearance is what sustains it.

6. **Reef Life Simulation (various WebGL demos, 2020–2025)** — Browser-based reef simulations that
   demonstrate the achievability of PBR (physically based rendering) materials for marine life in
   WebGL without native engines. Key lesson: procedural scale-texture shaders, morph-target fin
   animation, and skeletal bone chains for body undulation can be combined in Three.js to produce
   species-authentic swimming at acceptable frame rates on modern hardware.

**Synthesis:** The most effective aquarium simulations combine high-fidelity passive visuals (lighting,
water motion, fish idle animation) with a small number of low-friction interactive gestures (feeding,
selection, environment toggle). Complexity beneath the surface creates the feeling of richness; the
user interface must stay out of the way. The addition of photorealistic biology — PBR textures,
correct locomotion modes, and a benthic creature (crab) scuttling at the tank floor — elevates the
product from visual novelty to convincing natural specimen display. A dedicated clean front-window
mode that strips all UI chrome addresses the legitimate use case of the product as ambient display.

---

## THEMES AND TONE

Six themes anchor the product's creative identity:

1. **Tranquil Immersion** — The overriding mood is unhurried calm. Every design choice — from the
   drift rate of sediment particles to the rhythm of the bubble stream — is evaluated against whether
   it adds to or subtracts from a feeling of peaceful enclosure. There are no time pressures, no loss
   conditions, and no notification interruptions.

2. **Living Ecology** — The tank reads as a self-sustaining world, not a staged diorama. Fish follow
   routines. Plants sway before the user interacts. Current effects precede user action. The simulation
   runs whether or not the user is actively watching. This autonomy is essential: a world that pauses
   when unobserved cannot feel alive.

3. **Biological Truth** — Every creature in the tank moves and looks as it would in nature. Fish do
   not glide at constant velocity; they transition through idle hover, cruise, and burst speed states
   with body-wave amplitude and tail-beat frequency matching their locomotion mode. A crab does not
   simply walk forward; it scuttles sideways on an alternating leg gait, claws twitching. Scale
   texture, fin translucency, and eye specularity are not decorative touches — they are fidelity
   requirements. This theme connects directly to the user's trust in the product as a credible
   natural reference.

4. **Discoverable Wonder** — Detail rewards attention. A fish briefly hovering at the shipwreck
   window. The glint of a treasure chest visible through refraction. Sediment disturbed after feeding
   settling slowly back to the substrate. The crab raising its claws when approached. The product is
   designed to be noticed gradually, over repeated observation, rather than comprehended immediately
   on first load.

5. **Tactile Presence** — Interactions have physical weight. Feeding releases particles into a moving
   medium. Selecting a fish produces a visible response from the creature. Camera mode changes
   reframe the world, not just the viewport. The interaction vocabulary is intentionally small; each
   gesture is consequential rather than decorative.

6. **Understated Craft** — The interface is minimal by design. Controls surface when needed and
   recede when not. The clean front-window mode — which strips all UI chrome to present only tank
   and glass — is the purest expression of this theme: a digital aquarium indistinguishable in
   intent from a physical one. Craftsmanship lives in the simulation detail, not in UI decoration.

**Voice and register:** The product communicates through sensation rather than instruction. Text
(UI labels, tooltips, feedback messages) is concise, warm, and functional — never playful at the
expense of clarity, never dry at the expense of personality.

---

## WORLD-BUILDING / CONCEPTS

Four mental models define how users understand and relate to the product:

1. **The Tank as a World** — The aquarium is not a display panel; it is a geographic space with
   terrain (substrate, shipwreck, coral formations), atmosphere (light, current, water quality), and
   inhabitants with distinct characters and territorial ranges. Users are observers of this world —
   privileged witnesses rather than directors. This model justifies the autonomy of fish behaviour,
   the persistence of environmental states between user actions, and the non-interventionist default
   mode of the experience. The world does not wait for the user to act.

2. **Water as the Universal Medium** — Every physical event in the tank is mediated by water.
   Feeding introduces particles into a moving fluid. A fish turning produces a wake. A bubble rising
   from the aerator creates local turbulence that displaces plant fronds. This concept unifies all
   simulation systems under a single physical metaphor and gives users a consistent intuition: every
   interaction in the tank passes through the water, and the water is always in motion.

3. **Layers of Time** — The tank operates simultaneously on multiple temporal scales: the millisecond
   responsiveness of a fish detecting food, the second-scale drift of a bubble column, the
   minute-scale settlement of disturbed sediment, the session-scale shift in plant sway patterns.
   Designing for these temporal layers — ensuring each is perceptible and meaningful at its own
   cadence — creates the sense of a place with history and continuity rather than a looping
   animation.

4. **The Living Specimen** — Each creature in the tank is a faithful representation of a real
   species, not an archetype. A discus fish rows forward with slow, lateral sweeping pectoral-fin
   beats; a tetra surges in bursts with rear-body undulation; a hermit crab at the substrate scuttles
   sideways with an alternating eight-leg gait and twitching chelae. This mental model drives the
   animation specification: every locomotion parameter — body-wave frequency, fin beat amplitude,
   C-start escape posture — is derived from the observable biology of the modelled species, not
   improvised for visual effect. The user who knows these creatures will recognise them; the user who
   does not will sense their authenticity.

---

## Exit Gate

- [x] `2-NARRATIVE-VISION.md` contains all four required sections.
- [x] OVERVIEW explains what the product does in plain language.
- [x] COMPETITIVE & CREATIVE RESEARCH cites specific references (six cited, including two new photorealism references).
- [x] THEMES AND TONE names at least three distinct themes (six named, including new Biological Truth and Understated Craft).
- [x] WORLD-BUILDING / CONCEPTS identifies at least two key mental models (four identified, including new Living Specimen).
- [x] `PIPELINE-STATUS.md` is updated for Stage 2 with STATUS and STATUS UPDATED date.
