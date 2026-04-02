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
	- The UI visually resembles Windows 3.1 calculator styling.
	- Window chrome, button shapes, and display typography appear consistent with retro design intent.
	- Interface loads without runtime errors.
	- Layout is usable on standard desktop viewport sizes.

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
	- Number buttons 0-9 are clickable and input digits correctly.
	- Decimal input is supported and prevented from duplicating in one number.
	- Display updates immediately after each input.
	- Input handling remains stable across repeated entries.

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
	- Addition, subtraction, multiplication, and division are supported.
	- Equals returns correct arithmetic results for common cases.
	- Chained operations behave predictably according to defined calculator logic.
	- Result appears in the display without needing a page reload.

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
	- Backspace removes one digit from current entry.
	- CE clears current entry while preserving pending operation when applicable.
	- C clears both current entry and pending operation state.
	- Display reflects clear/correct actions immediately.

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
	- Division by zero does not crash the app.
	- Error state is explicit in display.
	- Clear action restores usable state after error.
	- No stale invalid values persist after recovery.

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
	- Memory store and recall are supported.
	- Memory clear resets stored value.
	- Memory arithmetic (if implemented) updates stored value correctly.
	- Memory behavior is consistent across multiple operations.

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
	- Keyboard entry maps to calculator actions correctly.
	- Enter triggers calculation in the same way as equals button.
	- Clear shortcuts behave predictably and safely.
	- Mixed keyboard/mouse interaction does not desynchronize display state.

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
	- Button interactions provide immediate visible feedback.
	- Display remains legible and stable through repeated operations.
	- Application remains responsive during prolonged usage.
	- Retro styling does not compromise core calculator usability.
