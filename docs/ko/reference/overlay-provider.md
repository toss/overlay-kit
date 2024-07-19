# OverlayProvider 컴포넌트

`<OverlayProvider />`는 React 컴포넌트 트리에서 오버레이가 어디에 렌더링 되는지 정의해요.

## 인터페이스

```tsx
interface Props {
  children?: ReactNode;
}

export function OverlayProvider({ children }: Props): JSX.Element;
```

## 사용법

일반적으로 `<OverlayProvider />`는 React 애플리케이션 루트에 위치해요. 오버레이는 다른 요소들 위에 렌더링 되어야 하기 때문이에요.

```tsx
import { OverlayProvider } from 'overlay-kit';

export default function App({ Component }) {
  return (
    // 모든 오버레이는 `<Component />` 뒤에 렌더링돼요.
    <OverlayProvider>
      <Component />
    </OverlayProvider>
  );
}
```

::: important 
`<OverlayProvider />`는 전체 React 애플리케이션에서 한 번만 렌더링해야 해요.
:::