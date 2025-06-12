![](./docs/public/og.png)

# overlay-kit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/overlay-kit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/overlay-kit/graph/badge.svg?token=JBEAQTL7XK)](https://codecov.io/gh/toss/overlay-kit) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/toss/overlay-kit)

English | [한국어](https://github.com/toss/overlay-kit/blob/main/README-ko_kr.md)

overlay-kit is a library for declaratively managing overlays like modals, popups, and dialogs in React.

You can efficiently implement overlays without complex state management or unnecessary event handling.

```sh
npm install overlay-kit
```

## Example

### Opening Simple Overlays

You can easily open and close overlays using `overlay.open`.

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

### Opening Asynchronous Overlays

You can handle overlay results as a `Promise` using `overlay.openAsync`.

```tsx
import { overlay } from 'overlay-kit';

<Button
  onClick={async () => {
    const result = await overlay.openAsync<boolean>(({ isOpen, close, unmount }) => (
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

## Why use overlay-kit?

### Problems with Traditional Overlay Management**

1. Complexity of State Management
   - Had to manage overlay state directly using useState or global state.
   - Code became complex and less readable as state management mixed with UI logic.
2. Repetitive Event Handling
   - Had to repeatedly write event handling code for opening, closing, and returning results.
   - This led to code duplication and degraded development experience.
3. Lack of Reusability
   - UI and logic were tightly coupled through callback functions to return values from overlays.
   - This made it difficult to reuse components.

### Goals of overlay-kit

1. Design Following React Philosophy
   - React favors declarative code.
   - overlay-kit helps manage overlays declaratively.
2. Improve Development Productivity
   - By encapsulating state management and event handling, developers can focus solely on UI and business logic.
3. Enhance Extensibility and Reusability
   - Increased overlay reusability by separating UI and behavior, and returning Promises.


## License

MIT © Viva Republica, Inc. See [LICENSE](https://github.com/toss/overlay-kit/blob/main/LICENSE) for details.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
