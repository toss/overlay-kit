---
"overlay-kit": patch
---

Fixed a bug where overlays could not be reopened after closing with the same ID.

### Fixed Issues
- Resolved issue where overlays would not display when reopened with the same `overlayId` after being closed
- Improved mounting state tracking with added `isMounted` property in overlay state management
- Added state change detection logic to ensure proper reopen handling

### Changes
- Added `isMounted` property to `OverlayItem` type for better mounting state tracking
- Enhanced `ADD` action in reducer to handle reopening of existing closed overlays
- Implemented automatic reopen mechanism through state comparison in `OverlayProvider`
- Added test cases for overlay reopen scenarios

This fix ensures overlays work as expected when closing and reopening them. 