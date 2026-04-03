BR-001 : Simulator initial view renders canvas and controls on first load.
- TESTABLE CONDITION
  1. Opening index page displays an interactive canvas, tool selectors, and runtime sliders within 2 seconds.
- NOTES
  1. Default values should be visible for all controls.
- RELATED UC-001, UC-009

BR-002 : Simulation speed control adjusts integration/update rate in real time.
- TESTABLE CONDITION
  1. Changing speed slider measurably increases or decreases particle movement rate without page reload.
- NOTES
  1. Update loop must consume latest control value each frame.
- RELATED UC-001, UC-007

BR-003 : Charge strength control adjusts Coulomb force magnitude in real time.
- TESTABLE CONDITION
  1. Increasing strength slider increases acceleration response to probes and particle-particle interactions.
- NOTES
  1. Effect should be visually noticeable under same particle arrangement.
- RELATED UC-001, UC-005, UC-007

BR-004 : User can select positive probe placement tool.
- TESTABLE CONDITION
  1. Selecting positive tool and clicking canvas places a visible '+' probe at click location.
- NOTES
  1. Tool state should remain visible in UI.
- RELATED UC-002

BR-005 : User can select negative probe placement tool.
- TESTABLE CONDITION
  1. Selecting negative tool and clicking canvas places a visible '-' probe at click location.
- NOTES
  1. New negative probes become active emitters.
- RELATED UC-002, UC-004

BR-006 : Probe markers are visually distinguishable by polarity.
- TESTABLE CONDITION
  1. Positive and negative probes use distinct color/iconography and labels.
- NOTES
  1. Distinction must be clear at normal zoom.
- RELATED UC-002, UC-008

BR-007 : User can draw barrier segments on canvas.
- TESTABLE CONDITION
  1. In draw mode, pointer drag creates line segments rendered immediately.
- NOTES
  1. Segment list must persist while session remains active.
- RELATED UC-003

BR-008 : User can erase existing barrier segments.
- TESTABLE CONDITION
  1. In erase mode, interacting near a barrier removes it and collision behavior updates immediately.
- NOTES
  1. Erase hit threshold should be configurable or fixed with clear behavior.
- RELATED UC-003

BR-009 : Charges bounce off barriers using reflection behavior.
- TESTABLE CONDITION
  1. When particle trajectory intersects a barrier, velocity reflects away from barrier normal and particle remains in bounds.
- NOTES
  1. Apply damping factor to prevent unstable infinite ricochet.
- RELATED UC-003, UC-005

BR-010 : Negative probes continuously spawn charges while simulation runs.
- TESTABLE CONDITION
  1. With at least one negative probe on canvas, active charge count increases over time according to spawn settings.
- NOTES
  1. Spawn source should be probe position with minor jitter.
- RELATED UC-004

BR-011 : Spawn-rate control changes charge emission frequency.
- TESTABLE CONDITION
  1. Lower interval/higher rate setting produces higher observed particles-per-second than slower setting.
- NOTES
  1. Spawn scheduling may be probabilistic or timer-based.
- RELATED UC-004, UC-007

BR-012 : Charges are attracted toward positive probes.
- TESTABLE CONDITION
  1. In absence of stronger competing forces, particle vectors trend toward nearest positive probe.
- NOTES
  1. Attraction falls off with distance using Coulomb-like relationship.
- RELATED UC-005

BR-013 : Charges are repelled from negative probes.
- TESTABLE CONDITION
  1. Particle acceleration from negative probes points away from those probes.
- NOTES
  1. Repulsion combines with attraction and barrier collisions.
- RELATED UC-005

BR-014 : Charges repel each other.
- TESTABLE CONDITION
  1. Closely grouped particles disperse over time due to inter-particle repulsion.
- NOTES
  1. O(n^2) interaction acceptable with particle cap safeguards.
- RELATED UC-005

BR-015 : Charges are annihilated when reaching positive probe capture radius.
- TESTABLE CONDITION
  1. Particles entering configured radius around positive probe are removed from simulation list.
- NOTES
  1. Capture radius must be constant or configurable and visibly reflected in behavior.
- RELATED UC-006

BR-016 : Simulation exposes additional configurable features beyond core controls.
- TESTABLE CONDITION
  1. UI includes at least one additional runtime control (for example barrier bounce damping or particle cap) that changes behavior live.
- NOTES
  1. Control labels must explain purpose.
- RELATED UC-007, UC-008

BR-017 : UI communicates active tool and key simulation metrics.
- TESTABLE CONDITION
  1. Interface displays current tool and live metrics such as active charge count and probe counts.
- NOTES
  1. Metrics update at least every animation frame or UI refresh tick.
- RELATED UC-008

BR-018 : Visual styling is polished and modern while preserving interaction clarity.
- TESTABLE CONDITION
  1. Interface uses non-default typography/colors/layout and maintains readable controls over animated background.
- NOTES
  1. Styling must not obstruct canvas interactions.
- RELATED UC-008

BR-019 : Entire simulator runs fully in-browser using web standards.
- TESTABLE CONDITION
  1. Application runs via static HTML/CSS/JS with no backend dependency for core simulation.
- NOTES
  1. Assets should load from relative paths.
- RELATED UC-009

BR-020 : Runtime remains responsive under normal interactive load.
- TESTABLE CONDITION
  1. During active spawning and user interactions, control input and pointer actions remain responsive without hard lockups.
- NOTES
  1. Enforce particle cap and stable integration step to reduce performance spikes.
- RELATED UC-007, UC-009
