# Opening Outside of React

With overlay-kit, you can open overlays even outside of React.

For example, if you want to open an overlay when an API error occurs, you can write the code as follows. If the status code is 400 or above, the `<ErrorDialog />` overlay will be rendered.

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

In addition to API errors, you can freely use overlays in various situations such as user authentication failures or system warnings.