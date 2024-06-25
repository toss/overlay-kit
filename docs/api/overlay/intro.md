---
description: Introduction
prev:
  text: Installation
  link: /installation.md
next:
  text: overlay.open
  link: /api/overlay/open.md
---

# Overlay

Brings an overlay to the screen.

This refers to components that appear on a separate UI layer, such as Modal, Dialog, etc.

- To use it, you need to add `<OverlayProvider />`.
- You can call the `open` function multiple times to show multiple overlays.
- Can be used with Promises.

## Setup OverlayProvider

Wrap your app in an `OverlayProvider` component.

```tsx
import { OverlayProvider } from 'overlay-kit';

function App() {
  return <OverlayProvider>{/* Your app here */}</OverlayProvider>;
}
```
