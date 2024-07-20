---
description: 튜토리얼
prev:
  text: 설치
  link: ./installation.md
next:
  text: OverlayProvider
  link: ./usage/overlay-provider.md
---

# 튜토리얼

overlay-kit와 Material UI를 사용해서 `<Dialog />`를 사용하는 오버레이를 만들어 볼게요.

## 1. 오버레이 추가하기

overlay-kit으로 오버레이를 열려면 먼저 오버레이가 렌더링될 곳을 지정해야 해요. 일반적으로 애플리케이션 루트에 오버레이를 렌더링합니다. 다른 요소들 위에 오버레이가 보이도록 말이죠.

[`<OverlayProvider />`](./reference/overlay-provider.md) 컴포넌트를 사용하면 됩니다. 애플리케이션 루트에 [`<OverlayProvider />`](./reference/overlay-provider.md)를 추가해 볼게요.

```tsx{1,7,9}
import { OverlayProvider } from 'overlay-kit';

export default function App(props) {
  return (
    // `OverlayProvider`를 앱 최상단에서 렌더링해요.
    // 이제 모든 오버레이는 `<Example />` 바로 옆에 렌더링돼요.
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  )
}
```

이제 overlay-kit으로 열리는 모든 오버레이는 `<Example />` 컴포넌트 옆에 렌더링될 거예요.

::: tip 유의할 점

[`<OverlayProvider />`](./reference/overlay-provider.md)는 React 애플리케이션 전체에서 한 번만 렌더링해야 해요.

:::

## 2. 오버레이 열기

이제 버튼을 클릭했을 때 오버레이를 여는 기능을 추가해볼게요. [`<OverlayProvider />`](./reference/overlay-provider.md) 안에서 오버레이를 열려면 [overlay.open()](./reference/overlay.md#overlayopen)을 호출하면 돼요.

우리는 Material UI의 `<Dialog />`를 열고 싶으니, 다음과 같이 코드를 작성할 수 있어요.

```tsx{1,14-30}
import { overlay } from 'overlay-kit';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Example() {
  return (
    <button
      onClick={() => {
        overlay.open(({ isOpen, close }) => {
          return (
            <Dialog open={isOpen} onClose={close}>
              <DialogTitle>
                정말로 계속하시겠어요?
              </DialogTitle>
              <DialogActions>
                <Button onClick={close}>
                  아니요
                </Button>
                <Button onClick={close}>
                  네
                </Button>
              </DialogActions>
            </Dialog>
          )
        });
      }}
    >
      Alert Dialog 열기
    </button>
  );
}
```

overlay-kit을 사용하면 이렇게 직관적으로 오버레이를 열 수 있어요. 위 예시처럼 `overlay` 객체를 import하고, [`overlay.open()`](./reference/overlay.md#overlayopen)을 호출하면 돼요.

[`overlay.open()`](./reference/overlay.md#overlayopen) API는 오버레이를 열고 닫기 위한 모든 프로퍼티를 제공해요. [레퍼런스](./reference/overlay.md)를 확인해 보세요.

## 3. 사용자가 클릭한 버튼 결과 처리하기

이제 사용자가 어떤 버튼을 클릭했는지 알고 싶어요. overlay-kit은 Promise와 함께 사용할 수 있기 때문에 쉽게 오버레이로부터 결과를 얻어올 수 있죠. 다음과 같이 `boolean` 값을 가지는 `Promise`로 감싸면 돼요.

```tsx{5,7-10,12-15,35-38}
function Example() {
  return (
    <button
      onClick={async () => {
        const agreed = await new Promise<boolean>(resolve => {
          overlay.open(({ isOpen, close }) => {
            const agree = () => {
              resolve(true);
              close();
            };

            const cancel = () => {
              resolve(false);
              close();
            };

            return (
              <Dialog open={isOpen} onClose={cancel}>
                <DialogTitle>
                  정말 계속하시겠어요?
                </DialogTitle>
                <DialogActions>
                  <Button onClick={cancel}>
                    아니요
                  </Button>
                  <Button onClick={agree}>
                    네
                  </Button>
                </DialogActions>
              </Dialog>
            )
          });
        });

        /*
         * 사용자가 "네"를 눌렀다면, `agreed` 는 `true`가 돼요.
         * 아니면, `agreed`는 `false`예요.
         */
      }}
    >
      Alert Dialog 열기
    </button>
  );
}
```

## 4. 오류 처리하기

마지막으로 API 오류가 발생했을 때를 대비해 [React 외부에서 오버레이를 열어](./advanced/outside-react-overlay.md) 확인할 수 있도록 해 볼게요.

```tsx
import ky from 'ky';
import { overlay } from 'overlay-kit';

const api = ky.extend({
  hooks: {
    afterResponse: [
      (_, __, response) => {
        if (response.status >= 400) {
          overlay.open(({ isOpen, close }) => {
            return <ErrorDialog open={isOpen} onClose={close} />;
          });
        }
      },
    ],
  },
});
```

이렇게 구현하면 쉽고 간단하게 사용자에게 더 나은 오버레이 경험을 제공할 수 있어요. 오버레이에 커스텀 ID 지정하거나, 오버레이 애니메이션을 처리해서 더 자연스러운 사용자 경험을 구현하고 싶다면 '더 알아보기'를 참고하세요.
