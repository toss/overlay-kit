---
description: Introduction
prev:
  text: overlay-kit 설치
  link: /ko/installation.md
next:
  text: overlay.open
  link: /ko/api/overlay/open.md
---

# 오버레이

화면에 오버레이를 표시합니다.

오버레이는 모달, 대화 상자 등과 같이 별도의 UI 레이어에 표시되는 컴포넌트를 말합니다.

- 이를 사용하려면 `<OverlayProvider />`를 추가해야 합니다.
- open 함수를 여러 번 호출하여 여러 개의 오버레이를 표시할 수 있습니다.
- promise와 함께 사용할 수 있습니다.

## OverlayProvider 설정

`OverlayProvider` 컴포넌트로 앱을 감싸세요.

```tsx
import { OverlayProvider } from 'overlay-kit';

function App() {
  return <OverlayProvider>{/* Your app here */}</OverlayProvider>;
}
```
