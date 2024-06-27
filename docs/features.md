---
description: Features
prev:
  text: Why overlay-kit?
  link: ./motivation.md
next:
  text: Installation
  link: ./installation.md
---

# Features of overlay-kit

overlay-kit helps you manage overlays in React, making the process straightforward and hassle-free. Here are the key features of overlay-kit:

## Code Simplification

overlay-kit minimizes the need for boilerplate code. For more details, refer to the "[Why overlay-kit?](./motivation.md)" document.

## Maximum Compatibility

overlay-kit is designed to be compatible with the majority of overlay types. It provides all the essential APIs—`isOpen`, `open`, and `close`—needed to manage overlays efficiently.

For instance, you can easily open a `<Dialog />` with overlay-kit:

```tsx
overlay.open(({ isOpen, close }) => {
  return (
    <Dialog 
      open={isOpen}
      title="Hello, world!" 
      onClose={close}
    />
  );
})
```

Similarly, overlay-kit can handle a `<Toast />` that accepts children:

```tsx
overlay.open(({ isOpen, close }) => {
  return (
    <Toast open={isOpen} onClose={close}>
      Hello, world!
    </Toast>
  );
})
```

This simple yet powerful design allows you to manage various scenarios with ease.

## Seamless Integration with Promises

overlay-kit integrates seamlessly with promises in React, simplifying complex interactions. 

For example, determining if a user has agreed via a `<Dialog />` is as straightforward as using the native DOM API `confirm(...)`:

```tsx
const result = await new Promise<boolean>(resolve => {
  overlay.open(({ isOpen, close }) => {
    return (
      <AlertDialog 
        open={isOpen} 
        title="Are you sure?"
        onConfirm={() => {
          resolve(true);
          close();
        }}
        onCancel={() => {
          resolve(false);
          close();
        }} 
      />
    )
  })
});
```

This approach is simpler and cleaner compared to managing multiple states or handling complex callback chains.

## Robust Built-in Types

overlay-kit provides robust types for all functions, ensuring type safety and enhancing developer experience.
