# Promise와 함께 사용하기

overlay-kit은 Promise와 함께 사용하기도 쉬운데요. 복잡한 유즈케이스가 오버레이와 연결되어 있을 때도 오버레이로부터 결과값을 받아 처리할 수 있어요. 여러 상태를 정의한 뒤, 복잡한 콜백 구조를 가진 코드를 만들 필요가 없죠.

오버레이를 Promise와 함께 사용하는 두 가지 방법이 있어요. 기본적으로 `new Promise`를 사용하는 방법, 그리고 overlay-kit이 제공하는 [`overlay.openAsync()`](../reference/overlay.md#overlay-openasync)를 사용하는 방법이 있어요.

사용자가 전달한 결과를 받아 처리하는 `<Dialog />`를 렌더링하는 예제 코드로 두 가지 방법 모두 살펴볼게요.

## 1. `new Promise` 사용하기

기본적인 방법은 JavaScript의 기본 Promise 객체를 사용해서 오버레이의 결과를 처리하는 거예요. `new Promise`를 사용하면 오버레이가 닫힐 때 resolve되는 값을 받아서 후속 작업을 할 수 있어요. 마치 DOM API의 [confirm()](https://developer.mozilla.org/ko/docs/Web/API/Window/confirm)을 사용하는 것처럼, 사용자가 선택한 값을 받아서 처리할 수 있어요.

```tsx
const result = await new Promise<boolean>(resolve => {
  overlay.open(({ isOpen, close }) => {
    return (
      <Dialog open={isOpen} onClose={() => close(false)}>
        <DialogTitle>
          계속 진행하시겠어요?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => {
            resolve(true);
            close();
          }}>네</Button>
          <Button onClick={() => {
            resolve(false);
            close();
          }}>아니요</Button>
        </DialogActions>
      </Dialog>
    );
  });
});

if (result) {
  // 사용자가 "네"를 눌렀을 때의 처리
} else {
  // 사용자가 "아니요"를 눌렀을 때의 처리
}
```

## 2. `overlay.openAsync()` 사용하기

더 간단하게 Promise와 함께 오버레이를 사용하고 싶다면 [`overlay.openAsync()`](../reference/overlay.md#overlay-openasync)를 사용할 수 있어요.

[`overlay.openAsync()`](../reference/overlay.md#overlay-openasync)는 [`overlay.open()`](../reference/overlay.md#overlay-open)과 비슷하게 동작하지만, Promise를 반환해서 [`overlay.close()`](../reference/overlay.md#overlay-close)에서 resolve 값을 전달할 수 있어요.

```tsx
const result = await overlay.openAsync<boolean>(({ isOpen, close }) => {
  const agree = () => close(true);
  const cancel = () => close(false);

  return (
    <Dialog open={isOpen} onClose={cancel}>
      <DialogTitle>
        계속 진행하시겠어요?
      </DialogTitle>
      <DialogActions>
        <Button onClick={agree}>네</Button>
        <Button onClick={cancel}>아니요</Button>
      </DialogActions>
    </Dialog>
  );
});

if (result) {
  // 사용자가 "네"를 눌렀을 때의 처리
} else {
  // 사용자가 "아니요"를 눌렀을 때의 처리
}
```
