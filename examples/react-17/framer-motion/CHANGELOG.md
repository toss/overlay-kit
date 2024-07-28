# @overlay-kit/framer-motion-react-17

## 0.0.7

### Patch Changes

- [#74](https://github.com/toss/overlay-kit/pull/74) [`324dab9`](https://github.com/toss/overlay-kit/commit/324dab92b9bdda007930a4f4e731257b053e5156) Thanks [@jungpaeng](https://github.com/jungpaeng)! - Fix path resolution error by updating import path for 'use-sync-external-store/shim'

  The import path for `use-sync-external-store/shim` was incorrect, causing a path resolution error during build. This change updates the import statement to include `index.js`, resolving the path issue.

## 0.0.6

### Patch Changes

- Updated dependencies [[`01eaa3c`](https://github.com/toss/overlay-kit/commit/01eaa3c41e367224852cad56bc0214f1bf05ff77), [`9776fff`](https://github.com/toss/overlay-kit/commit/9776fff2bccc683afb9dfdfa7ad0b568cd902b7d)]:
  - overlay-kit@1.4.0
