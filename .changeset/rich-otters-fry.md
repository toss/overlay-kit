---
"overlay-kit": patch
"@overlay-kit/framer-motion-react-16": patch
"@overlay-kit/framer-motion-react-17": patch
---

Fix path resolution error by updating import path for 'use-sync-external-store/shim'

The import path for `use-sync-external-store/shim` was incorrect, causing a path resolution error during build. This change updates the import statement to include `index.js`, resolving the path issue.
