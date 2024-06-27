---
description: Features
prev:
  text: Why overlay-kit?
  link: ./motivation.md
next:
  text: Installation
  link: ./installation.md
---

# Quick Start

Using overlay-kit is simple and straightforward. In this quick start tutorial, we will create a button that opens an `<Dialog />` from Material UI.

## Adding an `OverlayProvider` to the App

To open overlays using overlay-kit, we need to specify where the overlay will be placed. Typically, we put the overlays near the application's root so that they appear above all other elements. We can use an `<OverlayProvider />` to achieve this.

Let's add an `OverlayProvider` to the root of the app:

```tsx{1,7,9}
import { OverlayProvider } from 'overlay-kit';

export default function App(props) {
  return (
    // Add an `OverlayProvider` at the top of the app.
    // Every overlay is mounted as a sibling to the child of `OverlayProvider`.
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  )
}
```

Now, every overlay opened by `overlay-kit` will be rendered next to the `<Example />` component.

> [!IMPORTANT]
> Ensure to render exactly one `<OverlayProvider />` in the entire React app. 

## Opening an overlay

To open an overlay within the `<OverlayProvider />`, we call [overlay.open(...)](./api/overlay/open.md). 

For example, to open a `<Dialog />` from Material UI, use the following code:

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
                Are you sure?
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
      Open an alert dialog
    </button>
  );
}
```

Opening an overlay with overlay-kit is very straightforward: import the `overlay` object and call `overlay.open(...)`.

The `overlay.open(...)` API provides essential properties and functions to manage overlays:

- `isOpen`: Indicates if the overlay is open. When the overlay is closed, this property is updated to `false`, which can be useful if the overlay has a closing animation.
- `close`: Closes the overlay and sets `isOpen` to `false`.
- `exit`: Completely unmounts the overlay from the React tree.


## Usage with Promises

In the previous example, it's simple to determine whether the user clicked the "Yes" or "No" button. Just wrap it with a `Promise` that returns a `boolean` value:

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
                  Are you sure?
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
         * If the user clicked "Yes", agreed is `true` here.
         * Otherwise, agreed is `false`.
         */
      }}
    >
      Open an alert dialog
    </button>
  );
}
```

overlay-kit can be seamlessly integrated with `Promise`s, making it easy to get results from an overlay.

## Opening an Overlay Outside of React

You can also open overlays outside of React with overlay-kit. For example, if you want to open an overlay when an API error occurs, you can use the following code:

```tsx
import ky from 'ky';
import { overlay } from 'overlay-kit';

const api = ky.extend({
  hooks: {
    afterResponse: [
      (_, __, response) => {
        if (response.status >= 400) {
          overlay.open(({ isOpen, close }) => {
            return (
              <ErrorDialog open={isOpen} onClose={close} />
            );
          });
        }
      }
    ]
  }
})
```

Here, when the status code is 400 or higher, an `<ErrorDialog />` is displayed. Although `ky` is used in this example, similar behavior can be easily implemented with other libraries.
