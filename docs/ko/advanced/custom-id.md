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

::: warning 주의할 점

overlay-kit은 `overlayId`를 컴포넌트의 `key`로 사용하고 있어요. Custom ID가 중복되지 않도록 주의하세요.

:::