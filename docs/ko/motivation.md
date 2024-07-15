---
next:
  text: overlay-kit의 기능
  link: ./features.md
---

# 왜 사용하나요?

overlay-kit이 해결하는 문제를 설명해요.

## 오버레이 문제

React로 웹 서비스를 만들 때 많은 오버레이를 사용해요. `<Dialog />`, `<Toast />`, and `<Drawer />`가 대표적인 예시죠. 그런데 오버레이를 관리하는 것은 생각보다 힘들어요.
예를 들어서 아래와 같이 다이얼로그를 여는 예시를 생각해 볼게요.

```tsx
import { useState } from 'react';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  /* 다른 Hook 호출 ... */

  return (
    <>
      {/* 다른 컴포넌트 ... */}
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open
      </Button>
      {/* 다른 컴포넌트... */}
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

몇 가지의 문제점이 보여요. 먼저 보일러플레이트 코드가 많고, React의 Hook 규칙때문에 코드의 흐름이 잘 보이지 않아요.
`isOpen` 상태를 선언하는 곳과, 그 상태를 바꾸는 `onClick`, 그리고 그 상태에 따라서 렌더링하는 `<Dialog />` 컴포넌트가 멀리 떨어져 있어요.
코드의 응집도가 떨어지는 것이죠.

## 해결책

overlay-kit을 사용하면 오버레이를 선언적이고 쉽게 관리할 수 있어요. 예를 들어서, 앞선 다이얼로그 관리를 아래와 같이 단순하게 할 수 있어요.

```tsx
import { overlay } from 'overlay-kit';

function MyPage() {
  /* 다른 Hook 호출 ... */

  return (
    <>
      {/* 다른 컴포넌트... */}
      <Button
        onClick={() => {
          overlay.open(({ isOpen, close }) => {
            return <Dialog open={isOpen} onClose={close} />;
          });
        }}
      >
        열기
      </Button>
    </>
  );
}
```

이렇게 코드를 작성하면 보일러플레이트 코드를 크게 줄일 수 있어요. `isOpen` 이라고 하는 상태를 더 이상 손으로 관리하지 않아도 되거든요.
또한, 버튼을 클릭하면 오버레이가 열린다라고 하는 코드의 흐름이 한 눈에 들어와요. 코드의 응집성이 올라가고, 훨씬 직관적으로 읽을 수 있죠.

이렇게 overlay-kit은 오버레이를 열고 닫는 동작을 단순하게 함으로써 코드 가독성과 유지보수성을 높여줘요.
