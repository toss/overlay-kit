# overlay-kit

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
