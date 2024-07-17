---
"overlay-kit": patch
---

feat: Add cleanup effect for unmounting

This commit introduces a useEffect cleanup function in the OverlayProvider component that dispatches a 'REMOVE_ALL' action when the component unmounts.
This change ensures that all overlays are properly cleaned up during testing scenarios, preventing state leakage and side effects from persistent overlays.

**Related Issue:** Fixes #63
