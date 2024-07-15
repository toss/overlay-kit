---
description: Installation
prev:
  text: 기능
  link: ./features.md
next:
  text: 튜토리얼
  link: ./quickstart.md
---

# 설치

Node.js와 Bun을 사용하는 경우, [npm](https://npmjs.com/package/overlay-kit)에서 설치할 수 있어요.

## 전제 조건

- [React](https://react.dev/) ^18 버전이 설치되어있어야 해요.

다음 명령어로 overlay-kit을 설치해요.

::: code-group

```sh [npm]
npm install overlay-kit
```

```sh [pnpm]
pnpm install overlay-kit
```

```sh [yarn]
yarn add overlay-kit
```

```sh [bun]
bun add overlay-kit
```

:::

## 요약

일반적으로 `<OverlayProvider />`는 React 애플리케이션 루트에 위치해요. 오버레이는 다른 요소들 위에 렌더링되어야 하기 때문이죠.

```tsx
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

> [!IMPORTANT]
> `<OverlayProvider />`는 전체 React 애플리케이션에서 한 번만 렌더링돼야 해요.