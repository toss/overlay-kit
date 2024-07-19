---
description: 주요 기능
prev:
  text: 소개
  link: ./introduction.md
next:
  text: 설치
  link: ./installation.md
---

# 주요 기능

## 오버레이 관리

overlay-kit을 사용하면 오버레이를 관리하는 다양한 케이스를 모두 대응할 수 있어요.

꼭 필요한 기능인 오버레이 열기([`overlay.open()`](./reference/overlay.md#overlayopen)), 오버레이 닫기([`overlay.close()`](./reference/overlay.md#overlayclose)), 오버레이가 열려 있는지 여부 확인([`isOpen`](./reference/overlay.md#파라미터))등을 포함한 [다양한 API를 제공](./reference/overlay.md)해요.

예를 들어 다음과 같이 코드를 작성해서 손쉽게 `<Dialog />` 를 열 수 있어요.

```tsx
overlay.open(({ isOpen, close }) => {
  return (
    <Dialog 
      open={isOpen}
      title="Hello, world!" 
      onClose={close}
    />
  );
})
```

자식 요소를 가지는 `<Toast />` 오버레이도 열 수 있죠.

```tsx
overlay.open(({ isOpen, close }) => {
  return (
    <Toast open={isOpen} onClose={close}>
      Hello, world!
    </Toast>
  );
})
```

## Promise와의 호환성

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
