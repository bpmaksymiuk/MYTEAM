IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-01
- GOAL: Build the calculator shell layout and semantic structure for a classic Windows 95 style interface.
- SKILLSET REQUIRED: Semantic HTML, accessible markup, CSS layout basics.
- IMPLEMENTATION STEPS:
  1. Create main window, titlebar, display, memory indicator, and keypad container in src/index.html.
  2. Add calculator button elements with data attributes for numeric, operator, and command dispatch.
  3. Load src/styles.css and src/app.js from the page entry point.
- RELATED:
  - UC-01
  - BR-01
  - AR-01

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-02
- GOAL: Implement numeric and decimal entry behavior with immediate display synchronization.
- SKILLSET REQUIRED: JavaScript state management, event handling, numeric parsing.
- IMPLEMENTATION STEPS:
  1. Initialize state fields for entry text, operator, accumulator, and transition flags.
  2. Implement digit entry handler that replaces leading zero and appends valid digits.
  3. Implement decimal handler that prevents duplicate decimal points per operand.
  4. Re-render display after each accepted input event.
- RELATED:
  - UC-02
  - BR-02
  - AR-02

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-03
- GOAL: Implement core arithmetic operations with consistent equals and chained execution behavior.
- SKILLSET REQUIRED: Arithmetic logic design, JavaScript control flow, state transitions.
- IMPLEMENTATION STEPS:
  1. Implement executeOperation(lhs, rhs, op) for +, -, *, and / operators.
  2. Implement operator handler that computes pending operation when chaining.
  3. Implement equals handler that computes and stores result as new accumulator.
  4. Format numeric results for display stability.
- RELATED:
  - UC-03
  - BR-03
  - AR-03

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-04
- GOAL: Provide correction and clear command behavior for Backspace, CE, and C.
- SKILLSET REQUIRED: Command routing, state-reset modeling, defensive input logic.
- IMPLEMENTATION STEPS:
  1. Implement backspace handler to remove one trailing entry character.
  2. Implement CE handler to reset only current entry while preserving pending operation context.
  3. Implement C handler to reset full calculator state including accumulator and operator.
  4. Route commands through a centralized handleCommand dispatcher.
- RELATED:
  - UC-04
  - BR-04
  - AR-04

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-05
- GOAL: Handle divide-by-zero and invalid arithmetic with explicit recoverable error state.
- SKILLSET REQUIRED: Error-state modeling, guard conditions, resilient interaction flow.
- IMPLEMENTATION STEPS:
  1. Detect divide-by-zero during operation execution and call error transition handler.
  2. Lock operation progression while state.error is active.
  3. Allow C and CE commands to recover and restore valid entry mode.
- RELATED:
  - UC-05
  - BR-05
  - AR-05

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-06
- GOAL: Implement memory register commands with visible memory-indicator synchronization.
- SKILLSET REQUIRED: Stateful command handling, UI state binding, numeric accumulation.
- IMPLEMENTATION STEPS:
  1. Add memory value and hasMemory fields to runtime calculator state.
  2. Implement memory command handlers for MS, MR, MC, M+, and M-.
  3. Update indicator visibility in render() based on hasMemory state.
- RELATED:
  - UC-06
  - BR-06
  - AR-06

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-07
- GOAL: Ensure keyboard input maps to the same behavior as pointer-based button interaction.
- SKILLSET REQUIRED: Keyboard event handling, key mapping design, input normalization.
- IMPLEMENTATION STEPS:
  1. Define keyboard map for digits, operators, equals, clear, backspace, and decimal commands.
  2. Bind keydown listener and dispatch mapped keys to existing shared handlers.
  3. Prevent browser default actions for mapped calculator keys where needed.
- RELATED:
  - UC-07
  - BR-07
  - AR-07

IMPLEMENTATION INSTRUCTION:
- INSTRUCTION ID: II-08
- GOAL: Deliver immediate visual feedback and stable responsiveness under sustained interaction.
- SKILLSET REQUIRED: CSS interaction states, DOM class toggling, responsive UI behavior.
- IMPLEMENTATION STEPS:
  1. Define retro button normal, active, and focus styles in src/styles.css.
  2. Toggle temporary active class on dispatched button interactions.
  3. Keep render updates lightweight and state-driven.
- RELATED:
  - UC-08
  - BR-08
  - AR-08
