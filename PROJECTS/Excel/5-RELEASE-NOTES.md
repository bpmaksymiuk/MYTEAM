# Release Notes — Excel Chrome Extension

---

## XL-REL-2026-04-10-001

**Release ID:** XL-REL-2026-04-10-001
**Date:** 2026-04-10
**Stage:** 5 — Implementation

### Summary
Initial pipeline implementation run. Created all pipeline artifacts (Stages 2–5) for the Excel Chrome Extension project. Extended the FormulaEngine with logical, text, math, date, and absolute-reference function support. Implemented paste formula adjustment (relative/absolute references). Added F4 key cycling for reference type in the formula bar. Fixed error propagation so specific error types (#DIV/0!, #NAME?, #VALUE!, #N/A) are returned instead of the generic #ERR.

### Changed Files
- `build/extension/app.js` — FormulaEngine expansion and paste adjustment (1382 → 1584 lines)

### Design Decisions Applied
- DI-016: Logical functions AND, OR, NOT, IFERROR added to evalFunction()
- DI-017: Text functions CONCATENATE, CONCAT, LEN, LEFT, RIGHT, MID, UPPER, LOWER, TRIM added; & operator via evalAmper() pre-pass
- DI-018: Math functions ROUND, ABS, INT, MOD, SQRT, POWER added to evalFunction()
- DI-019: Date functions TODAY, NOW, DATE, YEAR, MONTH, DAY added via evalDateFunction() pre-pass
- DI-020: replaceRefs() updated to strip $ from cell references; adjustFormulaRefs() added; both paste handlers updated; F4 cycling in handleFormulaBarEnter()
- DI-021: Error propagation fixed — safeCalc returns #VALUE! on parse failure; evaluate() propagates specific error strings; #ERR eliminated

### Use Cases Implemented / Updated
- UC-003 (expanded): proper error values #DIV/0!, #NAME?, #VALUE!; IF comparison operators; nested functions
- UC-024: Logical functions (AND, OR, NOT, IFERROR)
- UC-025: Text functions and & concatenation operator
- UC-026: Math and rounding functions
- UC-027: Date and time functions
- UC-028: Absolute/relative cell references ($A$1); paste formula adjustment; F4 cycling

### Business Requirements Covered
BR-023, BR-105–BR-132

### Implementation Caveats
- F4 cycling in the formula bar does best-effort token detection based on cursor position; complex multi-reference formulas require the user to position cursor on the reference token before pressing F4.
- Date arithmetic (e.g., =TODAY() - A1) is not supported; date functions return ISO string values.
- IFERROR evaluates its first argument in a nested try/catch, which means errors inside very deep nesting may not all be caught; single-level use is fully supported.

### Notes
- Pipeline artifacts 2-REQUIREMENTS.md, 3-ARCHITECTURE-RECOMMENDATIONS.md, 3-PARTS LIST.md, 4-DESIGN-INSTRUCTIONS.md created in this run.
- Existing build/ implementation (UC-001 through UC-015, T-PIPELINE-XL-001 13/15 PASS) is unchanged.

---

