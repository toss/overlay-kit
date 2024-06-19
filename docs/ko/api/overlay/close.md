---
description: overlay.close
prev:
  text: overlay.open
  link: /ko/api/overlay/open.md
next:
  text: overlay.open
  link: /ko/api/overlay/open.md
---

# overlay 닫기

열려있는 overlay를 닫을 수 있는 방법을 소개합니다.

## overlayId

오버레이의 id는 `useOverlayList()` 훅을 통해서 전체 오버레이의 id 목록을 가져오거나, modal이 열릴 때 overlayId를 state에 저장하는 방법을 이용할 수 있습니다.

```tsx
import { overlay } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  // 오버레이의 전체 id 목록을 가져올 수 있습니다.
  const overlayList = useOverlayList();

  const openModal = () => {
    overlay.open(({ isOpen, overlayId, onClose }) => {
      // 오버레이가 열릴 때 overlayId를 가져올 수 있습니다.
      console.log(overlayId);

      return (
        <Modal opened={isOpen} onClose={onClose}>
          <p>MODAL CONTENT</p>
          <Button onClick={onClose}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

## overlay.close

overlay.close 함수는 오버레이의 id 값을 인자로 받고 해당 overlay에 onClose 이벤트를 전달합니다.

```ts
import { overlay } from 'es-overlay';

// 1234 라는 id를 가진 overlay를 화면에서 제거합니다.
overlay.close('1234');
```

## overlay.exit

overlay.exit 함수는 오버레이의 id 값을 인자로 받고 해당 overlay에 onExit 이벤트를 전달합니다.

```ts
import { overlay } from 'es-overlay';

// 1234 라는 id를 가진 overlay를 메모리에서 제거합니다.
overlay.exit('1234');
```

## overlay.delayedExit

overlay.delayedExit 함수는 오버레이의 id 값을 인자로 받고 해당 overlay에 onDelayedExit 이벤트를 전달합니다.

```ts
import { overlay } from 'es-overlay';

// 1234 라는 id를 가진 overlay를 화면에서 제거한 후, 150ms 이후 메모리에서 제거합니다.
overlay.delayedExit({ id: '1234', ms: 150 });
```

## overlay.closeAll

overlay.closeAll 함수는 현재 열려있는 모든 오버레이를 화면에서 제거합니다.

```ts
import { overlay } from 'es-overlay';

// 1234 라는 id를 가진 overlay를 화면에서 제거합니다.
overlay.closeAll();
```

## overlay.exitAll

overlay.exitAll 함수는 현재 열려있는 모든 오버레이를 메모리에서 제거합니다.

```ts
import { overlay } from 'es-overlay';

// 1234 라는 id를 가진 overlay를 메모리에서 제거합니다.
overlay.exitAll();
```

## overlay.delayedExitAll

overlay.exitAll 함수는 현재 열려있는 모든 오버레이를 화면에서 제거한 이후, 메모리에서 제거합니다.

```ts
import { overlay } from 'es-overlay';

// 모든 오버레이를 화면에서 제거한 후, 150ms 이후 메모리에서 제거합니다.
overlay.delayedExitAll(150);
```

## useRemoveAllOnUnmount

useRemoveAllOnUnmount 훅이 호출된 컴포넌트는 언마운트될 때 현재 열려있는 모든 오버레이를 제거합니다.

```tsx
import { overlay, useRemoveAllOnUnmount } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  // Demo 컴포넌트가 라우팅 이동, conditional rendering 등의 이유로 언마운트되면 현재 열려있는 오버레이가 화면에서 제거되고, 150ms 이후 메모리에서 제거됩니다.
  useRemoveAllOnUnmount(150);

  const openModal = () => {
    overlay.open(({ isOpen, onClose, onExit }) => {
      return (
        <Modal opened={isOpen} onExit={onExit}>
          <p>MODAL CONTENT</p>
          <Button onClick={onClose}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```
