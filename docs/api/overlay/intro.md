# Overlay

Brings an overlay to the screen.

This refers to components that appear on a separate UI layer, such as Modal, Dialog, etc.

- To use it, you need to add `<OverlayProvider />`.
- You can call the open function multiple times to show multiple overlays.
- Can be used with Promises.

## Setup OverlayProvider

Wrap your app in an `OverlayProvider` component.

```tsx
import { OverlayProvider } from 'es-overlay';

function App() {
  return <OverlayProvider>{/* Your app here */}</OverlayProvider>;
}
```

## Open overlays

es-overlay uses the open function to bring an overlay to the screen.

The callback function provides the open state of the modal along with a function to close the overlay.

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onClose, onExit }) => {
      function onCloseOverlay() {
        // Remove the overlay from the screen.
        onClose();
        // Remove the overlay from the dom.
        onExit();
      }

      return (
        <Modal opened={isOpen} onClose={onCloseOverlay}>
          <p>MODAL CONTENT</p>
          <Button onClick={onCloseOverlay}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

### onClose, onExit

The callback argument of overlays.open provides two functions: onClose and onExit.

The onClose function changes the overlay's isOpen state to false and clears it from the screen. However, the overlay's information stored in memory is preserved, so the overlay's information may remain in domes, etc.

The onExit function removes the overlay's information from memory. If you do not run onExit, the overlay's information will remain in memory, so be sure to run onExit when you are no longer using the overlay.

### onDelayedExit

You might find it tedious to run onClose and onExit together every time.

We provide an onDelayedExit function that runs onClose and then waits a certain amount of time before running onExit. This can be useful when an overlay, such as a Modal, has an exit animation and doesn't need to be emptied from the dome immediately.

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onDelayedExit }) => {
      function onCloseOverlay() {
        // Run onClose, and after 150 ms, onExit.
        onDelayedExit(150);
      }

      return (
        <Modal opened={isOpen} onClose={onCloseOverlay}>
          <p>MODAL CONTENT</p>
          <Button onClick={onCloseOverlay}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```
