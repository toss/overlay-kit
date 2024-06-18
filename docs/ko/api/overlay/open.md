---
description: overlay.open
prev:
  text: Introduction
  link: /ko/api/overlay/intro.md
next:
  text: overlay.close
  link: /ko/api/overlay/close.md
---

# overlay 열기

es-overlay는 open 함수를 사용하여 오버레이를 화면에 띄울 수 있습니다.

callback 함수는 isOpen, onClose, onExit 등의 함수를 제공함으로서 모달의 동작을 제어할 수 있습니다.

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen }) => {
      return (
        <Modal opened={isOpen}>
          <p>MODAL CONTENT</p>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

## onClose

onClose 함수는 오버레이의 isOpen 상태를 false로 변경하고 화면에서 오버레이를 지웁니다. 그러나 메모리에 저장된 오버레이의 정보는 유지되므로 오버레이의 정보가 돔 등에 남아있을 수 있습니다.

- onClose 함수를 사용하면 오버레이의 정보가 메모리에 남아있기 때문에 모달의 정보를 유지한 채 다시 열 수 있습니다.
- animation 등을 표시하기 위해서 돔에서 즉시 제거하면 안 될 때 onClose를 사용할 수 있습니다.

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onClose }) => {
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

## onExit

onExit 함수는 오버레이의 정보를 메모리에서 제거합니다. onExit를 실행하지 않으면 오버레이의 정보가 메모리에 남아 있으므로 오버레이를 더 이상 사용하지 않을 때는 반드시 onExit를 실행해야 합니다.

**모달에서 닫기 애니메이션이 끝난 이후 실행되는 props를 제공하는 경우**

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onClose, onExit }) => {
      return (
        // onExit 함수를 Modal에서 제공하는 props로 전달합니다.
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

**모달에서 닫기 애니메이션이 끝난 이후 실행되는 props를 제공하지 않는 경우**

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onClose, onExit }) => {
      function onCloseOverlay() {
        onClose();
        // 150ms 이후 onExit가 실행됩니다. setTimeout의 ms는 애니메이션이 끝나는 타이밍을 적절히 전달하면 됩니다.
        setTimeout(() => onExit(), 150);
      }

      return (
        <Modal opened={isOpen} onClose={onCloseOverlay}>
          <p>MODAL CONTENT</p>
          <Button onClick={onCloseOverlay}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

**닫기 애니메이션이 없는 모달의 경우**

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onExit }) => {
      return (
        // onClose를 사용해서 모달의 닫는 시점을 지연시킬 필요가 없으니 onExit만을 사용할 수 있습니다.
        <Modal opened={isOpen} onClose={onExit}>
          <p>MODAL CONTENT</p>
          <Button onClick={onExit}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

## onDelayedExit

매번 onClose와 onExit을 함께 실행하는 것이 지루할 수 있습니다.

onClose를 실행한 후 일정 시간 동안 기다렸다가 onExit를 실행하는 onDelayedExit 함수를 제공합니다. 모달과 같은 오버레이에 종료 애니메이션이 있고 돔을 즉시 비울 필요가 없는 경우에 유용할 수 있습니다.

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onDelayedExit }) => {
      function onCloseOverlay() {
        // onClose()가 실행된 이후, 150ms 이후에 onExit()가 실행됩니다.
        onDelayedExit(150);
      }

      return (
        <Modal opened={isOpen} onClose={onCloseOverlay}>
          <p>MODAL CONTENT</p>
          <Button onClick={onCloseOverlay}>Close Overlay</Button>
        </Modal>
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```
