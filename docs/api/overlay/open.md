---
description: overlay.open
prev:
  text: Installation
  link: /api/overlay/intro.md
next:
  text: overlay.close
  link: /api/overlay/close.md
---

# Open overlay

overlay-kit uses the open function to bring an overlay to the screen.

The callback function provides the open state of the modal along with a function to close the overlay.

```tsx
import { overlay } from 'overlay-kit';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen }) => {
      return (
        <Modal opened={isOpen}>
          <p>MODAL CONTENT</p>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

## close

The close function changes the overlay's isOpen state to false and clears the overlay from the screen. However, the overlay's information stored in memory is retained, so the overlay's information may remain in the dome, etc.

- The close function allows you to reopen the modal with the overlay's information retained because it is still in memory.
- You can use close when you don't want to immediately remove it from the dome to show an animation, etc.

```tsx
import { overlay } from 'overlay-kit';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <Modal opened={isOpen} onClose={close}>
          <p>MODAL CONTENT</p>
          <Button onClick={close}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

## exit

The exit function removes the overlay's information from memory. If you don't run exit, the overlay's information remains in memory, so be sure to run exit when the overlay is no longer in use.

**If the modal provides props that are executed after the close animation ends.**

```tsx
import { overlay } from 'overlay-kit';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, close, exit }) => {
      return (
        // Pass the exit function to the props provided by the Modal.
        <Modal opened={isOpen} onExit={exit}>
          <p>MODAL CONTENT</p>
          <Button onClick={close}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

**if the modal does not provide any props to be executed after the close animation ends**.

```tsx
import { overlay } from 'overlay-kit';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, close, exit }) => {
      function onCloseOverlay() {
        close();
        // exit will be executed after 150 ms. The ms in setTimeout can be passed to the appropriate time when the animation ends.
        setTimeout(() => exit(), 150);
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

**For modals without a closing animation**.

```tsx
import { overlay } from 'overlay-kit';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, exit }) => {
      return (
        // We don't need to use close to delay the closing of the modal, so we can just use exit.
        <Modal opened={isOpen} onClose={exit}>
          <p>MODAL CONTENT</p>
          <Button onClick={exit}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

## onDelayedExit

It can be tedious to run close and exit together every time.

We provide an onDelayedExit function that waits a certain amount of time after running close before running exit. This can be useful when an overlay, such as a modal, has an exit animation and the dome doesn't need to be emptied immediately.

```tsx
import { overlay } from 'overlay-kit';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, onDelayedExit }) => {
      function onCloseOverlay() {
        // After close() is executed, exit() is executed 150ms later.
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
