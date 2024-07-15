---
description: mui와 함께 사용하기
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

> [!IMPORTANT]
> `<OverlayProvider />`는 React 애플리케이션 전체에서 1개만 렌더링해야 해요.

## 오버레이 열기

`<OverlayProvider />` 안에 오버레이를 열기 위해서는, [overlay.open(...)](../usage/open-overlay.md)을 호출해요.

예를 들어서, Material UI의 `<Dialog />`를 열기 위해서는 아래와 같이 코드를 쓸 수 있어요.

```tsx{1,14-28}
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
        overlay.open(({ isOpen, close }) => (
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
        ));
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

### 보일러 플레이트 줄이기

Promise와 함께 사용될 때마다 `new Promise`를 함께 사용하는 것이 귀찮을 수 있어요.

이를 대응하기 위해서 `overlay.openAsync(...)` API를 지원해요. `overlay.open(...)`과 대부분 동일하며, `close(...)`의 인자로 resolve 값을 전달할 수 있어요.

위의 예제를 `overlay.openAsync(...)`로 다시 구성해볼게요.

```tsx{5-24}
function Example() {
  return (
    <button
      onClick={async () => {
        const agreed = await overlay.open<boolean>(({ isOpen, close }) => {
          const agree = () => close(true);
          const cancel = () => close(false);

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
      }}
    >
      Alert Dialog 열기
    </button>
  );
}
```
