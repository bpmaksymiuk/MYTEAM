PART:
- PART ID: PT-01
- PART NAME: Calculator Window Shell
- NOTES: Defines page-level calculator container, titlebar, display region, keypad grid structure, and semantic DOM anchors.
- RELATED:
  - UC-01
  - BR-01
  - AR-01

PART:
- PART ID: PT-02
- PART NAME: Input State Engine
- NOTES: Stores and updates entry, operator, accumulator, and waiting-for-next-entry state to support numeric and decimal input.
- RELATED:
  - UC-02
  - BR-02
  - AR-02

PART:
- PART ID: PT-03
- PART NAME: Arithmetic Execution Pipeline
- NOTES: Performs +, -, *, and / operations and manages immediate execution for chained operator and equal flows.
- RELATED:
  - UC-03
  - BR-03
  - AR-03

PART:
- PART ID: PT-04
- PART NAME: Correction and Clear Commands
- NOTES: Implements Backspace, CE, and C behaviors with command-scope-specific state reset logic.
- RELATED:
  - UC-04
  - BR-04
  - AR-04

PART:
- PART ID: PT-05
- PART NAME: Error Handling and Recovery
- NOTES: Manages divide-by-zero error state, guarded input flow, and clear-based recovery behavior.
- RELATED:
  - UC-05
  - BR-05
  - AR-05

PART:
- PART ID: PT-06
- PART NAME: Memory Register Subsystem
- NOTES: Provides MS, MR, MC, M+, and M- command handling and synchronizes memory-indicator visibility.
- RELATED:
  - UC-06
  - BR-06
  - AR-06

PART:
- PART ID: PT-07
- PART NAME: Keyboard Command Mapper
- NOTES: Maps keyboard events to shared operator and command dispatch pathways used by pointer interactions.
- RELATED:
  - UC-07
  - BR-07
  - AR-07

PART:
- PART ID: PT-08
- PART NAME: Interaction Feedback Styling
- NOTES: Defines active/focus visual states and transient pressed feedback for responsive retro UI interactions.
- RELATED:
  - UC-08
  - BR-08
  - AR-08
