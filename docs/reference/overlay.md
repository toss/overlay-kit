# overlay Object

The `overlay` object provides an API for managing overlays in React, accommodating various use cases for overlay management.

- [overlay.open()](#overlay-open)
- [overlay.openAsync()](#overlay-openasync)
- [overlay.close()](#overlay-close)
- [overlay.closeAll()](#overlay-closeall)
- [overlay.unmount()](#overlay-unmount)
- [overlay.unmountAll()](#overlay-unmountall)

## overlay.open()

Opens an overlay.

### Interface

```tsx
overlay.open(
  callback: (props: { isOpen: boolean, close: () => void, unmount: () => void }) => JSX.Element,
  options?: { overlayId?: string }
): string;
```

### Parameters

- `callback` (function): A callback function containing the overlay’s state, close, and unmount functions.
  - `isOpen` (boolean): Indicates if the overlay is open.
  - `close` (function): A function to close the overlay, setting `isOpen` to `false`.
  - `unmount` (function): A function to completely remove the overlay from the React element tree.
- `options` (object): An object defining overlay settings (optional).
  - `overlayId` (string): The ID generated when the overlay opens.


### Return Value

Returns a unique ID generated when the overlay opens.

### Example

```tsx
const overlayId = overlay.open(
  ({ isOpen, close, unmount }) => {
    return (
      <Dialog open={isOpen} onClose={close} onExit={unmount}>
        {/* Dialog content */}
      </Dialog>
    );
  },
  { overlayId: 'overlay-01' }
);

// To close the overlay later
overlay.close(overlayId);

// To unmount the overlay later
overlay.unmount(overlayId);
```

## overlay.openAsync()

Opens an overlay and can be used with Promises.

This method works similarly to [`overlay.open()`](#overlay-open) but returns a Promise, allowing you to pass a resolve value from `overlay.close()`. For detailed usage, refer to [Using with Promises](../advanced/promise.md).

### Interface

```tsx{5}
overlay.openAsync(
  callback: (props: { isOpen: boolean, close: (result?: any) => void, unmount: () => void }) => JSX.Element,
  options?: { overlayId?: string }
): Promise<any>;
```

### Parameters

- `callback` (function): A callback function containing the overlay’s state, close, and unmount functions.
  - `isOpen` (boolean): Indicates if the overlay is open.
  - `close` (function): A function to close the overlay, setting `isOpen` to `false`.
  - `unmount` (function): A function to completely remove the overlay from the React element tree.
- `options` (object): An object defining overlay settings (optional).
  - `overlayId` (string): The ID generated when the overlay opens.

### Return Value

Returns a Promise that resolves with the value passed to close.

### Example

```tsx
function Example() {
  return (
    <button
      onClick={async () => {
          const agreed = await overlay.openAsync<boolean>(({ isOpen, close }) => {
          const agree = () => close(true);
          const cancel = () => close(false);

          return (
            <Dialog open={isOpen} onClose={cancel}>
              <DialogTitle>
                Do you really want to continue?
              </DialogTitle>
              <DialogActions>
                <Button onClick={cancel}>No</Button>
                <Button onClick={agree}>Yes</Button>
              </DialogActions>
            </Dialog>
          );
        });

        if (agreed) {
          // Handle user clicking "Yes"
        } else {
          // Handle user clicking "No"
        }
      }}
    >
      Open Alert Dialog
    </button>
  );
}
```

## overlay.close()

Closes a specific overlay.

Calling this method removes the overlay from the screen, but it remains in memory and the React element tree. To completely remove the overlay, call [`overlay.unmount()`](#overlay-unmount) after the animation finishes.

### Interface

```tsx
overlay.close(overlayId: string): void;
```

### Parameters

- overlayId: The ID of the overlay to close.

### Example

```tsx
const overlayId = overlay.open(({ isOpen, close, unmount }) => {
  return (
    <Dialog open={isOpen} onClose={close} onExit={unmount}>
      {/* Dialog content */}
    </Dialog>
  );
});

// Close the overlay
overlay.close(overlayId);
```

## overlay.closeAll()

Closes all open overlays.

Calling this method removes all overlays from the screen, but they remain in memory and the React element tree. To completely remove the overlays, call [`overlay.unmountAll()`](#overlay-unmountall) after the animation finishes.

### Interface

```tsx
overlay.closeAll(): void;
```

## overlay.unmount()

Completely removes a specific overlay from memory and the React element tree.

### Interface

```tsx
overlay.unmount(overlayId: string): void;
```

### Parameters

- `overlayId`: The ID of the overlay to remove from the React element tree.

### Example

```tsx
const overlayId = overlay.open(({ isOpen, close, unmount }) => {
  return (
    <Dialog open={isOpen} onClose={close} onExit={unmount}>
      {/* Dialog content */}
    </Dialog>
  );
});

// Unmount the overlay
overlay.unmount(overlayId);
```

## overlay.unmountAll()

Completely removes all overlays from memory and the React element tree.

### Interface

```tsx
overlay.unmountAll(): void;
```
