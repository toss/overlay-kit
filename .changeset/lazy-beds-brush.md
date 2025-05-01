---
"overlay-kit": patch
---

feat: Add component key

Fixed an issue with overlay components not properly remounting when unmounted and immediately reopened with the same ID.
Added a new `componentKey` property that's separate from `overlayId` to ensure React properly handles component lifecycle. Each time `overlay.open()` is called, a new random `componentKey` is generated internally even when reusing the same `overlayId`.

This fix resolves scenarios where calling `unmount()` followed by `open()` with the same overlay ID in quick succession would result in the overlay not being visible to users.
