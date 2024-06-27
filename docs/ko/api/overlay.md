# overlay 객체

`overlay` 객체는 React에서 오버레이를 관리하기 위해 다양한 API를 제공해요.

## overlay.open

오버레이를 열기 위해서 `overlay.open(...)` 함수를 쓸 수 있어요.

```tsx
overlay.open(({ isOpen, close, unmount }) => {
  return (
    <Dialog open={isOpen} onClose={close} onExit={unmount}>
      {/* Dialog content */}
    </Dialog>
  );
});
```

### API

`overlay.open(...)`의 콜백 함수에는 다음과 같은 프로퍼티들이 주어져요.

- `isOpen`: 오버레이가 열려 있는지를 나타내요. 오버레이가 닫히면, `isOpen`은 `true`에서 `false`로 바뀌어요. 오버레이가 닫히는 애니메이션이 있는 경우에 유용해요.
- `close`: 오버레이를 닫고, `isOpen`을 `false`로 설정해요.
- `unmount`: 오버레이를 React의 요소 트리에서 완전히 제거해서 Unmount시켜요.

### 오버레이 닫기

오버레이를 닫기 위해서는, 콜백 함수에 주어진 `close` 함수를 사용하세요. `close` 함수를 호출하면, `isOpen` 상태는 `false`가 되어요. 오버레이가 `open` Prop을 구현한다면, 화면에서 사라지죠.

대부분의 오버레이는 닫힐 때 애니메이션을 가지고 있어요. overlay-kit에서는 오버레이를 닫아도 애니메이션이 계속 실행되도록, Mount 상태를 유지해요.
메모리 릭을 피하기 위해서는, 닫히는 애니메이션이 끝난 다음에 잊지 않고 오버레이를 Unmount시켜줘야 해요.

### 오버레이 Unmount

오버레이를 Unmount시키기 위해서는, 콜백 함수에 주어진 `unmount` 함수를 사용하세요. `unmount` 함수를 호출하면, 오버레이는 React 트리에서 완전히 사라져요.

예를 들어서, 오버레이 컴포넌트가 닫히는 애니메이션이 종료되었음을 나타내는 `onExit` Prop을 구현한다면, 이렇게 코드를 쓸 수 있어요.

```tsx{6}
import { overlay } from 'overlay-kit';

function Demo() {
  const openDialog = () => {
    overlay.open(({ isOpen, close, unmount }) => {
      return <Dialog opened={isOpen} onClose={close} onExit={unmount} />
    });
  };

  return <Button onClick={openDialog}>Open dialog</Button>;
}
```

만약에 `onExit` Prop이 없다면, `setTimeout`으로 애니메이션이 종료된 다음에 오버레이를 Unmount시킬 수도 있어요.

```tsx{12-16}
import { overlay } from 'overlay-kit';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, close, unmount }) => {
      return (
        <Dialog
          open={isOpen}
          onClose={() => {
            close();

            // `unmount`은 150ms 이후에 실행돼요.
            // 애니메이션 재생 시간에 맞춰서 적절하게 타임아웃을 조절해주세요.
            setTimeout(() => {
              unmount()
            }, 150);
          }}
        />
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

오버레이에 닫히는 애니메이션이 없다면, 닫힐 때 바로 Unmount 시켜도 돼요.

```tsx{9}
import { overlay } from 'overlay-kit';

function Demo() {
  const openModal = () => {
    overlay.open(({ isOpen, unmount }) => {
      return (
        <Dialog
          open={isOpen}
          onClose={unmount}
        />
      );
    });
  };

  return <Button onClick={openModal}>Open confirm modal</Button>;
}
```

### 오버레이 ID

`overlay.open(...)`은 오버레이의 ID를 반환해요. 추후 콜백 함수 바깥에서도 오버레이를 닫거나 Unmount 시키는 데에 사용돼요.

```tsx
const overlayId = overlay.open(...);
```

## overlay.close

특정 오버레이를 닫기 위해서는, `overlay.close(...)`에 `overlayId`를 제공하세요.

```tsx
overlay.close(overlayId);
```

## overlay.unmount

특정 오버레이를 Unmount 시키기 위해서는, `overlay.unmount(...)`에 `overlayId`를 제공하세요.

```tsx
overlay.unmount(overlayId);
```

## overlay.closeAll

열려 있는 모든 오버레이를 닫기 위해서는, `overlay.closeAll()` 을 사용하세요.

```tsx
overlay.closeAll();
```

## overlay.unmountAll

모든 오버레이를 Unmount 시키기 위해서는, `overlay.unmountAll()` 을 사용하세요.

```tsx
overlay.unmountAll();
```
