![](./docs/public/og.png)

# overlay-kit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/overlay-kit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/overlay-kit/graph/badge.svg?token=JBEAQTL7XK)](https://codecov.io/gh/toss/overlay-kit)

[English](https://github.com/toss/overlay-kit/blob/main/README.md) | 한국어

overlay-kit은 React에서 모달, 팝업, 다이얼로그 같은 오버레이를 선언적으로 관리하기 위한 라이브러리예요.

복잡한 상태 관리나 불필요한 이벤트 핸들링 없이, 효율적으로 오버레이를 구현할 수 있어요.

```sh
npm install overlay-kit
```

## 예제

### 간단한 오버레이 열기

`overlay.open`을 사용하면 오버레이를 간단하게 열고 닫을 수 있어요.

```tsx
import { overlay } from 'overlay-kit';

<Button
  onClick={() => {
    overlay.open(({ isOpen, close, unmount }) => (
      <Dialog open={isOpen} onClose={close} onExit={unmount} />
    ))
  }}
>
  Open
</Button>
```

### 비동기 오버레이 열기

`overlay.openAsync`를 사용하면 오버레이의 결과를 `Promise`로 처리할 수 있어요.

```tsx
import { overlay } from 'overlay-kit';

<Button
  onClick={async () => {
    const result = await overlay.openAsync<boolean>(({ isOpen, close }) => (
      <Dialog
        open={isOpen}
        onConfirm={() => close(true)}
        onClose={() => close(false)}
        onExit={unmount}
      />
    ))
  }}
>
  Open
</Button>
```

## overlay-kit을 사용하는 이유

### 기존 오버레이 관리의 문제점

1. 상태 관리의 복잡성
   - useState나 전역 상태를 사용해 직접 오버레이 상태를 관리해야 했어요.
   - 상태 관리와 UI 로직이 섞여 코드가 복잡해지고 가독성이 떨어졌어요.
2. 이벤트 핸들링의 반복
   - 열기, 닫기, 결과 반환 같은 이벤트 핸들링 코드를 반복해서 작성해야 했어요.
   - 이는 중복 코드를 유발하고 개발 경험을 저하시키는 주요 원인이 되었어요.
3. 재사용성 부족
   - 오버레이에서 값을 반환하려면 callback 함수 등으로 UI와 로직이 강하게 결합되었어요.
   - 이로 인해 컴포넌트를 재사용하기 어려웠어요.

### overlay-kit의 목표

1. React 철학을 따르는 설계
   - React는 선언적인 코드를 지향해요.
   - overlay-kit은 오버레이를 선언적으로 관리할 수 있게 도와줘요.
2. 개발 생산성 향상
   - 상태 관리와 이벤트 핸들링을 캡슐화해, 개발자는 UI와 비즈니스 로직에만 집중할 수 있어요.
3. 확장성과 재사용성 강화
   - UI와 동작을 분리하고, Promise를 반환하는 방식으로 오버레이의 재사용성을 높였어요.

## License

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](https://github.com/toss/overlay-kit/blob/main/LICENSE)를 참고하세요.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
