---
"overlay-kit": patch
---

Improve overlay unmount logic and add test cases

- Enhanced current overlay state management during unmount
  - When unmounting a middle overlay with multiple overlays open, the last overlay becomes current
  - When unmounting the last overlay, the previous overlay becomes current
- Added test cases
  - Test for unmounting multiple overlays in different orders
  - Test for tracking current overlay state using useCurrentOverlay hook
