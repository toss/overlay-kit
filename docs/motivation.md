---
next:
  text: Features
  link: ./features.md
---

# Why overlay-kit?

This document discusses the challenges that overlay-kit addresses.

## The Overlay Problem

Managing overlays in React applications—such as `<Dialog />`, `<Toast />`, and `<Drawer />`—is often cumbersome. Consider the typical approach when you need to open a dialog:

```tsx
import { useState } from 'react';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  /* Some calls to other hooks ... */

  return (
    <>
      {/* Some other components... */}
      <Button 
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open
      </Button>
      {/* Some other components... */}
      <Dialog 
        open={isOpen} 
        onClose={() => {
          setIsOpen(false)
        }}
      />
    </>
  );
}
```

This example involves repetitive boilerplate and can obscure the logic due to React's hooks rules. The state declaration (`isOpen`) is separated from both the trigger (`onClick`) and the component (`<Dialog />`) that uses it, reducing code cohesion.

## The Solution

overlay-kit offers a declarative and hassle-free method for handling overlays. Here's how you simplify dialog management using overlay-kit:

```tsx
import { overlay } from 'overlay-kit';

function MyPage() {
  /* Some calls to other hooks ... */

  return (
    <>
      {/* Some other components... */}
      <Button 
        onClick={() => {
          overlay.open(({ isOpen, close }) => {
            return <Dialog open={isOpen} onClose={close} />;
          })
        }}
      >
        Open
      </Button>
    </>
  );
}
```

This approach reduces boilerplate significantly by eliminating the need for manual state management (`isOpen`). It also clarifies the interaction—clicking the button directly triggers the overlay, making the code more intuitive and cohesive.

overlay-kit enhances the readability and maintainability of your code by simplifying the opening and closing of overlays.

