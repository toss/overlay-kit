# Using with Promise

Using overlay-kit with Promises is straightforward. Even for complex use cases linked with overlays, you can handle the results directly from the overlay without needing to define multiple states or create complex callback structures.

There are two ways to use overlays with Promises in overlay-kit: the basic method using `new Promise`, and using the built-in [`overlay.openAsync()`](../reference/overlay.md#overlay-openasync) method provided by overlay-kit.

Let's look at both methods with example code that renders a `<Dialog />` and processes the result provided by the user.

## 1. Using `new Promise`

The basic method involves using JavaScript's built-in Promise object to handle the overlay's result. With `new Promise`, you can receive the resolved value when the overlay is closed and perform subsequent actions. It's similar to using the DOM API's [confirm()](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), where you handle the user's choice.

```tsx
const result = await new Promise<boolean>(resolve => {
  overlay.open(({ isOpen, close }) => {
    return (
      <Dialog open={isOpen} onClose={() => close(false)}>
        <DialogTitle>
          Do you want to proceed?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => {
            resolve(true);
            close();
          }}>Yes</Button>
          <Button onClick={() => {
            resolve(false);
            close();
          }}>No</Button>
        </DialogActions>
      </Dialog>
    );
  });
});

if (result) {
  // Handle the case when the user clicked "Yes"
} else {
  // Handle the case when the user clicked "No"
}
```

## 2. Using `overlay.openAsync()`

For a simpler way to use overlays with Promises, you can use [`overlay.openAsync()`](../reference/overlay.md#overlay-openasync).

[`overlay.openAsync()`](../reference/overlay.md#overlay-openasync) works similarly to [`overlay.open()`](../reference/overlay.md#overlay-open) but returns a Promise, allowing you to pass a resolve value from [`overlay.close()`](../reference/overlay.md#overlay-close).

```tsx
const result = await overlay.openAsync<boolean>(({ isOpen, close }) => {
  const agree = () => close(true);
  const cancel = () => close(false);

  return (
    <Dialog open={isOpen} onClose={cancel}>
      <DialogTitle>
        Do you want to proceed?
      </DialogTitle>
      <DialogActions>
        <Button onClick={agree}>Yes</Button>
        <Button onClick={cancel}>No</Button>
      </DialogActions>
    </Dialog>
  );
});

if (result) {
  // Handle the case when the user clicked "Yes"
} else {
  // Handle the case when the user clicked "No"
}
```
