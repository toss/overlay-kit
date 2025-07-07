# overlay-kit

## 1.8.4

### Patch Changes

- [#187](https://github.com/toss/overlay-kit/pull/187) [`c3dfcf1`](https://github.com/toss/overlay-kit/commit/c3dfcf169663069955f871bfe4f61923af3a1fd3) Thanks [@jungpaeng](https://github.com/jungpaeng)! - Fixed a bug where overlays could not be reopened after closing with the same ID.

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

## 1.8.3

### Patch Changes

- [#185](https://github.com/toss/overlay-kit/pull/185) [`f261784`](https://github.com/toss/overlay-kit/commit/f2617840af7a027c84b9e5d9048d7883b9617ac1) Thanks [@jungpaeng](https://github.com/jungpaeng)! - fix: prevent unnecessary re-renders of existing overlays with memo

  Prevent unnecessary re-renders of existing overlays when new overlays are opened, improving performance.

  ### Key Changes

  - **Added React.memo**: Applied memo to overlay controller component to prevent re-renders when props haven't changed
  - **Integrated state management**: Streamlined state management by integrating it directly into the component and removing redundant prop passing

  ### Performance Improvements

  - Eliminated unnecessary re-renders of existing overlays when adding new overlays in multi-overlay scenarios
  - Provides more predictable and maintainable state management flow
  - Maintained existing API compatibility while optimizing internal performance

  This change maintains backward compatibility and provides performance improvements without requiring any code changes from users.

- [#183](https://github.com/toss/overlay-kit/pull/183) [`579abaf`](https://github.com/toss/overlay-kit/commit/579abaf54ec3b84b7c2ca0b943387bfb33e893a1) Thanks [@jungpaeng](https://github.com/jungpaeng)! - test: fix duplicate overlayId error message expectation

  Updated test case to match the actual implementation where duplicate overlayId error messages now include the specific overlayId value for better debugging experience.

## 1.8.2

### Patch Changes

- [#145](https://github.com/toss/overlay-kit/pull/145) [`1a5d4bb`](https://github.com/toss/overlay-kit/commit/1a5d4bb631147771b265c873bc6447039fd86dbd) Thanks [@gwagjiug](https://github.com/gwagjiug)! - fix: remove unnecessary type assertion from Context.Provider

- [#167](https://github.com/toss/overlay-kit/pull/167) [`b19f2c6`](https://github.com/toss/overlay-kit/commit/b19f2c6b852a498c4f2c60b3f9f319af9fb2b863) Thanks [@jiji-hoon96](https://github.com/jiji-hoon96)! - refactor: Extract determine current overlay logic to a utility function

- [#158](https://github.com/toss/overlay-kit/pull/158) [`a6e2f15`](https://github.com/toss/overlay-kit/commit/a6e2f1569e1205d885303f09533f1303676b1040) Thanks [@jiji-hoon96](https://github.com/jiji-hoon96)! - refactor: Replace map with forEach in event emitter

- [#168](https://github.com/toss/overlay-kit/pull/168) [`4f70bdb`](https://github.com/toss/overlay-kit/commit/4f70bdb1ba81b7000c9a5f8b2115132777cc8fa7) Thanks [@DongGukMon](https://github.com/DongGukMon)! - feat: extend environment guard to recognise React Native

- [#173](https://github.com/toss/overlay-kit/pull/173) [`617b0a0`](https://github.com/toss/overlay-kit/commit/617b0a0edab7f59d895f65d3888259ff2f5d83da) Thanks [@dayongkr](https://github.com/dayongkr)! - Enhance error message for duplicated id

## 1.8.1

### Patch Changes

- [#161](https://github.com/toss/overlay-kit/pull/161) [`ec07614`](https://github.com/toss/overlay-kit/commit/ec0761404eabe27b07a8ad31cf82df34fb3169f7) Thanks [@jungpaeng](https://github.com/jungpaeng)! - feat: Change to allow each overlay provider to have a unique event ID

  Each overlay provider now uses a unique event ID instead of relying on shared global identifiers.

  This change improves event handling accuracy and avoids potential collisions when managing multiple overlays from different providers.
  It is backward-compatible for existing overlays that do not explicitly set a provider-specific ID.

## 1.8.0

### Minor Changes

- [#149](https://github.com/toss/overlay-kit/pull/149) [`a98a312`](https://github.com/toss/overlay-kit/commit/a98a312249b5ad0006eec16025c4109714a47265) Thanks [@jungpaeng](https://github.com/jungpaeng)! - refactor: migrate event based store

### Patch Changes

- [#151](https://github.com/toss/overlay-kit/pull/151) [`07f42a5`](https://github.com/toss/overlay-kit/commit/07f42a585e8d2bd8ee6ee0841388e3dc39a287a4) Thanks [@jungpaeng](https://github.com/jungpaeng)! - feat: Add component key

  Fixed an issue with overlay components not properly remounting when unmounted and immediately reopened with the same ID.
  Added a new `componentKey` property that's separate from `overlayId` to ensure React properly handles component lifecycle. Each time `overlay.open()` is called, a new random `componentKey` is generated internally even when reusing the same `overlayId`.

  This fix resolves scenarios where calling `unmount()` followed by `open()` with the same overlay ID in quick succession would result in the overlay not being visible to users.

## 1.7.0

### Minor Changes

- [`8c4d54d`](https://github.com/toss/overlay-kit/commit/8c4d54da25e2609f79be388afeb3b5a40b8d93f5) Thanks [@jungpaeng](https://github.com/jungpaeng)! - feat: export types from content-overlay-controller

  Export `OverlayControllerComponent` and `OverlayAsyncControllerComponent` types from content-overlay-controller module for better type accessibility in consumer projects.

## 1.6.2

### Patch Changes

- [#120](https://github.com/toss/overlay-kit/pull/120) [`3362bb7`](https://github.com/toss/overlay-kit/commit/3362bb7560a1a53e1b8d290a4fc1e849f607f730) Thanks [@ho991217](https://github.com/ho991217)! - fix: Enhance overlay reducer state management

- [#123](https://github.com/toss/overlay-kit/pull/123) [`d02a36c`](https://github.com/toss/overlay-kit/commit/d02a36c3adb711144568fae19b96db52b17dc71d) Thanks [@yongsk0066](https://github.com/yongsk0066)! - fix: remove console log on dispatchOverlay

- [#119](https://github.com/toss/overlay-kit/pull/119) [`a45f618`](https://github.com/toss/overlay-kit/commit/a45f6181294cab767569ad257c1901767f2d13aa) Thanks [@ho991217](https://github.com/ho991217)! - fix: initializing current overlay after close all overlays

## 1.6.1

### Patch Changes

- [#113](https://github.com/toss/overlay-kit/pull/113) [`b57d15b`](https://github.com/toss/overlay-kit/commit/b57d15ba9b64c05d50224a09bd116266109d886c) Thanks [@jungpaeng](https://github.com/jungpaeng)! - Improve overlay unmount logic and add test cases

  - Enhanced current overlay state management during unmount
    - When unmounting a middle overlay with multiple overlays open, the last overlay becomes current
    - When unmounting the last overlay, the previous overlay becomes current
  - Added test cases
    - Test for unmounting multiple overlays in different orders
    - Test for tracking current overlay state using useCurrentOverlay hook

## 1.6.0

### Minor Changes

- [#102](https://github.com/toss/overlay-kit/pull/102) [`becbd90`](https://github.com/toss/overlay-kit/commit/becbd90fa111419c3bcf4088edebc6ce743fdf40) Thanks [@jungpaeng](https://github.com/jungpaeng)! - feat: Add local overlay context support

  - Add `experimental_createOverlayContext` function to create isolated overlay contexts
  - Refactor context management to support multiple overlay instances
  - Move overlay provider and controller logic into separate files
  - Update store management to support local state
  - Add documentation for new context creation API
  - Improve type definitions and exports

## 1.5.0

### Minor Changes

- [#95](https://github.com/toss/overlay-kit/pull/95) [`59f2917`](https://github.com/toss/overlay-kit/commit/59f29179fd61de0d64df94d54cd7110c9cc0e47c) Thanks [@manudeli](https://github.com/manudeli)! - feat: support react 19

### Patch Changes

- [#97](https://github.com/toss/overlay-kit/pull/97) [`a04c030`](https://github.com/toss/overlay-kit/commit/a04c03075bafc8192487c8cc1b837aaf73991760) Thanks [@manudeli](https://github.com/manudeli)! - feat: esm first (support cjs by exports field of package.json)

- [#98](https://github.com/toss/overlay-kit/pull/98) [`725264a`](https://github.com/toss/overlay-kit/commit/725264abad4813bd33eefb559e869caaa329c33c) Thanks [@manudeli](https://github.com/manudeli)! - fix: update pkg.repository.url

## 1.4.1

### Patch Changes

- [#74](https://github.com/toss/overlay-kit/pull/74) [`324dab9`](https://github.com/toss/overlay-kit/commit/324dab92b9bdda007930a4f4e731257b053e5156) Thanks [@jungpaeng](https://github.com/jungpaeng)! - Fix path resolution error by updating import path for 'use-sync-external-store/shim'

  The import path for `use-sync-external-store/shim` was incorrect, causing a path resolution error during build. This change updates the import statement to include `index.js`, resolving the path issue.

## 1.4.0

### Minor Changes

- [#72](https://github.com/toss/overlay-kit/pull/72) [`9776fff`](https://github.com/toss/overlay-kit/commit/9776fff2bccc683afb9dfdfa7ad0b568cd902b7d) Thanks [@jungpaeng](https://github.com/jungpaeng)! - Support for React versions 16.8 and 17

  **Related Issue:** Fixes #43

### Patch Changes

- [#64](https://github.com/toss/overlay-kit/pull/64) [`01eaa3c`](https://github.com/toss/overlay-kit/commit/01eaa3c41e367224852cad56bc0214f1bf05ff77) Thanks [@jungpaeng](https://github.com/jungpaeng)! - feat: Add cleanup effect for unmounting

  This commit introduces a useEffect cleanup function in the OverlayProvider component that dispatches a 'REMOVE_ALL' action when the component unmounts.
  This change ensures that all overlays are properly cleaned up during testing scenarios, preventing state leakage and side effects from persistent overlays.

  **Related Issue:** Fixes #63

## 1.3.0

### Minor Changes

- [#59](https://github.com/toss/overlay-kit/pull/59) [`828fad5`](https://github.com/toss/overlay-kit/commit/828fad59172a96ca0fecb3a027792db96d942ebe) Thanks [@XionWCFM](https://github.com/XionWCFM)! - feat: Add overlayAsync implementation

  This change implements the openAsync method for overly-kit's promise support discussed in #47.

  **Related Issue:** Fixes #47

## 1.2.4

### Patch Changes

- [#53](https://github.com/toss/overlay-kit/pull/53) [`6f3c26a`](https://github.com/toss/overlay-kit/commit/6f3c26aef21ab639dcaa0c3134299f87de1c01ff) Thanks [@jungpaeng](https://github.com/jungpaeng)! - fix: Enhance Overlay State Management and Prevent Duplicate Entries

  This change enhances the overlay state management to ensure overlays maintain the correct state when closed and reopened, and prevents duplicate overlay entries.
  It addresses issues with the overlay's `current` state not updating correctly in certain scenarios.

  **Related Issue:** Fixes # 46

- [#58](https://github.com/toss/overlay-kit/pull/58) [`b35ac6f`](https://github.com/toss/overlay-kit/commit/b35ac6fdd14e9438a922b9c29c06753da312bc3e) Thanks [@jungpaeng](https://github.com/jungpaeng)! - fix: state reset issue on overlay reopen

  This change fixes an issue where overlays did not retain their state when reopened without unmounting, even though they were not removed from the DOM.
  The overlayReducer has been updated to maintain the state of overlays between close and open cycles, addressing an unintended state reset.

  Related Issue: Fixes #57

## 1.2.3

### Patch Changes

- [#50](https://github.com/toss/overlay-kit/pull/50) [`5d7e84d`](https://github.com/toss/overlay-kit/commit/5d7e84d3d096a5510ba4d7953d37824a4af5dfc2) Thanks [@jungpaeng](https://github.com/jungpaeng)! - Fix: Ensure 'current' reflects the last overlay when closing intermediate overlays

  - Resolve issue where 'current' does not update to the last overlay when closing an intermediate overlay
  - Add logic to correctly update 'current' in reducer

## 1.2.2

### Patch Changes

- [#48](https://github.com/toss/overlay-kit/pull/48) [`2aaa5ea`](https://github.com/toss/overlay-kit/commit/2aaa5eac66ff09ea7477e57b3f2a7d462b6a614a) Thanks [@jungpaeng](https://github.com/jungpaeng)! - fix: Change current value when closing overlay

## 1.2.1

### Patch Changes

- [#42](https://github.com/toss/overlay-kit/pull/42) [`f3c8ef3`](https://github.com/toss/overlay-kit/commit/f3c8ef311422ea75ce58c91d7003cb680cfca40b) Thanks [@jgjgill](https://github.com/jgjgill)! - chore: rename to overlayId

- [#40](https://github.com/toss/overlay-kit/pull/40) [`c0aab02`](https://github.com/toss/overlay-kit/commit/c0aab02c89e5a83351db55d5804cc8815e46cfd7) Thanks [@jungpaeng](https://github.com/jungpaeng)! - Set current to null if no overlay remains on unmount
