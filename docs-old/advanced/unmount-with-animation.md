# Unmount with animation

Most overlays have animation effects when closing. In overlay-kit, overlays remain mounted even after they are closed to allow animations to continue. **However, to avoid memory leaks, you must unmount the overlay after the closing animation has finished.**

To ensure smooth operation, you can completely unmount the component after the closing animation is done.

## Using the `onExit` Prop

By implementing the `onExit` prop, which indicates that the overlay's closing animation has ended, you can remove the overlay after the animation finishes. Let's look at an example.

In the following code, the `<Dialog />` component uses the `onExit` prop to call the `unmount` function after the animation finishes.

```tsx{6}
import { overlay } from 'overlay-kit';

function Demo() {
  const openDialog = () => {
    overlay.open(({ isOpen, close, unmount }) => {
      return <Dialog open={isOpen} onClose={close} onExit={unmount} />
    });
  };

  return <Button onClick={openDialog}>Open dialog</Button>;
}
```

## Using `setTimeout`

If the `onExit` prop is not available, you can use `setTimeout` to remove the overlay after the animation ends. Set an appropriate timeout duration matching the animation duration.

In the following code, the `close` function closes the overlay, and `setTimeout` is used to call the `unmount` function after 150ms.

```tsx{12-16}
import { overlay } from 'overlay-kit';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, close, unmount }) => {
      return (
        <Dialog
          open={isOpen}
          onClose={() => {
            close();

            // `unmount` is called after 150ms.
            // Adjust the timeout to match the animation duration.
            setTimeout(() => {
              unmount()
            }, 150);
          }}
        />
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

### When There Is No Animation

If there is no animation when the overlay closes, you can call the `unmount` function immediately when closing the overlay to remove the component.

In the following code, the `onClose` prop of the `<Dialog />` component calls the `unmount` function to remove the overlay immediately.


```tsx{9}
import { overlay } from 'overlay-kit';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, unmount }) => {
      return (
        <Dialog
          open={isOpen}
          onClose={unmount}
        />
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```
