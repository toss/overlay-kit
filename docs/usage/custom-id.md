# Assignment Custom id

Allows the user to replace the randomly generated `overlayId` with a specified `string`.

```tsx
function Demo() {
  const openDialog = () => {
    overlay.open(
      ({ isOpen, close, unmount }) => {
        return <Dialog opened={isOpen} onClose={close} onExit={unmount} />;
      },
      { overlayId: 'customId' }
    );
  };

  return <Button onClick={openDialog}>Open dialog</Button>;
}
```
