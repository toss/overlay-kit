---
"overlay-kit": patch
---

fix: prevent unnecessary re-renders of existing overlays with memo

Prevent unnecessary re-renders of existing overlays when new overlays are opened, improving performance.

### Key Changes

- **Added React.memo**: Applied memo to overlay controller component to prevent re-renders when props haven't changed
- **Integrated state management**: Streamlined state management by integrating it directly into the component and removing redundant prop passing

### Performance Improvements

- Eliminated unnecessary re-renders of existing overlays when adding new overlays in multi-overlay scenarios
- Provides more predictable and maintainable state management flow
- Maintained existing API compatibility while optimizing internal performance

This change maintains backward compatibility and provides performance improvements without requiring any code changes from users. 
