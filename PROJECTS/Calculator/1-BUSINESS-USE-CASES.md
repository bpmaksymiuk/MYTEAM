USE CASE:
- USE CASE ID: UC-01
- GOAL: Launch a calculator interface styled like Windows 3.1 `calc.exe`.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User opens the calculator application in a browser.
	2. Application displays a classic Windows 3.1-style window frame.
	3. User sees a calculator display area and a grid of classic-style buttons.
	4. User verifies overall look and feel matches retro desktop aesthetic.
	5. User begins interacting with calculator controls.
- ACCEPTANCE CRITERIA:
	- Opening src/index.html renders retro-styled titlebar, display, and button grid within 3 seconds.
	- Window chrome and beveled button styling remain visible and consistent at 1024x768 and 1366x768 viewports.
	- UI initializes without uncaught runtime errors in the browser console.
	- All primary controls are visible and interactable without scrolling on standard desktop viewport sizes.

USE CASE:
- USE CASE ID: UC-02
- GOAL: Enter numbers and view them on the calculator display.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User clicks numeric buttons (0-9).
	2. Calculator appends digits to current input.
	3. User optionally enters a decimal point.
	4. Display updates after each input action.
	5. User confirms entered value before applying an operation.
- ACCEPTANCE CRITERIA:
	- Clicking any digit button appends the expected digit to current entry.
	- A single operand cannot contain more than one decimal point.
	- Display updates within one interaction frame after each digit/decimal input.
	- Repeating 50 mixed numeric inputs does not corrupt entry state.

USE CASE:
- USE CASE ID: UC-03
- GOAL: Perform core arithmetic operations.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User enters a first operand.
	2. User selects an operation (+, -, *, /).
	3. User enters a second operand.
	4. User presses equals.
	5. Calculator computes and shows the result.
- ACCEPTANCE CRITERIA:
	- +, -, *, and / operations produce correct results for representative integer and decimal cases.
	- Pressing equals returns the computed result for current operator and operands.
	- Chained operations execute consistently under the defined immediate-execution calculator model.
	- Result display updates without page reload or UI reset.

USE CASE:
- USE CASE ID: UC-04
- GOAL: Use classic clear and correction actions.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User enters one or more digits.
	2. User presses backspace-style correction to remove last digit.
	3. User presses CE to clear current entry only.
	4. User presses C to reset full operation context.
	5. User continues calculation with clean state.
- ACCEPTANCE CRITERIA:
	- Backspace removes exactly one trailing digit from current entry.
	- CE resets current entry to zero while preserving pending operator context when present.
	- C resets current entry, accumulator, and pending operator state.
	- Display reflects each correction/clear action immediately.

USE CASE:
- USE CASE ID: UC-05
- GOAL: Handle calculator edge cases safely.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User attempts division by zero.
	2. Calculator shows a clear error state.
	3. User performs a clear action.
	4. Calculator exits error state and returns to normal input.
	5. User continues with valid calculations.
- ACCEPTANCE CRITERIA:
	- Attempting division by zero enters a visible error display state.
	- Application remains responsive after divide-by-zero interaction.
	- C or CE exits error state and restores valid numeric entry mode.
	- Subsequent valid operations execute normally after recovery.

USE CASE:
- USE CASE ID: UC-06
- GOAL: Use optional classic memory functions.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User computes or enters a value.
	2. User stores value to memory (MS).
	3. User recalls memory value (MR) for a new calculation.
	4. User optionally adds/subtracts to memory (M+/M-).
	5. User clears memory (MC) when done.
- ACCEPTANCE CRITERIA:
	- MS stores the current numeric display value to memory.
	- MR restores the stored memory value into the display.
	- MC clears memory and removes memory-indicator state.
	- M+ and M- update memory register correctly across repeated operations.

USE CASE:
- USE CASE ID: UC-07
- GOAL: Support keyboard input alongside button clicks.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User types numeric keys on keyboard.
	2. User types operation keys (+, -, *, /).
	3. User presses Enter for equals.
	4. User presses Escape/Delete for clear behavior.
	5. User switches between keyboard and mouse seamlessly.
- ACCEPTANCE CRITERIA:
	- Numeric keyboard keys map to corresponding digit-entry actions.
	- Enter triggers the same behavior as equals button.
	- Backspace, Escape, and Delete trigger their mapped clear/correction commands safely.
	- Mixed keyboard/mouse use preserves synchronized calculator state.

USE CASE:
- USE CASE ID: UC-08
- GOAL: Preserve usability and responsiveness in retro-styled UI.
- ACTOR: User
- STEP BY STEP WALKTHROUGH:
	1. User performs multiple calculations in one session.
	2. User uses both quick single operations and longer chained operations.
	3. User observes visual feedback on button presses.
	4. User confirms display readability and button discoverability.
	5. User completes tasks without lag or confusion.
- ACCEPTANCE CRITERIA:
	- Button press/active visual feedback appears immediately on click or key activation.
	- Display remains legible and value-stable during at least 3 minutes of repeated operations.
	- Application remains responsive under rapid repeated input.
	- Retro styling preserves clear affordances for all core calculator controls.
