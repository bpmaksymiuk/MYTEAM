# Bug Report — Cyrillic ↔ Glagolitic Converter

**Run ID:** T-PIPELINE-DASHBOARD-001  
**Date:** 2026-05-02  
**Build:** v0.1.0  

---

## Summary

No defects found. All 19 test cases passed on first corrected run.

---

## Notes

One test-script correction was required during execution (not a product defect):

- **T-002, T-003, T-012, T-016** — Initial spec used uppercase Cyrillic input ('АБВ') and expected lowercase Glagolitic output ('ⰰⰱⰲ'). The application correctly preserves case (uppercase Cyrillic → uppercase Glagolitic; lowercase Cyrillic → lowercase Glagolitic), which is the specified behaviour in BR-001. The test expectations were corrected to use lowercase input ('абв' → 'ⰰⰱⰲ'). No product change required.

---

*No open bugs.*
