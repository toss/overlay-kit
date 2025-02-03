# Assigning custom id

You can inject a custom `overlayId` by specifying a `string`.

```tsx
function Demo() {
  const openDialog = () => {
    overlay.open(
      ({ isOpen, close, unmount }) => {
        return <Dialog open={isOpen} onClose={close} onExit={unmount} />;
      },
      { overlayId: 'customId' }
    );
  };

  return <Button onClick={openDialog}>Open dialog</Button>;
}
```

::: warning Caution

overlay-kit uses `overlayId` as the `key` for the component. Ensure that the custom ID is unique to avoid conflicts.

:::