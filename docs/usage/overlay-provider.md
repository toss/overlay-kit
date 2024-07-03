# OverlayProvider

Defines where overlays are rendered within the React component tree.

## Signature

```tsx
interface Props {
  children?: ReactNode;
}

export function OverlayProvider({ children }: Props): JSX.Element;
```

## Usage

Typically, this provider is placed at the root of the React application to ensure it renders above all other elements.

```tsx
import { OverlayProvider } from 'overlay-kit';

export default function App({ Component }) {
  return (
    // All overlays are rendered after `<Component />`.
    <OverlayProvider>
      <Component />
    </OverlayProvider>
  );
}
```

> [!IMPORTANT]
> Make sure to render only one `<OverlayProvider />` in the entire React application.
