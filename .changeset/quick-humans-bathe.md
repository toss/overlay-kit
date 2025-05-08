---
"overlay-kit": patch
---

feat: Change to allow each overlay provider to have a unique event ID

Each overlay provider now uses a unique event ID instead of relying on shared global identifiers.

This change improves event handling accuracy and avoids potential collisions when managing multiple overlays from different providers.
It is backward-compatible for existing overlays that do not explicitly set a provider-specific ID.
