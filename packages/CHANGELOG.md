# overlay-kit

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
