# Custom ID 지정하기

`overlayId`를 사용자가 직접 주입해서 대체할 수 있어요. `string`을 입력해주세요.

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
