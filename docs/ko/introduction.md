---
next:
  text: 기능
  link: ./features.md
---

# 소개

overlay-kit은 React로 웹 서비스를 개발할 때 자주 사용되는 오버레이를 쉽게 관리할 수 있도록 도와주는 라이브러리입니다. 오버레이를 열고 닫는 동작을 선언적으로 다루기 때문에 코드 가독성과 유지보수성이 높아져요.

## 상태 관리가 쉬워져요

overlay-kit을 사용하면 오버레이 상태 관리가 간단해져요.

오버레이를 열고 닫는 상태를 관리하려면 여러 개의 상태 변수와 함수를 정의해야 해요. 코드는 복잡해지고 관리해야 할 코드가 많았어요. 이제 overlay-kit으로 오버레이 상태를 관리하세요.

## 보일러플레이트가 간결해져요

오버레이를 구현하기 위해 반복적으로 비슷한 코드를 작성할 필요가 없어요.

보일러 플레이트는 코드베이스를 불필요하게 길게 만들고 유지보수를 어렵게 합니다. overlay-kit은 반복적인 코드를 줄여 코드베이스를 간결하게 만들어 줍니다.

## 코드 응집도가 높아져요

overlay-kit을 사용하면 코드를 한눈에 파악할 수 있어요.

오버레이를 여는 로직, 상태 변경 로직, 오버레이 컴포넌트가 코드에서 멀리 떨어져 있으면 코드 흐름을 파악하기 어려워요. 이렇게 코드 응집도가 낮으면 가독성이 떨어지고 버그가 발생하기 쉬워요. 이제 overlay-kit을 사용해서 코드의 응집도를 높이고 가독성을 향상시켜보세요.

## 코드 한 눈에 비교하기

overlay-kit를 사용하면 React 오버레이 관리가 쉬워져요. 예제 코드로 변화를 살펴볼게요.

![overlay-kit 사용 전후 코드 비교](/public/images/overlay-kit-after.png)

### Before: 기존 React 오버레이 구현 코드

overlay-kit를 사용하기 전에는 보일러플레이트 코드가 많고, React의 Hook 규칙 때문에 상태 선언, 변경, 렌더링 로직이 분리되어 코드의 흐름이 끊겨있어요. `isOpen` 상태를 선언하는 곳, 상태를 바꾸는 `onClick`, 상태에 따라서 렌더링하는 `<Dialog />` 컴포넌트가 멀리 떨어져 있죠.

```tsx{4,10-12,17-22}
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
        열기
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

### After: overlay-kit를 사용한 오버레이 구현

반면 overlay-kit을 사용한 코드를 보면 코드 응집도가 높고 직관적이에요. 버튼을 클릭하면 오버레이가 열린다라고 하는 코드의 흐름이 한 눈에 들어오죠.

```tsx{10-14}
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

보일러플레이트 코드도 크게 줄었어요. 오버레이 상태를 더 이상 직접 관리하지 않아도 되거든요.
