# overlay 객체

`overlay` 객체는 React에서 오버레이를 관리하기 위한 API를 제공해요.

- [overlay.open()](#overlayopen)
- [overlay.close()](#overlayclose)
- [overlay.unmount()](#overlayunmount)
- [overlay.closeAll()](#overlaycloseall)
- [overlay.unmountAll()](#overlayunmountall)

## overlay.open

오버레이를 열기 위해 `overlay.open()` 함수를 사용해요.

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

## overlay.close

특정 오버레이를 닫을 수 있어요.

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

## overlay.unmount

특정 오버레이를 완전히 제거하기 위해 `overlay.unmount()`를 사용하세요.

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

## overlay.closeAll

열려 있는 모든 오버레이를 닫을 때 사용해요.

### 인터페이스

```tsx
overlay.closeAll(): void;
```

## overlay.unmountAll

모든 오버레이를 React 트리에서 완전히 제거할 때 사용해요.

### 인터페이스

```tsx
overlay.unmountAll(): void;
```
