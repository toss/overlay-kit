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

overlay-kit의 쉽고 간단한 API를 소개드려요. 이 튜토리얼에서는 Material UI의 `<Dialog />` 컴포넌트를 여는 버튼을 만들어 볼게요.

## 앱에 `OverlayProvider` 추가하기

overlay-kit으로 오버레이를 열기 위해서는, 먼저 열린 오버레이들이 렌더링될 곳을 지정해야 해요. 일반적으로는, 다른 요소들 위에 오버레이가 보이도록, 애플리케이션 루트에 오버레이를 렌더링해요.
`<OverlayProvider />` 컴포넌트를 사용할 수 있어요.

애플리케이션 루트에 `OverlayProvider` 를 추가해 봅시다.

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

이제 overlay-kit으로 열리는 모든 오버레이는 `<Example />` 컴포넌트 옆에 렌더링될거예요.

> [!IMPORTANT] > `<OverlayProvider />`는 React 애플리케이션 전체에서 1개만 렌더링해야 해요.

## 오버레이 열기

`<OverlayProvider />` 안에 오버레이를 열기 위해서는, [overlay.open(...)](./usage/overlay.md)을 호출해요.

예를 들어서, Material UI의 `<Dialog />`를 열기 위해서는 아래와 같이 코드를 쓸 수 있어요.

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

overlay-kit으로 직관적으로 오버레이를 열 수 있는데요, 위 예시처럼 `overlay` 객체를 import하고, `overlay.open(...)`을 호출하면 끝나요.

`overlay.open(...)` API는 오버레이를 열고 닫기 위한 모든 프로퍼티를 제공해요.

- `isOpen`: 오버레이가 열려 있는지를 나타내요. 오버레이가 닫히면, `isOpen`은 `true`에서 `false`로 바뀌어요. 오버레이가 닫히는 애니메이션이 있는 경우에 유용해요.
- `close`: 오버레이를 닫고, `isOpen`을 `false`로 설정해요.
- `unmount`: 오버레이를 React의 요소 트리에서 완전히 제거해서 Unmount시켜요.

## Promise와 사용하기

위 예시에서, 사용자가 "네" 나 "아니요" 중 어떤 버튼을 클릭했는지 알고 싶을 수 있어요. 그런 경우에는 `boolean` 값을 가지는 `Promise`로 감싸면 돼요.

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

이렇게 overlay-kit은 `Promise`와 함께 사용됨으로써 쉽게 오버레이로부터 결과를 얻어올 수 있어요.

## React 바깥에서 오버레이 열기

overlay-kit을 사용하면, React 바깥에서도 오버레이를 열 수 있어요. 예를 들어서, API 오류가 발생했을 때 오버레이를 열고 싶을 수 있어요. 그러면 아래와 같이 코드를 작성할 수 있어요.

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

여기에서 Status Code가 400 이상이라면, `<ErrorDialog />` 오버레이가 렌더링돼요. 여기에서는 `ky` 를 사용했지만, 다른 라이브러리에서도 비슷하게 코드를 작성할 수 있어요.
