# OverlayProvider Component

The `<OverlayProvider />` defines where overlays are rendered within the React component tree.

## Interface

```tsx
interface Props {
  children?: ReactNode;
}

export function OverlayProvider({ children }: Props): JSX.Element;
```

## Usage

Typically, the `<OverlayProvider />` is placed at the root of your React application to ensure that overlays render above other elements.

```tsx{14-16}
import React from 'react';
import { OverlayProvider, overlay } from 'overlay-kit';
import { Modal } from '@src/components';

function App(){
  const notify = () => overlay.open(({ isOpen, close, unmount }) => (
    <Modal isOpen={isOpen} onClose={close} onExit={unmount}>
      {/* ... */}
    </Modal>
  ));

  return (
    // All overlays will be rendered after `<Component />`.
    <OverlayProvider>
      <button onClick={notify}>open modal</button>
    </OverlayProvider>
  );
}
```

::: tip Note

The `<OverlayProvider />` should only be rendered once in the entire React application.

:::