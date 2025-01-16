# React 바깥에서 열기

overlay-kit을 사용하면 React 바깥에서도 오버레이를 열 수 있어요. 

예를 들어 API 오류가 발생했을 때 오버레이를 열고 싶다면 다음과 같이 코드를 작성할 수 있어요. Status Code가 400 이상이라면, `<ErrorDialog />` 오버레이가 렌더링되는 코드예요.

```tsx{8-12}
import ky from 'ky';
import { overlay } from 'overlay-kit';

const api = ky.extend({
  hooks: {
    afterResponse: [
      (_, __, response) => {
        if (response.status >= 400) {
          overlay.open(({ isOpen, close }) => (
            <ErrorDialog open={isOpen} onClose={close} />
          ));
        }
      },
    ],
  },
});
```

API 오류 외에도 사용자 인증 실패나 시스템 경고 등 다양한 상황에서 오버레이를 자유롭게 사용할 수 있어요.