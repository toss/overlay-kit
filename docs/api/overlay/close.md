---
description: overlay.close
prev:
  text: overlay.open
  link: /api/overlay/open.md
next:
  text: overlay.open
  link: /api/overlay/open.md
---

# Close overlay

Here's how you can close an open overlay.

## overlayId

The overlay's id can be obtained via the `useOverlayList()` hook to get a list of all overlay's ids, or by storing the overlayId in state when the modal is opened.

```tsx
import { overlay } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  // Get the full list of IDs for the overlay.
  const overlayList = useOverlayList();

  const openModal = () => {
    overlay.open(({ isOpen, overlayId, onClose }) => {
      // You can get the overlayId when the overlay is opened.
      console.log(overlayId);

      return (
        <Modal opened={isOpen} onClose={onClose}>
          <p>MODAL CONTENT</p>
          <Button onClick={onClose}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

## overlay.close

The overlay.close function takes the overlay's id value as an argument and passes the onClose event to that overlay.

```ts
import { overlay } from 'es-overlay';

// Remove the overlay with the id 1234 from the screen.
overlay.close('1234');
```

## overlay.exit

The overlay.exit function takes the overlay's id value as an argument and passes the onExit event to that overlay.

```ts
import { overlay } from 'es-overlay';

// Remove the overlay with id 1234 from memory.
overlay.exit('1234');
```

## overlay.delayedExit

The overlay.delayedExit function takes the overlay's id value as an argument and passes the onDelayedExit event to that overlay.

```ts
import { overlay } from 'es-overlay';

// Remove the overlay with id 1234 from the screen, then remove it from memory after 150ms.
overlay.delayedExit({ id: '1234', ms: 150 });
```

## overlay.closeAll

The overlay.closeAll function removes all currently open overlay from the screen.

```ts
import { overlay } from 'es-overlay';

// Remove the overlay with id 1234 from screen.
overlay.closeAll();
```

## overlay.exitAll

The overlay.exitAll function removes all currently open overlay from memory.

```ts
import { overlay } from 'es-overlay';

// Remove the overlay with id 1234 from memory.
overlay.exitAll();
```

## overlay.delayedExitAll

The overlay.exitAll function removes all currently open overlay from the screen, and then removes them from memory.

```ts
import { overlay } from 'es-overlay';

// Remove all overlay from the screen, then remove them from memory after 150ms.
overlay.delayedExitAll(150);
```

## useRemoveAllOnUnmount

Components with the useRemoveAllOnUnmount hook called will remove all currently open overlay when they are unmounted.

```tsx
import { overlay, useRemoveAllOnUnmount } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  // When the Demo component is unmounted for reasons such as routing moves, conditional rendering, etc., the currently open overlay is removed from the screen, and after 150ms it is removed from memory.
  useRemoveAllOnUnmount(150);

  const openModal = () => {
    overlay.open(({ isOpen, onClose, onExit }) => {
      return (
        <Modal opened={isOpen} onExit={onExit}>
          <p>MODAL CONTENT</p>
          <Button onClick={onClose}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```
