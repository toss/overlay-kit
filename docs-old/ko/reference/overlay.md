# overlay 객체

`overlay` 객체는 React에서 오버레이를 관리하기 위한 API를 제공해요. 오버레이를 관리하는 다양한 케이스를 모두 대응할 수 있어요.

- [overlay.open()](#overlay-open)
- [overlay.openAsync()](#overlay-openasync)
- [overlay.close()](#overlay-close)
- [overlay.closeAll()](#overlay-closeall)
- [overlay.unmount()](#overlay-unmount)
- [overlay.unmountAll()](#overlay-unmountall)

## overlay.open()

오버레이를 엽니다.

### 인터페이스

```tsx
overlay.open(
  callback: (props: { isOpen: boolean, close: () => void, unmount: () => void }) => JSX.Element,
  options?: { overlayId?: string }
): string;
```

### 파라미터

- `callback` (function): 오버레이의 상태와 닫기, 제거 기능을 포함한 콜백 함수
  - `isOpen` (boolean): 오버레이가 열려 있는지 여부
  - `close` (function): 오버레이를 닫는 함수로 `isOpen`을 `false`로 설정함
  - `unmount` (function): 오버레이를 React의 요소 트리에서 완전히 제거하는 함수
- `options` (object): 오버레이의 설정을 정의하는 객체 (optional)
  - `overlayId`(string): 오버레이가 열릴 때 생성되는 오버레이 ID

### 반환값

오버레이가 열릴 때 생성된 고유한 ID를 반환해요.

### 예시

```tsx
const overlayId = overlay.open(
  ({ isOpen, close, unmount }) => {
    return (
      <Dialog open={isOpen} onClose={close} onExit={unmount}>
        {/* Dialog content */}
      </Dialog>
    );
  },
  { overlayId: 'overlay-01' }
);

// 나중에 오버레이를 닫을 때 사용
overlay.close(overlayId);

// 나중에 오버레이를 제거할 때 사용
overlay.unmount(overlayId);
```

## overlay.openAsync()

오버레이를 엽니다. Promise와 함께 사용할 수 있어요.

이 메서드는 [`overlay.open()`](#overlay-open)과 비슷하게 작동하지만, Promise를 반환해서 `overlay.close()`에서 resolve 값을 전달할 수 있습니다. 자세한 사용법은 [Promise와 함께 사용하기](../advanced/promise.md)를 참고하세요.

### 인터페이스

```tsx{5}
overlay.openAsync(
  callback: (props: { isOpen: boolean, close: (result?: any) => void, unmount: () => void }) => JSX.Element,
  options?: { overlayId?: string }
): Promise<any>;
```

### 파라미터

- `callback` (function): 오버레이의 상태와 닫기, 제거 기능을 포함한 콜백 함수
  - `isOpen` (boolean): 오버레이가 열려 있는지 여부
  - `close` (function): 오버레이를 닫는 함수로 `isOpen`을 `false`로 설정함
  - `unmount` (function): 오버레이를 React의 요소 트리에서 완전히 제거하는 함수
- `options` (object): 오버레이의 설정을 정의하는 객체 (optional)
  - `overlayId`(string): 오버레이가 열릴 때 생성되는 오버레이 ID

### 반환값

오버레이가 닫힐 때 resolve되는 값을 포함하는 Promise를 반환해요.

### 예시

```tsx
function Example() {
  return (
    <button
      onClick={async () => {
        const agreed = await overlay.openAsync<boolean>(({ isOpen, close }) => {
          const agree = () => close(true);
          const cancel = () => close(false);

          return (
            <Dialog open={isOpen} onClose={cancel}>
              <DialogTitle>
                정말 계속하시겠어요?
              </DialogTitle>
              <DialogActions>
                <Button onClick={cancel}>아니요</Button>
                <Button onClick={agree}>네</Button>
              </DialogActions>
            </Dialog>
          );
        });

        if (agreed) {
          // 사용자가 "네"를 눌렀을 때의 처리
        } else {
          // 사용자가 "아니요"를 눌렀을 때의 처리
        }
      }}
    >
      Alert Dialog 열기
    </button>
  );
}
```

## overlay.close()

특정 오버레이를 닫습니다.

이 메서드를 호출하면 화면에서 오버레이가 사라지지만, 오버레이는 여전히 메모리와 React 요소 트리에 남아 있습니다. 오버레이를 완전히 제거하려면 애니메이션이 끝난 후에 [`overlay.unmount()`](#overlay-unmount)를 호출하세요.

### 인터페이스

```tsx
overlay.close(overlayId: string): void;
```

### 파라미터

- `overlayId`: 닫을 오버레이의 ID

### 예시

```tsx
const overlayId = overlay.open(({ isOpen, close, unmount }) => {
  return (
    <Dialog open={isOpen} onClose={close} onExit={unmount}>
      {/* Dialog content */}
    </Dialog>
  );
});

// 오버레이 닫기
overlay.close(overlayId);
```

## overlay.closeAll()

열려 있는 모든 오버레이를 닫습니다.

이 메서드를 호출하면 화면에서 오버레이가 사라지지만, 오버레이는 여전히 메모리와 React 요소 트리에 남아 있습니다. 오버레이를 완전히 제거하려면 애니메이션이 끝난 후에 [`overlay.unmountAll()`](#overlay-unmountall)를 호출하세요.

### 인터페이스

```tsx
overlay.closeAll(): void;
```

## overlay.unmount()

특정 오버레이를 메모리와 React 요소 트리에서 완전히 제거합니다.

### 인터페이스

```tsx
overlay.unmount(overlayId: string): void;
```

### 파라미터

- `overlayId`: React 요소 트리에서 제거할 오버레이의 ID

### 예시

```tsx
const overlayId = overlay.open(({ isOpen, close, unmount }) => {
  return (
    <Dialog open={isOpen} onClose={close} onExit={unmount}>
      {/* Dialog content */}
    </Dialog>
  );
});

// 오버레이를 제거하기 위해 사용
overlay.unmount(overlayId);
```

## overlay.unmountAll()

모든 오버레이를 메모리와 React 요소 트리에서 완전히 제거합니다.

### 인터페이스

```tsx
overlay.unmountAll(): void;
```
