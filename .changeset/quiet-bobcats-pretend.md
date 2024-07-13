---
'overlay-kit': patch
---

Fix: Ensure 'current' reflects the last overlay when closing intermediate overlays

- Resolve issue where 'current' does not update to the last overlay when closing an intermediate overlay
- Add logic to correctly update 'current' in reducer
