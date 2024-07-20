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
    // 모든 오버레이는 `<Component />` 뒤에 렌더링돼요.
    <OverlayProvider>
      <button onClick={notify}>open modal</button>
    </OverlayProvider>
  );
}
```

::: tip 유의할 점

`<OverlayProvider />`는 React 애플리케이션 전체에서 한 번만 렌더링해야 해요.

:::