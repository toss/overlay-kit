---
'overlay-kit': patch
---

Fix `openAsync` promises remaining pending when reopening a closed overlay with the same ID, while preserving the overlay's component state.
