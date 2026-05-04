# Business Requirements

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-02

<!-- ═══════════ UC-001 : VIEW IMMERSIVE AQUARIUM SCENE ═══════════ -->

## BR-001 : MINIMUM VIEWPORT RENDERING

The system shall render the tank scene at a minimum supported viewport of 1280×720 pixels with a
responsive layout.

- **TESTABLE CONDITION:** Load the application at 1280×720; verify the full tank scene renders
  without clipping, scrollbars, or overflow.
- **NOTES:** Responsive scaling must be maintained up to the maximum supported resolution.
  Exact responsive breakpoints are implementation scope.
- **RELATED:** UC-001.

---

## BR-002 : UNDERWATER LIGHTING EFFECTS

The system shall display visible underwater lighting effects, including at least one of caustic
patterns or light diffusion, during scene rendering.

- **TESTABLE CONDITION:** Observe the rendered scene; confirm at least one of the following is
  visible: animated caustic light patterns on the substrate or objects, or a volumetric/diffuse
  light-scattering effect in the water column.
- **NOTES:** Both caustics and diffusion may be present; at least one is required for acceptance.
- **RELATED:** UC-001.

---

## BR-003 : NON-OBSTRUCTIVE UI OVERLAY

The system shall display a UI overlay that does not obstruct the primary tank view during normal
operation.

- **TESTABLE CONDITION:** With the HUD visible, verify that the central tank scene area (excluding
  intentional control regions) remains unobscured and the tank occupies the majority of the viewport.
- **NOTES:** Transient overlays (tooltips, selection cards) are permitted to occlude briefly.
- **RELATED:** UC-001.

---

<!-- ═══════════ UC-002 : CONFIGURE VIEW MODE AND PRESENTATION ═══════════ -->

## BR-004 : TWO SELECTABLE CAMERA MODES

The system shall provide at least two selectable camera modes — isometric and 3/4 perspective —
without requiring a restart.

- **TESTABLE CONDITION:** With the application running, switch camera mode; confirm the view changes
  and no reload or restart occurs.
- **NOTES:** Advanced camera customisation (free-orbit, zoom beyond defined range) is out of scope.
- **RELATED:** UC-002.

---

## BR-005 : IMMEDIATE CAMERA MODE APPLICATION

The system shall apply the selected camera mode to the tank scene immediately upon selection.

- **TESTABLE CONDITION:** Select a different camera mode; confirm the scene updates within one
  rendered frame or a brief transition — no full page reload occurs.
- **NOTES:** A brief animated transition is acceptable; a blank/black frame followed by reload
  is not.
- **RELATED:** UC-002.

---

## BR-006 : USER-CONTROLLED AUDIO AMBIANCE

The system shall allow the user to enable or disable audio ambiance at any time during a session.

- **TESTABLE CONDITION:** Toggle audio off; confirm ambient sound stops. Toggle audio on; confirm
  ambient sound resumes. Both actions may be performed mid-session without restart.
- **NOTES:** Default state (on or off) is implementation scope.
- **RELATED:** UC-002.

---

<!-- ═══════════ UC-003 : CUSTOMIZE TANK ENVIRONMENT ═══════════ -->

## BR-007 : SELECTABLE SUBSTRATE TYPE

The system shall provide at least one selectable substrate type and reflect the user's selection
visually in the tank scene.

- **TESTABLE CONDITION:** Select a substrate option; confirm the floor of the tank visually changes
  to match the selection within the active session.
- **NOTES:** Minimum of one substrate option required; additional options are implementation scope.
- **RELATED:** UC-003.

---

## BR-008 : DECORATIVE STRUCTURE PLACEMENT

The system shall allow the user to enable at least one decorative structure and display its placement
within the tank scene boundaries.

- **TESTABLE CONDITION:** Enable a decoration (e.g., shipwreck or rocks); confirm it appears inside
  the tank without clipping through tank walls.
- **NOTES:** Decorations must remain within tank boundaries. Freeform precision placement is
  out of scope.
- **RELATED:** UC-003.

---

## BR-009 : SESSION-PERSISTENT ENVIRONMENT CONFIGURATION

The system shall persist all environment configuration selections for the duration of the active
browser session.

- **TESTABLE CONDITION:** Configure substrate and decorations; navigate away within the app and
  return; confirm selections are unchanged.
- **NOTES:** Persistence beyond the browser session (cross-session save) is out of scope.
- **RELATED:** UC-003.

---

<!-- ═══════════ UC-004 : OBSERVE DYNAMIC WATER PHYSICS ═══════════ -->

## BR-010 : BUBBLE STREAM RISE AND POP

The system shall render bubble streams that visibly rise through the water column and produce a
visible pop or dissipation effect near the water surface.

- **TESTABLE CONDITION:** Observe the bubbler; confirm individual bubbles ascend from the emitter
  and disappear or burst at or near the water surface level.
- **NOTES:** Scientific accuracy of bubble physics is not required.
- **RELATED:** UC-004, UC-010.

---

## BR-011 : REAL-TIME DYNAMIC WATER RESPONSE

The system shall display at least one real-time dynamic water response — ripples, currents, or
particle drift — during normal simulation.

- **TESTABLE CONDITION:** Observe the tank during normal simulation; confirm at least one of:
  visible surface ripples, directional current indicators, or drifting particles in the water column.
- **NOTES:** Multiple dynamic responses may coexist; at least one is required.
- **RELATED:** UC-004.

---

## BR-012 : PLANT MOTION REFLECTS WATER MOVEMENT

The system shall update plant motion in real time to reflect current water movement direction and
magnitude.

- **TESTABLE CONDITION:** Observe plant elements while the bubbler or fish movement alters local
  currents; confirm plants sway in the direction of the dominant current.
- **NOTES:** Botanical growth realism is visual-only; precise fluid-plant coupling is not required.
- **RELATED:** UC-004, UC-009.

---

<!-- ═══════════ UC-005 : SEE DIVERSE FISH SPECIES AND BEHAVIORS ═══════════ -->

## BR-013 : POPULATION WITHIN CONFIGURED LIMITS

The system shall initialise the tank with a fish population within the configured population limits
at session start.

- **TESTABLE CONDITION:** Start a session; count the number of fish present and verify the count
  falls within the configured population range.
- **NOTES:** Breeding and mortality mechanics are out of scope.
- **RELATED:** UC-005.

---

## BR-014 : THREE DISTINCT MOVEMENT STYLES

The system shall display at least three distinct fish movement styles across the active species
population during simulation.

- **TESTABLE CONDITION:** Observe all fish over a two-minute period; identify and name at least
  three behaviourally distinct movement patterns (e.g., shoaling sweep, territorial hover,
  rapid dart).
- **NOTES:** Movement style distinctiveness must be observable without access to source code.
- **RELATED:** UC-005.

---

## BR-015 : OBSTACLE AVOIDANCE

The system shall cause fish to avoid static obstacles — decorations and tank walls — during
movement without passing through them.

- **TESTABLE CONDITION:** Observe fish moving near a decoration and near tank walls; confirm fish
  route around obstacles rather than clipping through them.
- **NOTES:** Incompatible predator–prey species combinations must not appear in the same tank.
- **RELATED:** UC-005.

---

<!-- ═══════════ UC-006 : FEED FISH THROUGH INTERACTIVE INPUT ═══════════ -->

## BR-016 : FOOD PARTICLE SPAWN AT INPUT LOCATION

The system shall spawn visible food particles at or near the user's input location when a feeding
action is performed.

- **TESTABLE CONDITION:** Click or tap near the water surface; confirm food particles appear at
  or close to the point of interaction.
- **NOTES:** Exact precision of spawn point is implementation scope; proximity within a defined
  radius is acceptable.
- **RELATED:** UC-006.

---

## BR-017 : FISH RESPONSE TO FOOD

The system shall cause fish within detection range to move toward and consume food particles.

- **TESTABLE CONDITION:** Drop food; observe that at least one fish changes its movement path
  toward the food and the particle disappears upon contact (consumed).
- **NOTES:** Fish not in detection range are not required to respond.
- **RELATED:** UC-006.

---

## BR-018 : FEEDING RATE LIMIT

The system shall enforce a rate limit that prevents feeding actions above a configured frequency
threshold during a session.

- **TESTABLE CONDITION:** Perform rapid repeated feeding inputs; confirm that input above the
  threshold is rejected or ignored (no new food particles spawned until cooldown expires).
- **NOTES:** The threshold value is implementation scope.
- **RELATED:** UC-006.

---

## BR-019 : UNEATEN FOOD DESPAWN

The system shall despawn uneaten food particles after a bounded time interval.

- **TESTABLE CONDITION:** Drop food in an area where no fish are present; confirm all food particles
  disappear within the defined interval without manual intervention.
- **NOTES:** The despawn interval is implementation scope.
- **RELATED:** UC-006.

---

<!-- ═══════════ UC-007 : TRACK INDIVIDUAL FISH AND DECORATIONS ═══════════ -->

## BR-020 : FISH SELECTION VISUAL STATE

The system shall display a clear visual selection state on a fish when the user selects it by
clicking or tapping.

- **TESTABLE CONDITION:** Click a fish; confirm a visible selection indicator (highlight ring,
  outline, or colour change) appears on the selected fish without obscuring the core scene.
- **NOTES:** The selection indicator must remain visible while the fish is in motion.
- **RELATED:** UC-007.

---

## BR-021 : DECORATION CONTEXTUAL INFORMATION

The system shall display visible contextual information for a decoration when the user selects it.

- **TESTABLE CONDITION:** Click a decoration; confirm a tooltip or contextual card appears showing
  information about the selected item.
- **NOTES:** Deep encyclopaedic content is not required; a name and brief description suffice.
- **RELATED:** UC-007.

---

## BR-022 : SELECTION TARGET UPDATE

The system shall update the selection state to the newly selected target when the user selects
a different fish or decoration.

- **TESTABLE CONDITION:** Select fish A; then select fish B; confirm fish A loses the selection
  indicator and fish B gains it.
- **NOTES:** Only one selection at a time is required.
- **RELATED:** UC-007.

---

<!-- ═══════════ UC-008 : EXPERIENCE RESPONSIVE PERFORMANCE ═══════════ -->

## BR-023 : 60 FPS TARGET ON MODERN HARDWARE

The system shall target 60 frames per second on modern hardware during normal operation.

- **TESTABLE CONDITION:** Run the simulation on modern hardware for two minutes with normal
  interaction; measure frame rate using browser developer tools and confirm the average is
  at or near 60 FPS.
- **NOTES:** "Modern hardware" is defined in release notes. Brief dips during complex transitions
  are acceptable.
- **RELATED:** UC-008.

---

## BR-024 : 30 FPS MINIMUM ON LOWER-END HARDWARE

The system shall maintain at least 30 frames per second on lower-end supported hardware during
normal operation.

- **TESTABLE CONDITION:** Run the simulation on lower-end supported hardware for two minutes;
  measure frame rate and confirm it does not fall below 30 FPS during normal usage.
- **NOTES:** "Lower-end supported hardware" is defined in release notes.
- **RELATED:** UC-008.

---

## BR-025 : RESOLUTION RANGE SUPPORT

The system shall render correctly and remain functional across the supported resolution range from
1280×720 to 3840×2160.

- **TESTABLE CONDITION:** Load the application at 1280×720, at 1920×1080, and at 3840×2160;
  confirm the scene renders without layout breakage at each resolution.
- **NOTES:** Extreme stress beyond documented limits is out of scope.
- **RELATED:** UC-008, UC-001.

---

<!-- ═══════════ UC-009 : OBSERVE PLANT AND DECOR MOTION DYNAMICS ═══════════ -->

## BR-026 : PLANT SWAY ANIMATION

The system shall animate plant elements with visible sway motion in relation to local water
movement during simulation.

- **TESTABLE CONDITION:** Observe plant elements in a running simulation; confirm they sway
  continuously and the sway direction corresponds to the prevailing current direction.
- **NOTES:** Plants must not jitter or oscillate erratically.
- **RELATED:** UC-009, UC-004.

---

## BR-027 : PARTICLE DRIFT AND SETTLING

The system shall simulate drift and settling behaviour for at least one particle class — dust,
sediment, or food debris.

- **TESTABLE CONDITION:** Observe the water column; confirm at least one class of particle
  visibly drifts with the current and gradually settles toward the substrate when undisturbed.
- **NOTES:** Particle classes may overlap with those in BR-011.
- **RELATED:** UC-009.

---

## BR-028 : DISTURBANCE MOTION DAMPING

The system shall produce observable temporary motion changes in plants or particles following a
disturbance, and these changes shall dampen back toward the resting state over time.

- **TESTABLE CONDITION:** Introduce a disturbance (fish movement, feeding, bubbler burst); confirm
  nearby plant sway or particle drift increases temporarily and then returns toward the pre-disturbance
  state within a perceptible interval.
- **NOTES:** Damping rate is implementation scope.
- **RELATED:** UC-009, UC-004.

---

<!-- ═══════════ UC-010 : EXPERIENCE BUBBLER-DRIVEN WATER EFFECTS ═══════════ -->

## BR-029 : CONFIGURABLE BUBBLE EMISSION RATE

The system shall allow the user to configure the bubble emission rate within the defined bounds of
30 to 200 bubbles per minute.

- **TESTABLE CONDITION:** Set emission rate to minimum (30/min) and maximum (200/min); confirm
  the observed bubble frequency changes visibly between the two settings.
- **NOTES:** Rate values outside the defined bounds shall be rejected or clamped.
- **RELATED:** UC-010.

---

## BR-030 : VISIBLE BUBBLE SIZE VARIATION

The system shall render bubbles with visually observable size variation during runtime.

- **TESTABLE CONDITION:** Observe the bubble stream; confirm that bubbles are not all identical
  in diameter — at least two distinguishable size classes are visible.
- **NOTES:** Bubble sizes range from 1–5 mm radius in the simulation model.
- **RELATED:** UC-010.

---

## BR-031 : LOCALISED CURRENT EFFECTS NEAR BUBBLER

The system shall produce visible localised current effects in nearby particles or plant movement
around the bubbler output area.

- **TESTABLE CONDITION:** Observe particles and plants near the bubbler; confirm they show a
  directional bias or increased motion intensity in proximity to the bubble column compared with
  areas distant from the bubbler.
- **NOTES:** Current effects must remain performant at maximum configured bubble rate.
- **RELATED:** UC-010, UC-004.

---

<!-- ═══════════ UC-011 : USE MOBILE-FRIENDLY TOUCH INTERACTIONS ═══════════ -->

## BR-032 : TAP GESTURE FOR SELECTION AND FEEDING

The system shall recognise a tap gesture as either a fish or decoration selection input or a
feeding input on touch-capable devices.

- **TESTABLE CONDITION:** On a touch device, tap a fish — confirm selection state activates. Tap
  near the water surface — confirm food particles spawn. Both must work without a non-touch fallback.
- **NOTES:** Touch feedback must be immediate and visible.
- **RELATED:** UC-011.

---

## BR-033 : DRAG GESTURE TO MOVE FOOD RELEASE POINT

The system shall allow a drag gesture to move the food release location across the tank surface
on touch-capable devices.

- **TESTABLE CONDITION:** On a touch device, start a drag from one position on the tank and
  release at a different position; confirm food particles spawn at or near the release point,
  not the origin.
- **NOTES:** Full parity with desktop input shortcuts is not required.
- **RELATED:** UC-011.

---

## BR-034 : PINCH GESTURE ZOOM

The system shall adjust the zoom level in response to a pinch gesture on touch-capable devices
where mobile zoom is supported.

- **TESTABLE CONDITION:** On a touch device that supports pinch zoom, perform a pinch-in and
  pinch-out gesture; confirm the viewport zoom level changes correspondingly.
- **NOTES:** Pinch zoom support is conditional on device capability; desktop equivalence is not
  required.
- **RELATED:** UC-011.

---

<!-- ═══════════ UC-012 : RUN A CALMING SESSION WITHOUT FAILURE ═══════════ -->

## BR-035 : SESSION STABILITY OVER SOAK INTERVAL

The system shall remain interactive throughout a soak-test session of the defined duration without
crashing or requiring a forced reload.

- **TESTABLE CONDITION:** Run the simulation continuously for the soak interval defined in test
  cases while performing normal interactions; confirm no crash, white-screen, or reload occurs.
- **NOTES:** Soak interval duration is defined in the test cases (Stage 10 scope).
- **RELATED:** UC-012.

---

## BR-036 : CORE FEATURES AVAILABLE THROUGHOUT SESSION

The system shall keep all core features — rendering, fish motion, user interaction, and UI controls
— available throughout a normal session.

- **TESTABLE CONDITION:** At intervals during a soak test, verify that fish move, the scene
  renders, feeding input produces food particles, and UI controls respond.
- **NOTES:** Network-disconnected operation behaviour is unspecified.
- **RELATED:** UC-012.

---

## BR-037 : NO BLOCKING ERROR STATE DURING NORMAL USE

The system shall not enter a blocking error state that prevents continued user interaction during
normal usage patterns.

- **TESTABLE CONDITION:** Exercise all normal user interactions (camera mode, feeding, selection,
  decorations, audio toggle) during a full session; confirm no modal error, unresponsive state,
  or frozen UI appears.
- **NOTES:** Unusual browser configurations or unsupported hardware are outside normal usage.
- **RELATED:** UC-012.

---

<!-- ═══════════ UC-013 : PHOTOREALISTIC FISH AND TANK RENDERING ═══════════ -->

## BR-038 : FISH SCALE TEXTURE AND FIN TRANSLUCENCY

The system shall render each fish species with a visible scale pattern on the body and translucent
fin membranes with visible fin-ray structure.

- **TESTABLE CONDITION:** Observe a fish in the rendered scene; confirm the body surface shows a
  repeated scale pattern distinct from a flat colour and at least one fin appears partially
  transparent with ray lines visible through it.
- **NOTES:** Scale pattern may be procedural or texture-mapped; photographic accuracy is not
  required, but the surface must read as scaled, not painted.
- **RELATED:** UC-013.

---

## BR-039 : SPECULAR EYE HIGHLIGHT ON FISH

The system shall render each fish with a specular point highlight visible on the eye.

- **TESTABLE CONDITION:** Observe a fish in the rendered scene; confirm a distinct bright highlight
  point is visible on each eye surface, separate from the iris colour.
- **NOTES:** The highlight must be discernible at normal viewing zoom; it need not simulate a
  physically accurate light probe.
- **RELATED:** UC-013.

---

## BR-040 : ANIMATED CAUSTIC LIGHT PATTERNS IN TANK

The system shall display animated caustic light patterns on the tank substrate and on objects
near the tank floor.

- **TESTABLE CONDITION:** Observe the substrate surface during simulation; confirm irregular,
  shifting bright patches consistent with caustic refraction patterns are visible and change
  over time.
- **NOTES:** Caustic patterns may be shader-simulated rather than ray-traced; the key requirement
  is visible animation of the pattern over time.
- **RELATED:** UC-013.

---

<!-- ═══════════ UC-014 : SPECIES-AUTHENTIC SWIMMING ANIMATIONS ═══════════ -->

## BR-041 : AT LEAST TWO BIOMECHANICALLY DISTINCT LOCOMOTION MODES

The system shall animate at least two fish species groups using visually distinct locomotion
modes — one species group primarily using pectoral-fin motion and another using rear-body
undulation.

- **TESTABLE CONDITION:** Observe at least two species groups in the scene simultaneously;
  confirm one group's primary propulsive motion is clearly located at the pectoral fins while
  the other group's primary propulsive motion involves rear-body or tail movement.
- **NOTES:** The distinction must be perceptible to an untrained observer. The locomotion modes
  shall correspond to real aquatic locomotion categories (labriform, subcarangiform, or carangiform).
- **RELATED:** UC-014.

---

## BR-042 : SPEED-STATE TRANSITIONS WITH OBSERVABLE AMPLITUDE CHANGE

The system shall animate each fish through at least three distinguishable speed states — idle,
cruise, and burst — with observable differences in body-wave amplitude or fin-beat frequency
between states.

- **TESTABLE CONDITION:** Observe a fish transitioning between rest and active movement; confirm
  the body undulation amplitude or fin-beat frequency is visibly greater during active swimming
  than during hovering, and further increased during burst movement.
- **NOTES:** Transitions between states shall be smooth, not instantaneous snaps.
- **RELATED:** UC-014.

---

## BR-043 : C-START ESCAPE RESPONSE ON PROXIMITY EVENT

The system shall animate fish with a rapid C-start escape response when a proximity event is
detected near the fish's position.

- **TESTABLE CONDITION:** Move the cursor to within a short distance of a fish; confirm the
  fish produces a rapid lateral body-bend followed by a burst-speed retreat away from the cursor
  position.
- **NOTES:** "Short distance" threshold is implementation scope. The response must be clearly
  distinct from normal cruise swimming in both speed and body-bend angle.
- **RELATED:** UC-014.

---

## BR-044 : PECTORAL FIN STATE CHANGE DURING HOVER AND BURST

The system shall display pectoral fins in a visibly fanned-open state during hovering and in a
visibly flattened state during burst-speed swimming.

- **TESTABLE CONDITION:** Observe a fish at rest (hovering); confirm pectoral fins are spread
  wide. Trigger a burst swim event; confirm pectoral fins visibly flatten against the body during
  the burst.
- **NOTES:** This requirement applies to species using labriform or mixed locomotion. Pure
  carangiform species are exempt.
- **RELATED:** UC-014.

---

<!-- ═══════════ UC-015 : PHOTOREALISTIC BOTTOM-DWELLING CRAB ═══════════ -->

## BR-045 : CRAB PHOTOREALISTIC CARAPACE TEXTURE

The system shall render a crab entity at the tank substrate with a visible carapace surface
texture and jointed appendage structure.

- **TESTABLE CONDITION:** Observe the tank substrate zone; confirm a crab is present whose
  carapace shows surface texture distinct from a flat colour, and whose legs and claws are
  visually segmented at joint positions.
- **NOTES:** Texture may be procedural or mapped. The crab must be identifiable as a crab to
  an untrained observer.
- **RELATED:** UC-015.

---

## BR-046 : CRAB SIDEWAYS LOCOMOTION WITH ALTERNATING LEG GAIT

The system shall animate the crab moving laterally with an alternating leg gait in which legs
on each side move in coordination.

- **TESTABLE CONDITION:** Observe the crab moving across the substrate; confirm movement is
  predominantly lateral (not forward-facing) and individual legs visibly alternate between
  raised and lowered positions as the crab moves.
- **NOTES:** Crab shall not walk forward like a fish. Gait cycle period is implementation scope.
- **RELATED:** UC-015.

---

## BR-047 : CRAB CLAW IDLE ANIMATION

The system shall animate the crab's claws with a continuous idle animation cycle when the crab
is stationary.

- **TESTABLE CONDITION:** Observe a stationary crab for at least five seconds; confirm at least
  one claw exhibits visible periodic motion (open/close or raise/lower) during that interval.
- **NOTES:** The idle animation must be visible at normal viewing zoom; micro-jitter does not
  qualify.
- **RELATED:** UC-015.

---

## BR-048 : CRAB DEFENSIVE CLAW DISPLAY ON CLICK

The system shall animate the crab raising both claws into a defensive display posture in response
to a click or tap event near the crab's position.

- **TESTABLE CONDITION:** Click or tap near the crab entity; confirm both claws visibly raise to
  a position clearly higher than the resting idle position within one second of the input event.
- **NOTES:** The defensive display shall return to idle state after a defined interval; the return
  interval is implementation scope.
- **RELATED:** UC-015.

---

<!-- ═══════════ UC-016 : CLEAN FRONT-WINDOW VIEW MODE ═══════════ -->

## BR-049 : CLEAN WINDOW MODE ACTIVATION IN TWO OR FEWER INTERACTIONS

The system shall allow the user to activate the clean front-window view mode in no more than two
user interactions from the normal operating state.

- **TESTABLE CONDITION:** From the default loaded state, count the minimum number of clicks, taps,
  or keypresses required to reach the clean window view; confirm the count is two or fewer.
- **NOTES:** An interaction is defined as one discrete user input event (one click, one keypress,
  one tap). Hovering does not count.
- **RELATED:** UC-016.

---

## BR-050 : ALL UI CHROME HIDDEN IN CLEAN WINDOW MODE

The system shall hide all visible UI controls, overlay bars, labels, and tooltips when clean
window mode is active.

- **TESTABLE CONDITION:** Activate clean window mode; confirm no HUD bar, control panel, species
  label, tooltip, or other UI element is visible in the viewport.
- **NOTES:** The unobtrusive corner exit control is not considered UI chrome for the purposes of
  this requirement; it may remain present at low opacity.
- **RELATED:** UC-016.

---

## BR-051 : SIMULATION CONTINUES UNINTERRUPTED DURING WINDOW MODE TRANSITIONS

The system shall not pause or reset the simulation when transitioning into or out of clean window
mode.

- **TESTABLE CONDITION:** Activate clean window mode while fish are swimming; confirm fish
  continue to move smoothly without a pause, freeze, or reset during and after the mode
  transition.
- **NOTES:** A brief camera animation transitioning to the front-facing view is acceptable;
  freezing the simulation state is not.
- **RELATED:** UC-016.

---

## BR-052 : EXIT CLEAN WINDOW MODE VIA ESCAPE KEY OR CORNER CONTROL

The system shall allow the user to exit clean window mode using either the Escape key or an
unobtrusive on-screen corner control.

- **TESTABLE CONDITION:** While in clean window mode, press the Escape key; confirm the view
  returns to the normal operating state. Separately, activate clean window mode and use the
  corner control to exit; confirm the same return to normal state.
- **NOTES:** Both exit mechanisms are required. The corner control shall be discoverable (visible
  or revealed on hover) without requiring instructions.
- **RELATED:** UC-016.

---

## Exit Gate

- [x] Every UC maps to at least one BR.
- [x] Every BR uses shall language.
- [x] Every BR is atomic (no compound requirements).
- [x] Every BR has a TESTABLE CONDITION.
- [x] No BR contains implementation details (no technology names, no code references).
- [x] BR IDs are sequential and non-reused.
- [x] RELATED fields reference valid UC-IDs.
- [x] `PIPELINE-STATUS.md` is updated for Stage 4 with STATUS and STATUS UPDATED date.
