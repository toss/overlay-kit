# Promise와 함께 사용하기

overlay-kit은 Promise와 함께 사용하기도 쉬운데요. 복잡한 유즈케이스가 오버레이와 연결되어 있을 때도 오버레이로부터 결과값을 받아 처리할 수 있어요. 여러 상태를 정의한 뒤, 복잡한 콜백 구조를 가진 코드를 만들 필요가 없죠.

예를 들어 아래와 같이 사용자의 승인 결과를 받아 처리하는 `<Dialog />`를 렌더링 할 때도 마치 DOM API의 [`confirm()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)을 사용할 때처럼 쉽게 코드를 작성할 수 있어요.

```tsx
const result = await new Promise<boolean>(resolve => {
  overlay.open(({ isOpen, close }) => {
    return (
      <AlertDialog 
        open={isOpen} 
        title="Are you sure?"
        onConfirm={() => {
          resolve(true);
          close();
        }}
        onCancel={() => {
          resolve(false);
          close();
        }} 
      />
    )
  })
});
```
