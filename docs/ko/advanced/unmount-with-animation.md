# 오버레이 애니메이션과 Unmount 처리

오버레이는 애니메이션과 자주 같이 쓰이는데요. 자연스러운 동작을 구현하기 위해 오버레이를 닫을 때 애니메이션이 끝난 후에 컴포넌트를 완전히 제거(Unmount)할 수 있어요.

## `onExit` Prop 사용하기

오버레이 컴포넌트가 닫히는 애니메이션이 종료되었다는 것을 나타내는 `onExit` Prop을 구현하면 애니메이션이 끝난 후에 오버레이를 제거할 수 있어요. 예제 코드로 살펴볼게요.

다음 코드에서 `<Dialog />` 컴포넌트는 `onExit` Prop을 사용해서 애니메이션이 끝난 후에 `unmount` 함수를 호출합니다.

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

## `setTimeout` 사용하기

`onExit` Prop이 없다면, `setTimeout`을 사용해서 애니메이션이 종료된 후에 오버레이를 제거할 수 있어요. 애니메이션 지속 시간에 맞춰 적절한 타임아웃을 설정하세요.

다음 코드에서 `close` 함수는 오버레이를 닫고, `setTimeout`을 사용해서 150ms 후에 `unmount` 함수를 호출합니다.

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

### 애니메이션이 없을 때

오버레이가 닫힐 때 애니메이션이 없다면 오버레이를 닫을 때 바로 `unmount` 함수를 호출해서 컴포넌트를 제거하면 돼요.

다음 코드에서 `<Dialog />` 컴포넌트의 `onClose` Prop이 `unmount` 함수를 호출해서 오버레이를 바로 제거합니다.

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