---
"overlay-kit": minor
---

feat: Add local overlay context support

- Add `experimental_createOverlayContext` function to create isolated overlay contexts
- Refactor context management to support multiple overlay instances
- Move overlay provider and controller logic into separate files
- Update store management to support local state
- Add documentation for new context creation API
- Improve type definitions and exports