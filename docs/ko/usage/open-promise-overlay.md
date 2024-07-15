# promise overlay 열기

`overlay.openAsync(...)` 함수를 이용해서 Promise와 결합된 오버레이를 열 수 있어요.

```tsx
const result = overlay.openAsync(({ isOpen, close, unmount }) => {
  return (
    <Dialog
      open={isOpen}
      onSuccess={() => close(true)}
      onCancel={() => close(false)}
      onExit={unmount}
    >
      {/* Dialog content */}
    </Dialog>
  );
});

/**
 * `onSuccess` 함수가 실행되는 경우, `result`는 `true`가 돼요.
 * `onCancel` 함수가 실행되는 경우, `result`는 `false`가 돼요.
 */
```

## API

`overlay.open(...)`의 콜백 함수에는 다음과 같은 프로퍼티들이 주어져요.

- `isOpen`: 오버레이가 열려 있는지를 나타내요. 오버레이가 닫히면, `isOpen`은 `true`에서 `false`로 바뀌어요. 오버레이가 닫히는 애니메이션이 있는 경우에 유용해요.
- `close`: 오버레이를 닫고, `isOpen`을 `false`로 설정해요. 인자로 resolve 시킬 값을 전달할 수 있어요.
- `unmount`: 오버레이를 React의 요소 트리에서 완전히 제거해서 Unmount시켜요.

API에 대한 자세한 내용은 [open-overlay의 API](./open-overlay#api)를 확인해주세요.