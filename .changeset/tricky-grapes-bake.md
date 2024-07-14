---
"overlay-kit": patch
---

fix: state reset issue on overlay reopen

This change fixes an issue where overlays did not retain their state when reopened without unmounting, even though they were not removed from the DOM.
The overlayReducer has been updated to maintain the state of overlays between close and open cycles, addressing an unintended state reset.

Related Issue: Fixes #57
