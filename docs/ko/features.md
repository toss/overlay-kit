---
description: 기능
prev:
  text: 왜 사용하나요?
  link: ./motivation.md
next:
  text: 설치
  link: ./installation.md
---

# overlay-kit의 기능

overlay-kit은 React에서 오버레이 관리를 직관적이고 쉽게 할 수 있도록 도와요. 핵심 기능은 다음과 같아요.

## 단순한 코드

overlay-kit은 오버레이 관리에 필요한 보일러플레이트 코드를 최소화시켜줘요. 자세한 내용은 [왜 사용하나요?](./motivation.md) 문서를 참고해주세요.

## 높은 호환성

overlay-kit으로 대부분의 오버레이를 관리할 수 있어요. 꼭 필요한 `isOpen`, `open`, `close`를 비롯해서, 오버레이를 효율적으로 관리하기 위한 대부분의 API를 제공하고 있기 때문이죠.

예를 들어서, 아래와 같이 코드를 씀으로써 손쉽게 `<Dialog />` 를 열 수 있어요.

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

비슷하게, children을 가지는 `<Toast />` 오버레이도 열 수 있죠.

```tsx
overlay.open(({ isOpen, close }) => {
  return (
    <Toast open={isOpen} onClose={close}>
      Hello, world!
    </Toast>
  );
})
```

이렇게 overlay-kit은 오버레이를 열고 닫는 다양한 케이스에 대해서 모두 대응하고 있어요.

## Promise와의 호환성

overlay-kit은 Promise와도 쉽게 사용할 수 있어요. 오버레이로부터 결괏값을 받는 더 복잡한 유스케이스에 대해서도 쉽게 대응할 수 있어요.

예를 들어서, 아래와 같이 사용자에게서 승인을 받는 `<Dialog />`를 렌더링하려고 하는 경우가 있어요. 마치 DOM API의 `confirm(...)`을 사용하는 것처럼 쉽게 코드를 작성할 수 있어요.

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

overlay-kit을 사용하지 않는다면, 여러 개의 상태를 정의하고 callback이 다른 callback을 부르는 복잡한 코드가 되기 쉬워요.

## 강력한 빌트인 타입

overlay-kit은 모든 함수에 대해서 강력한 타입을 내장해서 제공하고 있어요. 개발자들은 타입 안전하게 코딩하고, 미리 오류를 감지할 수 있어요.
