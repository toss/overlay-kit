# Code Comparison

Using overlay-kit makes managing React overlays much simpler. Let's take a look at the changes through example code.

## Before: Traditional React Overlay Implementation

Before using overlay-kit, there is a lot of boilerplate code, and due to React's Hook rules, the state declaration, state change, and rendering logic are separated, disrupting the code flow. The `isOpen` state declaration, the `onClick` state change, and the `<Dialog />` component that renders based on the state are far apart.

```tsx{4,10-12,17-22}
import { useState } from 'react';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);
  /* Other Hook calls... */
  return (
    <>
      {/* Other components... */}
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open
      </Button>
      {/* Other components... */}
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

## After: Overlay Implementation with overlay-kit

In contrast, the code using overlay-kit is more cohesive and intuitive. The flow of the code, which states that clicking the button opens the overlay, is clear at a glance.

```tsx{10-14}
import { overlay } from 'overlay-kit';

function MyPage() {
  /* Other Hook calls... */

  return (
    <>
      {/* Other components... */}
      <Button
        onClick={() => {
          overlay.open(({ isOpen, close }) => {
            return <Dialog open={isOpen} onClose={close} />;
          });
        }}
      >
        Open
      </Button>
    </>
  );
}
```

The boilerplate code is significantly reduced. You no longer need to manage the overlay state directly.
