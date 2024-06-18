# 오버레이

화면에 오버레이를 표시합니다.

모달, 대화 상자 등과 같이 별도의 UI 레이어에 표시되는 컴포넌트를 말합니다.

- 이를 사용하려면 `<OverlayProvider />`를 추가해야 합니다.
- 열기 함수를 여러 번 호출하여 여러 개의 오버레이를 표시할 수 있습니다.
- 프로미스와 함께 사용할 수 있습니다.

## 오버레이 공급자 설정

`OverlayProvider` 컴포넌트로 앱을 감싸세요.

```tsx
import { OverlayProvider } from 'es-overlay';

function App() {
  return <OverlayProvider>{/* Your app here */}</OverlayProvider>;
}
```

## 오버레이 열기

es-overlay는 open 함수를 사용하여 오버레이를 화면에 가져옵니다.

callback 함수는 오버레이를 닫는 함수와 함께 모달의 열린 상태를 제공합니다.

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onClose, onExit }) => {
      function onCloseOverlay() {
        // Remove the overlay from the screen.
        onClose();
        // Remove the overlay from the dom.
        onExit();
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

### onClose, onExit

overlays.open의 콜백 인수는 onClose와 onExit의 두 가지 함수를 제공합니다.

onClose 함수는 오버레이의 isOpen 상태를 false로 변경하고 화면에서 오버레이를 지웁니다. 그러나 메모리에 저장된 오버레이의 정보는 유지되므로 오버레이의 정보가 돔 등에 남아있을 수 있습니다.

onExit 함수는 오버레이의 정보를 메모리에서 제거합니다. onExit를 실행하지 않으면 오버레이의 정보가 메모리에 남아 있으므로 오버레이를 더 이상 사용하지 않을 때는 반드시 onExit를 실행해야 합니다.

### onDelayedExit

매번 onClose와 onExit을 함께 실행하는 것이 지루할 수 있습니다.

onClose를 실행한 후 일정 시간 동안 기다렸다가 onExit를 실행하는 onDelayedExit 함수를 제공합니다. 모달과 같은 오버레이에 종료 애니메이션이 있고 돔을 즉시 비울 필요가 없는 경우에 유용할 수 있습니다.

```tsx
import { overlays } from 'es-overlay';
import { Modal, Button, Text } from '@src/component';

function Demo() {
  const openModal = () => {
    overlays.open(({ isOpen, onDelayedExit }) => {
      function onCloseOverlay() {
        // Run onClose, and after 150 ms, onExit.
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
