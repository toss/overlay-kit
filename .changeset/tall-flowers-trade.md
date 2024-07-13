---
"overlay-kit": patch
---

fix: Enhance Overlay State Management and Prevent Duplicate Entries

This change enhances the overlay state management to ensure overlays maintain the correct state when closed and reopened, and prevents duplicate overlay entries.
It addresses issues with the overlay's `current` state not updating correctly in certain scenarios.

**Related Issue:** Fixes # 46
