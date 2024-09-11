![](./docs/public/og.png)

# overlay-kit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/overlay-kit/blob/main/LICENSE)

[English](https://github.com/toss/overlay-kit/blob/main/README.md) | 한국어

overlay-kit은 React에서 오버레이를 선언적으로 관리하기 위한 라이브러리예요.

```tsx
import { overlay } from 'overlay-kit';

<Button 
  onClick={() => {
    overlay.open(({ isOpen, close }) => {
      return <Dialog open={isOpen} onClose={close} />;
    })
  }}
>
  Open
</Button>
```

overlay-kit은 다음과 같은 기능을 제공해요.

- **간편한 오버레이 관리**: overlay-kit로 오버레이를 간단하게 열고 닫을 수 있어요. `overlay.open(...)` 함수 호출 한 번으로 끝나죠. [코드 비교](https://overlay-kit.slash.page/ko/code-comparison.html) 문서를 참고해보세요.
- **호환성**: overlay-kit로 거의 모든 오버레이를 다룰 수 있어요. Material UI부터 사내 컴포넌트 라이브러리까지, 대부분의 오버레이에 이미 대응되어 있답니다.
- **Promise 통합**: overlay-kit과 Promise를 함께 사용하면 오버레이로부터 결괏값을 쉽게 가져올 수 있어요.
- **견고한 내장 타입**: overlay-kit은 모든 함수에 대해서 견고한 타입을 제공해요. 타입 안정성이 높고, 개발자 경험도 좋죠.


## License

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](https://github.com/toss/overlay-kit/blob/main/LICENSE)를 참고하세요.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
