# The overlay object

The `overlay` object provides various APIs to manage overlays in React.

## overlay.open

Use the `overlay.open(...)` function to open overlays using `overlay-kit`.

```tsx
overlay.open(({ isOpen, close, exit }) => {
  return (
    <Dialog open={isOpen} onClose={close} onExit={exit}>
      {/* Dialog content */}
    </Dialog>
  );
});
```

### API

The callback function provided to `overlay.open(...)` includes the following properties:

- `isOpen`: Indicates if the overlay is open. When the overlay is closed, this property is updated to `false`, which can be useful if the overlay has a closing animation.
- `close`: Closes the overlay and sets `isOpen` to `false`.
- `exit`: Completely unmounts the overlay from the React tree.

### Closing the Overlay

To close the overlay, use the `close` function provided to the callback. Calling `close` updates the `isOpen` state to `false`, hiding the overlay from the screen.

Most overlays have exit animations when closed. Keeping the overlay mounted after closing allows you to handle these animations. Ensure you unmount the overlay after the animation finishes to prevent potential memory leaks.

### Unmounting the Overlay

To unmount the overlay, use the `exit` function provided to the callback. After calling `exit`, the overlay is completely removed from the React tree.

For example, if the overlay component provides an `onExit` prop indicating that the exit animation is over, we write code like this:

```tsx{6}
import { overlay } from 'overlay-kit';

function Demo() {
  const openDialog = () => {
    overlay.open(({ isOpen, close, exit }) => {
      return <Dialog opened={isOpen} onClose={close} onExit={exit} />
    });
  };

  return <Button onClick={openDialog}>Open dialog</Button>;
}
```

Otherwise, you might remove the overlay after a certain timeframe using `setTimeout`.

```tsx{12-17}
import { overlay } from 'overlay-kit';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, close, exit }) => {
      return (
        <Dialog 
          open={isOpen} 
          onClose={() => {
            close();

            // `exit` will be executed after 150 ms.
            // Adjust the timeout to the appropriate time 
            // when the animation ends.
            setTimeout(() => {
              exit()
            }, 150);
          }} 
        />
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

If the overlay has no exit animation, you can unmount it immediately when closed.

```tsx{9}
import { overlay } from 'overlay-kit';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, exit }) => {
      return (
        <Dialog 
          open={isOpen} 
          onClose={exit} 
        />
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```
s
### The Overlay ID

`overlay.open(...)`  returns the ID of the opened overlay, which can be used later to close or unmount the overlay outside the callback function.

```tsx
const overlayId = overlay.open(...);
```

## overlay.close

To close a specific overlay, pass its `overlayId` to `overlay.close(...)`.

```tsx
overlay.close(overlayId)
```

## overlay.exit

To unmount a specific overlay, pass its `overlayId` to `overlay.exit(...)`.

```tsx
overlay.exit(overlayId)
```

## overlay.closeAll

To close all open overlays, use `overlay.closeAll()`.

```tsx
overlay.closeAll();
```

## overlay.exitAll

To unmount all open overlays, use `overlay.unmountAll()`.

```tsx
overlay.unmountAll();
```
