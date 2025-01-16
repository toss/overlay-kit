---
description: Quick Start
prev:
  text: Installation
  link: ./installation.md
next:
  text: The overlay object
  link: ./reference/overlay.md
---

# Quick Start

## 1. Adding an Overlay

To open an overlay with overlay-kit, you first need to designate where the overlay will be rendered. Typically, overlays are rendered at the root of the application so that they appear above other elements.

You can use the [`<OverlayProvider />`](./reference/overlay-provider.md) component for this. Let's add the [`<OverlayProvider />`](./reference/overlay-provider.md) to the root of your application.

```tsx{1,7,9}
import { OverlayProvider } from 'overlay-kit';

export default function App(props) {
  return (
    // Render `OverlayProvider` at the top level of your app.
    // Now all overlays will be rendered next to the `<Example />` component.
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  )
}
```

Now, all overlays opened with overlay-kit will be rendered next to the <Example /> component.

::: tip Note

[`<OverlayProvider />`](./reference/overlay-provider.md) should only be rendered once in the entire React application.

:::

## 2. Opening an overlay

Next, let’s add functionality to open an overlay when a button is clicked. To open an overlay within the [`<OverlayProvider />`](./reference/overlay-provider.md), you can call [overlay.open()](./reference/overlay.md#overlay-open).

Since we want to open a `<Dialog />` from Material UI, we can write the following code:

```tsx{1,14-30}
import { overlay } from 'overlay-kit';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Example() {
  return (
    <button
      onClick={() => {
        overlay.open(({ isOpen, close }) => {
          return (
            <Dialog open={isOpen} onClose={close}>
              <DialogTitle>
                Do you really want to continue?
              </DialogTitle>
              <DialogActions>
                <Button onClick={close}>
                  No
                </Button>
                <Button onClick={close}>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          )
        });
      }}
    >
      Open Alert Dialog
    </button>
  );
}
```

With overlay-kit, opening an overlay is intuitive. Simply import the `overlay` object and call [`overlay.open()`](./reference/overlay.md#overlay-open).

The [`overlay.open()`](./reference/overlay.md#overlay-open) API provides all the properties needed to open and close the overlay. Check the [reference](./reference/overlay.md) for more details.

## 3. Handling User Button Click Results

Now, let’s handle the result of the button clicked by the user. overlay-kit can work with Promises, making it easy to get the result from the overlay. Wrap it in a `Promise` that returns a `boolean` value as shown below:

```tsx{5,7-10,12-15,35-38}
function Example() {
  return (
    <button
      onClick={async () => {
        const agreed = await new Promise<boolean>(resolve => {
          overlay.open(({ isOpen, close }) => {
            const agree = () => {
              resolve(true);
              close();
            };

            const cancel = () => {
              resolve(false);
              close();
            };

            return (
              <Dialog open={isOpen} onClose={cancel}>
                <DialogTitle>
                  Do you really want to continue?
                </DialogTitle>
                <DialogActions>
                  <Button onClick={cancel}>
                    No
                  </Button>
                  <Button onClick={agree}>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            )
          });
        });

        /*
         * If the user clicked "Yes", `agreed` will be `true`.
         * Otherwise, `agreed` will be `false`.
         */
      }}
    >
      Open Alert Dialog
    </button>
  );
}
```

## 4. Closing Overlays and Memory Management

To avoid memory leaks when closing overlays, you should unmount the overlay after closing it. Even though the overlay disappears from the screen, it remains in memory and the React element tree. Refer to the [Memory Management](./advanced/unmount-with-animation.md#unmount-with-animation) documentation for details.

Let’s add code to unmount the overlay after the user clicks "Yes" or "No" and the closing animation finishes.

```tsx
function Example() {
  return (
    <button
      onClick={async () => {
        const agreed = await new Promise<boolean>(resolve => {
          overlay.open(({ isOpen, close, unmount }) => {
            const agree = () => {
              resolve(true);
              close();
              setTimeout(unmount, 150); // Adjust to match the duration of your animation.
            };

            const cancel = () => {
              resolve(false);
              close();
              setTimeout(unmount, 150); // Adjust to match the duration of your animation.
            };

            return (
              <Dialog open={isOpen} onClose={cancel}>
                <DialogTitle>
                  Do you really want to continue?
                </DialogTitle>
                <DialogActions>
                  <Button onClick={cancel}>
                    No
                  </Button>
                  <Button onClick={agree}>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            )
          });
        });

        /*
         * If the user clicked "Yes", `agreed` will be `true`.
         * Otherwise, `agreed` will be `false`.
         */
      }}
    >
      Open Alert Dialog
    </button>
  );
}
```

## 5. Handling Network Errors

Finally, let’s handle potential API errors by opening an overlay from outside React.

```tsx
import ky from 'ky';
import { overlay } from 'overlay-kit';

const api = ky.extend({
  hooks: {
    afterResponse: [
      (_, __, response) => {
        if (response.status >= 400) {
          overlay.open(({ isOpen, close }) => {
            return <ErrorDialog open={isOpen} onClose={close} />;
          });
        }
      },
    ],
  },
});
```

By implementing these steps, you can provide a better overlay experience for your users. For more advanced usage, such as assigning custom IDs to overlays or handling overlay animations for a smoother user experience, refer to the 'Advanced' section.