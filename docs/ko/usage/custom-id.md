# custom id 지정하기

랜덤으로 생성되는 `overlayId`를 사용자가 직접 주입해서 대체할 수 있어요. `string`을 입력해주세요.

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

> [!WARNING]
> overlay-kit은 `overlayId`를 컴포넌트의 `key`로 사용하고 있어요. custom id가 중복되지 않도록 주의해주세요.