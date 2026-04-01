USE CASE:
- USE CASE ID: UC-01
- GOAL: Run the simulator in a standard web browser using web technologies.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User opens the simulator URL in a supported desktop or mobile browser.
	2. Browser loads the interactive canvas, controls, and simulation runtime.
	3. User performs charge placement, barrier drawing/erasing, and control adjustments.
	4. User runs a complete simulation session without installing native software.
	5. User refreshes/reopens the page and can start a new session reliably.
- ACCEPTANCE CRITERIA:
	- Opening src/index.html in a modern Chromium-based browser loads the simulator UI without runtime errors.
	- Core interactions (place charge, draw barrier, erase barrier, run or pause) execute successfully in one manual session.
	- The interface remains usable at viewport widths of 375px or greater and 1280px or greater without hidden core controls.
	- No native installer, browser extension, or platform-specific binary is required to run the simulator.

USE CASE:
- USE CASE ID: UC-02
- GOAL: Place positive and negative charges on the simulation canvas.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User opens the simulator and sees an empty or preloaded canvas.
	2. User selects charge type (+ or -) from the placement controls.
	3. User clicks or taps on the canvas to place the selected charge.
	4. User repeats placement to create a field layout with multiple charges.
	5. User optionally removes or repositions charges using edit controls.
- ACCEPTANCE CRITERIA:
	- In Place Charge mode, selecting + then clicking canvas creates one visible + node at click location.
	- In Place Charge mode, selecting - then clicking canvas creates one visible - node at click location.
	- Placing 20 charges in one session does not freeze controls or stop rendering.
	- Clicks inside blocked edge margins do not place clipped or out-of-bounds nodes.

USE CASE:
- USE CASE ID: UC-03
- GOAL: Draw and erase barriers that reflect moving charges.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User selects the barrier drawing tool.
	2. User drags on the canvas to draw one or more line barriers.
	3. Simulation runs while moving charges encounter barriers.
	4. On collision, charges bounce off according to reflection rules.
	5. User switches to erase mode to remove selected barrier lines and test different layouts.
- ACCEPTANCE CRITERIA:
	- Dragging in Draw Barrier mode creates a visible line segment of minimum usable length.
	- Particles contacting a barrier reflect and do not continue straight through the segment.
	- Reflection behavior remains observable at simulation speed 0.5x, 1.0x, and 2.0x.
	- Erase Barrier mode removes a barrier segment when pointer action occurs near that segment.
	- Repeating draw and erase for 30 seconds does not freeze UI or break run controls.

USE CASE:
- USE CASE ID: UC-04
- GOAL: Continuously spawn mobile charges from negative sources.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User places at least one negative charge on the canvas.
	2. User starts or unpauses the simulation.
	3. The simulator emits new moving charges from each negative source over time.
	4. Spawned charges enter the field and react to forces and barriers.
	5. User observes sustained flow as long as simulation is running.
- ACCEPTANCE CRITERIA:
	- With at least one negative source, new particles appear repeatedly while simulation state is Running.
	- Spawn direction and initial speed are non-zero and remain within configured simulation bounds.
	- Switching to Paused stops new particle creation within one second.
	- Returning to Running resumes particle spawning without page refresh.

USE CASE:
- USE CASE ID: UC-05
- GOAL: Annihilate moving charges when they reach positive sinks.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User places one or more positive charges on the canvas.
	2. Simulation runs with moving charges approaching positive sinks.
	3. When a moving charge reaches the annihilation threshold around a positive charge, it is removed.
	4. Visual feedback confirms annihilation (for example, brief effect or count update).
	5. Simulation continues with remaining and newly spawned charges.
- ACCEPTANCE CRITERIA:
	- Particles entering the sink capture radius are removed from active particle count.
	- A removed particle increments annihilation count exactly once.
	- During repeated sink captures, simulation continues rendering and controls remain responsive.
	- Annihilation event is visible through active and annihilated counter changes.

USE CASE:
- USE CASE ID: UC-06
- GOAL: Control spawn frequency with a slider.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User locates the spawn-rate slider in the control panel.
	2. User moves the slider to decrease or increase spawn frequency.
	3. Simulation updates spawn intervals in near real time.
	4. User compares low-frequency and high-frequency flow behavior.
	5. User settles on a preferred setting for the current experiment.
- ACCEPTANCE CRITERIA:
	- Spawn-rate slider displays a bounded range with visible current value label.
	- Setting spawn rate to a higher value increases observed particle emission frequency.
	- Setting spawn rate to a lower value decreases observed particle emission frequency.
	- Slider changes take effect during runtime without reload or reset.

USE CASE:
- USE CASE ID: UC-07
- GOAL: Simulate Coulomb-like attraction and repulsion in motion updates.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User places both positive and negative charges to create a field.
	2. User starts simulation and observes force-driven trajectories.
	3. Moving charges are repelled by negative sources and attracted toward positive sinks.
	4. Moving charges also repel each other.
	5. User adjusts layout and watches trajectories change accordingly.
- ACCEPTANCE CRITERIA:
	- Particles trend toward + sinks and away from - sources in a mixed-polarity scene.
	- In dense scenes, nearby particles diverge due to inter-particle repulsion.
	- Particle motion updates continuously frame to frame without teleport jumps under normal settings.
	- A 60-second run at default settings does not produce numerical instability that halts simulation.

USE CASE:
- USE CASE ID: UC-08
- GOAL: Adjust simulation speed and charge strength during runtime.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User opens controls for simulation speed and charge strength.
	2. User changes speed to slow down or accelerate dynamics.
	3. User changes charge-strength setting to amplify or reduce interactions.
	4. Simulator applies updated parameters while running.
	5. User compares outcomes across parameter combinations.
- ACCEPTANCE CRITERIA:
	- Increasing simulation speed produces faster trajectory progression than baseline 1.0x.
	- Decreasing simulation speed produces slower trajectory progression than baseline 1.0x.
	- Increasing charge strength increases curvature and acceleration magnitude of particle motion.
	- Both controls apply live without clearing placed nodes, barriers, or counters.

USE CASE:
- USE CASE ID: UC-09
- GOAL: Configure additional simulation options for experimentation.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User opens advanced or additional settings.
	2. User adjusts supported options (for example, particle lifetime, trail visibility, collision radius, or damping).
	3. User applies settings and observes behavior changes.
	4. User resets selected options to defaults when needed.
	5. User continues experimentation with updated configuration.
- ACCEPTANCE CRITERIA:
	- Advanced controls include at least particle lifetime, damping, capture radius, and trails toggle.
	- Changing each advanced control produces an observable behavior change in the simulation.
	- Reset Defaults restores advanced controls to their documented default values in one action.
	- Input values remain within control bounds and do not allow invalid out-of-range configuration.

USE CASE:
- USE CASE ID: UC-10
- GOAL: Provide an engaging and intuitive interactive experience.
- ACTOR: Learner/User
- STEP BY STEP WALKTHROUGH:
	1. User launches the simulator and understands primary actions quickly.
	2. User places charges and barriers using clear visual affordances.
	3. User manipulates controls with immediate visual feedback.
	4. User recovers easily from mistakes using undo/clear/reset flows.
	5. User completes a short experiment without external guidance.
- ACCEPTANCE CRITERIA:
	- Active tool mode is visually indicated at all times.
	- Run or Pause state and live counters update within one second of user action.
	- Attempting to run without a negative source shows a clear guidance message.
	- A first-time user can complete one basic flow (place source, place sink, run, adjust spawn rate) within 2 minutes using on-screen controls only.
