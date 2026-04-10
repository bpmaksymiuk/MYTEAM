## BUG-CS-001 — Barrier Draw Test Uses Sidebar Coordinates

- **Severity:** LOW
- **Discovered:** T-PIPELINE-CS-001 Run 1
- **UC/BR:** UC-003, BR-005
- **Description:** T06 ("Drawing barrier on canvas adds barrier to state") reported `No barrier in state (count=0)`. The test called `page.mouse.move(150, 400)` then `page.mouse.down()`. The canvas starts after the 220px sidebar panel, so viewport x=150 falls inside the sidebar. The `mousedown` event fired on the panel element, not on `#sim-canvas`, meaning `startX`/`startY` were never captured by the canvas listener. On `mouseup` the canvas did receive the event but `isDrawing` was already set to `false` by the panel capturing the down. Result: barrier was never pushed to `state.barriers`.
- **Root Cause:** The Playwright `page.mouse.move(x, y)` uses viewport coordinates. The test author used x=150, assuming the canvas starts at the left edge. The layout is `<aside id="panel">` (220px) followed by `<canvas>`, so canvas x-start ≈ 220. The `mousedown` at x=150 targeted the sidebar, not the canvas.
- **Fix Applied:** Updated `cs_test_pipeline001.mjs` T06 mousedown start coordinate from x=150 to x=300, and mouseup end coordinate from x=450 to x=650, ensuring both events land within the canvas area.
- **Status:** ✅ Fixed

---
